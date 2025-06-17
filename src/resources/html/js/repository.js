import inRange from 'lodash/inRange';
import orderBy from 'lodash/orderBy';

import config from './config';

export const EMPTY_ROOT = { path: '/', children: [] };

export default class Repository {
	constructor(root = EMPTY_ROOT) {
		this.root = root;
	}

	get root() {
		return this._root;
	}

	set root(root) {
		this._root = root;
		this.current = config.defaultFolderPath
			? (this.fromPath(config.defaultFolderPath) ?? EMPTY_ROOT)
			: root;
	}

	get current() {
		return this._current;
	}

	set current(current) {
		let files;
		const folders = current.children.filter((node) => node.isFolder);

		if (config.recursive) {
			files = [];
			const stack = [current];
			while (stack.length > 0) {
				const node = stack.pop();
				if (node.isFolder) {
					for (let i = 0; i < node.children.length; i++) {
						stack.push(node.children[i]);
					}
				} else if (this.isFileFiltered(node)) {
					files.push(node);
				}
			}
		} else {
			files = current.children.filter((node) => !node.isFolder && this.isFileFiltered(node));
		}

		this._files = this.orderFiles(files);
		this._folders = this.orderFiles(folders);

		this._current = current;
	}

	get parent() {
		return this.current.parent
			? this.fromPath(this.current.parent)
			: null;
	}

	get files() {
		return this._files;
	}

	get folders() {
		return this._folders;
	}

	applyFilters(folder = this.current) {
		if (typeof folder === 'string') {
			folder = this.fromPath(folder);
		}

		this.current = folder ?? this.root;
	}

	isFileFiltered(file) {
		return (
			// HOME
			// ====
			// If this filter is true, the file must be marked as home.
			!config.filterHome || (config.filterHome && file.isHome)
		) && (
			// FAVORITES
			// =========
			// If this filter is true, the file must be marked as favorite.
			!config.filterFavorites || (config.filterFavorites && file.isFavorite)
		) && (
			// RECENTS
			// =======
			// If this filter is true, the file must be marked as recent.
			!config.filterRecents || (config.filterRecents && file.isRecent)
		) && (
			// EXTENSIONS
			// ==========
			// The file extension must be in the list of allowed extensions.
			config._allowedExtensionsRegex.test(file.extension)
		) && (
			// SEARCH TERMS
			// ============
			(
				// If search terms are empty, the search is omitted.
				config._searchTerms.length === 0
			) || (
				// If search in title is enabled, the search terms must appear in the title.
				config.searchInTitle
				&& config._searchTermsRegex.test(file.title)
			) || (
				// If search in description is enabled, the search terms must appear in the description.
				config.searchInDescription
				&& config._searchTermsRegex.test(file.description)
			) || (
				// If search in tags is enabled, the search terms must appear in the tags.
				config.searchInTags && file.properties.tags
				&& file.properties.tags.some((tag) => config._searchTermsExactRegex.test(tag.value))
			)
		) && (
			// DATE RANGES
			// ===========
			(
				// If the minimum and maximum dates are invalid, the date is not checked.
				Number.isNaN(config._dateMinEpoch) && Number.isNaN(config._dateMaxEpoch)
			) || (
				// If the minimum date is valid but the maximum date is not, check only the minimum date.
				!Number.isNaN(config._dateMinEpoch) && Number.isNaN(config._dateMaxEpoch)
				&& new Date(file[config.dateProperty]).getTime() > config._dateMinEpoch
			) || (
				// If the maximum date is valid but the minimum date is not, check only the maximum date.
				Number.isNaN(config._dateMinEpoch) && !Number.isNaN(config._dateMaxEpoch)
				&& new Date(file[config.dateProperty]).getTime() < config._dateMaxEpoch
			) || (
				// If the minimum and maximum dates are valid, check both.
				!Number.isNaN(config._dateMinEpoch) && !Number.isNaN(config._dateMaxEpoch)
				&& inRange(new Date(file[config.dateProperty]).getTime(), config._dateMinEpoch, config._dateMaxEpoch)
			)
		);
	}

	orderFiles(files) {
		return orderBy(files, [
			(file) => file.title,
			(file) => file.name,
		]);
	}

	splitPath(path = '') {
		return path.replace(/(.+)\/$/, '$1').match(/\/[^/]*/g);
	}

	fromPath(path = '') {
		const splitted = this.splitPath(path);
		if (!splitted) {
			return null;
		}

		let node = this.root;
		if (node.path === path) {
			return node;
		}

		let fragment = '';
		for (let i = 0; i < splitted.length; i++) {
			let match;
			fragment += splitted[i];
			for (let j = 0; j < node.children.length; j++) {
				if (fragment === node.children[j].path) {
					match = node.children[j];
					break;
				}
			}
			if (match) {
				node = match;
			} else {
				return null;
			}
		}

		return node;
	}

	fromId(id = '') {
		const stack = [this.root];

		while (stack.length > 0) {
			const node = stack.pop();
			if (node.id === id) {
				return node;
			}
			if (node.isFolder) {
				for (let i = 0; i < node.children.length; i++) {
					stack.push(node.children[i]);
				}
			}
		}

		return null;
	}
}
