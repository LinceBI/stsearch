import clamp from 'lodash/clamp';
import debounce from 'lodash/debounce';
import {html} from 'lit-html';

import bsCustomFileInput from 'bs-custom-file-input';
import Tagify from '../vendor/tagify';
import Noty from '../vendor/noty';

import {trigger, override, imageToDataURI, strToBool, safeJSON} from '../helpers';

import config from '../config';

import RemoteRepositoryAPI from '../api/remote-repository-api';
import {EMPTY_ROOT} from '../repository';

import BaseElement from './base-element';
import EmptyElement from './empty-element';
import SearchBannerElement from './search-banner-element';
import SearchFilterFormElement from './search-filter-form-element';
import SearchFolderListElement from './search-folder-list-element';
import SearchFileListElement from './search-file-list-element';
import SearchFileEditModalElement from './search-file-edit-modal-element';
import SearchPaginationElement from './search-pagination-element';

export default class SearchContainerElement extends BaseElement {
	constructor(...args) {
		super(...args);
		this.className = 'search-container-element';
		this.currentEditingFile = null;
		this.pageNumber = 0;
	}

	get template() {
		if (config.enableBanner) {
			this.searchBannerElement = new SearchBannerElement(null);
		} else {
			this.searchBannerElement = new EmptyElement();
		}

		if (config.enableFilters) {
			this.searchFilterFormElement = new SearchFilterFormElement(null, {
				formSubmitCallback: formObj => {
					override(config, {
						searchTerms: formObj['search-terms'],
						searchInTitle: strToBool(formObj['search-in-title']),
						searchInDescription: strToBool(formObj['search-in-description']),
						searchInTags: strToBool(formObj['search-in-tags']),
						allowedExtensions: formObj['allowed-extensions'],
						dateMin: formObj['date-min'],
						dateMax: formObj['date-max'],
						dateProperty: formObj['date-property']
					});
					this.options.repository.applyFilters();
					this.pageNumber = 0;
					this.render();
				},
				formRefreshCallback: async () => {
					this.options.repository.root = EMPTY_ROOT;
					this.render();

					const root = await RemoteRepositoryAPI.getRepository();
					if (root === null) {
						Noty.error('Error in data loading');
					} else {
						this.options.repository.root = root;
						this.render();
					}
				},
				formFieldChangeCallback: debounce(() => {
					trigger('submit', this.searchFilterFormElement.ref);
				}, 200)
			});
		} else {
			this.searchFilterFormElement = new EmptyElement();
		}

		if (config.enableFolders) {
			this.searchFolderListElement = new SearchFolderListElement(null, {
				currentFolder: this.options.repository.currentFolder,
				parentFolder: this.options.repository.parentFolder,
				folders: this.options.repository.folders,
				folderUpCallback: () => {
					this.options.repository.currentFolder = this.options.repository.parentFolder;
					this.render();
				},
				folderDownCallback: folder => {
					this.options.repository.currentFolder = folder;
					this.render();
				}
			});
		} else {
			this.searchFolderListElement = new EmptyElement();
		}

		const filesStart = this.pageNumber * config.pageSize;
		const filesEnd = filesStart + config.pageSize;
		this.searchFileListElement = new SearchFileListElement(null, {
			files: this.options.repository.files.slice(filesStart, filesEnd),
			fileEditCallback: fileData => {
				if (!fileData.isReadonly) {
					const file = this.options.repository.fromPath(fileData.path);
					this.currentEditingFile = file;

					this.render();
				}
			},
			fileHomeCallback: async fileData => {
				const metadata = {
					path: fileData.path,
					isHomeItem: !fileData.isHomeItem
				};

				const result = await RemoteRepositoryAPI.setMetadata(metadata);
				if (result !== null && result.length > 0) {
					const file = this.options.repository.fromPath(metadata.path);
					override(file, metadata);

					this.render();
				} else {
					Noty.error('Error saving data');
				}
			},
			fileFavoriteCallback: async fileData => {
				const metadata = {
					path: fileData.path,
					isFavorite: !fileData.isFavorite
				};

				const result = await RemoteRepositoryAPI.setMetadata(metadata);
				if (result !== null && result.length > 0) {
					const file = this.options.repository.fromPath(metadata.path);
					override(file, metadata);

					this.render();
				} else {
					Noty.error('Error saving data');
				}
			},
			fileTagCallback: tag => {
				this.searchFilterFormElement.ref['search-terms'].value = tag.value;
				trigger('submit', this.searchFilterFormElement.ref);
			},
			fileOpenCallback: file => {
				window.open(file.openUrl, `stsearch_${file.id}`);
			}
		});

		if (this.currentEditingFile) {
			this.searchFileEditModalElement = new SearchFileEditModalElement(null, {
				file: this.currentEditingFile,
				formSubmitCallback: async formObj => {
					const metadata = {
						path: formObj.path,
						title: formObj.title,
						description: formObj.description,
						properties: {
							tags: safeJSON.parse(formObj.tags, [])
						}
					};

					// Thumbnail must be converted to a data URI.
					if (formObj.thumbnail.size > 0) {
						try {
							const dataURI = await imageToDataURI(formObj.thumbnail);
							metadata.properties.thumbnail = dataURI;
						} catch (error) {
							Noty.error('Invalid image');
							console.error(error);
							return;
						}
					}

					const result = await RemoteRepositoryAPI.setMetadata(metadata);
					if (result !== null && result.length > 0) {
						const file = this.options.repository.fromPath(metadata.path);
						override(file, metadata);

						this.currentEditingFile = null;
						this.searchFileEditModalElement.$ref.modal('hide');

						this.render();
					} else {
						Noty.error('Error saving data');
					}
				}
			});
		} else {
			this.searchFileEditModalElement = new EmptyElement();
		}

		const pageTotal = Math.ceil(this.options.repository.files.length / config.pageSize);
		if (pageTotal > 1) {
			this.searchPaginationElement = new SearchPaginationElement(null, {
				pageNumber: this.pageNumber,
				pageTotal,
				pageChangeCallback: pageNumber => {
					this.pageNumber = clamp(pageNumber, 0, pageTotal);
					this.render();
				}
			});
		} else {
			this.searchPaginationElement = new EmptyElement();
		}

		return html`
			<div id="${this.id}" class="${this.className} container-fluid">
				<div class="my-4">${this.searchBannerElement.template}</div>
				<div class="my-4">${this.searchFilterFormElement.template}</div>
				<div class="my-4">${this.searchFolderListElement.template}</div>
				<div class="my-4">${this.searchFileListElement.template}</div>
				<div class="my-4">${this.searchFileEditModalElement.template}</div>
				<div class="my-4">${this.searchPaginationElement.template}</div>
			</div>
		`;
	}

	render() {
		super.render();

		if (this.currentEditingFile) {
			// Make Bootstrap custom file input dynamic.
			bsCustomFileInput.init('input[name="thumbnail"]');

			const tagInput = this.searchFileEditModalElement.ref.querySelector('input[name="tags"]');
			this.tagify = new Tagify(tagInput, {maxTags: config.maxTags});

			this.searchFileEditModalElement.$ref.modal('show');
			this.searchFileEditModalElement.$ref.one('hide.bs.modal', () => {
				this.currentEditingFile = null;
				if (this.tagify) {
					this.tagify.destroy();
				}
			});
		}
	}
}