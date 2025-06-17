import jQuery from 'jquery';
import clamp from 'lodash/clamp';
import debounce from 'lodash/debounce';
import { html } from 'lit-html';
import { get } from '@appnest/lit-translate';

import bsCustomFileInput from '../vendor/bs-custom-file-input';
import Tagify from '../vendor/tagify';
import Noty from '../vendor/noty';

import dispatchCustomEvent from '../helpers/dispatchCustomEvent';
import getRepository from '../helpers/biserver/getRepository';
import imageToDataURI from '../helpers/imageToDataURI';
import isSmallScreen from '../helpers/isSmallScreen';
import override from '../helpers/override';
import safeJSON from '../helpers/safeJSON';
import safeWindowParent from '../helpers/safeWindowParent';
import safeWindowTop from '../helpers/safeWindowTop';
import setMetadata from '../helpers/biserver/setMetadata';
import strToBool from '../helpers/strToBool';
import trigger from '../helpers/trigger';

import config from '../config';

import BaseElement from './base-element';
import EmptyElement from './empty-element';
import SearchBannerElement from './search-banner-element';
import SearchFilterFormElement from './search-filter-form-element';
import SearchFolderListElement from './search-folder-list-element';
import SearchFileListElement from './search-file-list-element';
import SearchFileFormModalElement from './search-file-form-modal-element';
import SearchPaginationElement from './search-pagination-element';

export default class SearchContainerElement extends BaseElement {
	constructor(...args) {
		super(...args);
		this.className = 'search-container-element';
		this.pageNumber = 0;
	}

	get template() {
		let formFile = null;
		if (config.formFilePath) {
			formFile = this.options.repository.fromPath(config.formFilePath);
			if (!formFile) config.formFilePath = '';
		}

		if (config.enableBanner) {
			this.searchBannerElement = new SearchBannerElement(null);
		} else {
			this.searchBannerElement = new EmptyElement();
		}

		if (config.enableFilters) {
			this.searchFilterFormElement = new SearchFilterFormElement(null, {
				formSubmitCallback: (formObj) => {
					override(config, {
						recursive: strToBool(formObj.recursive),
						searchTerms: formObj['search-terms'],
						searchInTitle: strToBool(formObj['search-in-title']),
						searchInDescription: strToBool(formObj['search-in-description']),
						searchInTags: strToBool(formObj['search-in-tags']),
						filterHome: strToBool(formObj['filter-home']),
						filterFavorites: strToBool(formObj['filter-favorites']),
						filterRecents: strToBool(formObj['filter-recents']),
						allowedExtensions: formObj['allowed-extensions'],
						dateMin: formObj['date-min'],
						dateMax: formObj['date-max'],
						dateProperty: formObj['date-property'],
					});
					this.options.repository.applyFilters();
					this.pageNumber = 0;
					this.render();
				},
				formRefreshCallback: async () => {
					const root = await getRepository();
					if (root === null) {
						Noty.error(get('notifications.errorLoadingData'));
					} else {
						this.options.repository.root = root;
						this.render();
					}
				},
				formFieldChangeCallback: debounce(() => {
					trigger('submit', this.searchFilterFormElement.ref);
				}, 200),
			});
		} else {
			this.searchFilterFormElement = new EmptyElement();
		}

		if (config.enableFolders) {
			this.searchFolderListElement = new SearchFolderListElement(null, {
				current: this.options.repository.current,
				parent: this.options.repository.parent,
				folders: this.options.repository.folders,
				folderUpCallback: () => {
					if (!config.chroot || this.options.repository.current.path !== config.defaultFolderPath) {
						this.options.repository.current = this.options.repository.parent;
						this.render();
					}
				},
				folderDownCallback: (folder) => {
					this.options.repository.current = folder;
					this.render();
				},
			});
		} else {
			this.searchFolderListElement = new EmptyElement();
		}

		const filesStart = this.pageNumber * config.pageSize;
		const filesEnd = filesStart + config.pageSize;
		this.searchFileListElement = new SearchFileListElement(null, {
			files: this.options.repository.files.slice(filesStart, filesEnd),
			fileFormCallback: (fileData) => {
				if (!fileData.isReadonly) {
					config.formFilePath = fileData.path;
					this.render();
				}
			},
			fileHomeCallback: async (fileData) => {
				const metadata = {
					path: fileData.path,
					isHome: !fileData.isHome,
				};

				const result = await setMetadata(metadata);
				if (result !== null && result.length > 0) {
					const file = this.options.repository.fromPath(metadata.path);
					override(file, metadata);
					dispatchCustomEvent('stsearch-set-metadata', {
						detail: file,
						target: safeWindowParent,
					});

					this.render();
				} else {
					Noty.error(get('notifications.errorSavingData'));
				}
			},
			fileFavoriteCallback: async (fileData) => {
				const metadata = {
					path: fileData.path,
					isFavorite: !fileData.isFavorite,
				};

				const result = await setMetadata(metadata);
				if (result !== null && result.length > 0) {
					const file = this.options.repository.fromPath(metadata.path);
					override(file, metadata);
					dispatchCustomEvent('stsearch-set-metadata', {
						detail: file,
						target: safeWindowParent,
					});

					this.render();
				} else {
					Noty.error(get('notifications.errorSavingData'));
				}
			},
			fileTagCallback: (tag) => {
				this.searchFilterFormElement.ref['search-terms'].value = tag.value;
				trigger('submit', this.searchFilterFormElement.ref);
			},
			fileOpenCallback: (file) => {
				const embedded = file.properties.embedded === 'true' || (file.properties.embedded !== 'false' && !isSmallScreen);
				if (embedded && 'mantle_openRepositoryFile' in safeWindowParent) {
					safeWindowParent.mantle_openRepositoryFile(file.path, 'RUN');
				} else {
					window.open(file.openUrl, `stsearch_open_${file.id}`, 'noopener');
				}
			},
			fileEditCallback: (file) => {
				const embedded = file.properties.embedded === 'true' || (file.properties.embedded !== 'false' && !isSmallScreen);
				if (embedded && 'mantle_openRepositoryFile' in safeWindowParent) {
					safeWindowParent.mantle_openRepositoryFile(file.path, 'EDIT');
				} else {
					window.open(file.editUrl, `stsearch_edit_${file.id}`, 'noopener');
				}
			},
		});

		if (formFile) {
			this.searchFileFormModalElement = new SearchFileFormModalElement(null, {
				file: formFile,
				formSubmitCallback: async (formObj) => {
					const metadata = {
						path: formObj.path,
						title: formObj.title,
						description: formObj.description,
						properties: {
							tags: formObj.tags.length > 0 ? safeJSON.parse(formObj.tags, []) : [],
							embedded: formObj.embedded,
						},
					};

					// Thumbnail must be converted to a data URI.
					if (formObj.thumbnail.size > 0) {
						try {
							const dataURI = await imageToDataURI(formObj.thumbnail);
							metadata.properties.thumbnail = dataURI;
						} catch (error) {
							Noty.error(get('notifications.invalidImage'));
							console.error(error);
							return;
						}
					}

					const result = await setMetadata(metadata);
					if (result !== null && result.length > 0) {
						const file = this.options.repository.fromPath(metadata.path);
						override(file, metadata);
						dispatchCustomEvent('stsearch-set-metadata', {
							detail: file,
							target: safeWindowParent,
						});

						config.formFilePath = '';
						this.searchFileFormModalElement.$ref.modal('hide');

						this.render();
					} else {
						Noty.error(get('notifications.errorSavingData'));
					}
				},
			});
		} else {
			if (this.searchFileFormModalElement instanceof SearchFileFormModalElement) {
				this.searchFileFormModalElement.$ref.modal('hide');
			}
			this.searchFileFormModalElement = new EmptyElement();
		}

		const pageTotal = Math.ceil(this.options.repository.files.length / config.pageSize);
		if (pageTotal > 1) {
			this.searchPaginationElement = new SearchPaginationElement(null, {
				pageNumber: this.pageNumber,
				pageTotal,
				pageChangeCallback: (pageNumber) => {
					this.pageNumber = clamp(pageNumber, 0, pageTotal);
					this.render();
				},
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
				<div class="my-4">${this.searchFileFormModalElement.template}</div>
				<div class="my-4">${this.searchPaginationElement.template}</div>
			</div>
		`;
	}

	render() {
		super.render();

		if (config.formFilePath && !this.searchFileFormModalElement.opened) {
			const modalFormSelector = `.${this.searchFileFormModalElement.className}`;
			const thumbnailInputSelector = `${modalFormSelector} input[name="thumbnail"]`;
			const tagsInputSelector = `${modalFormSelector} input[name="tags"]`;
			const tagsInputElement = document.querySelector(tagsInputSelector);
			let tagsInputTagify = null;

			this.searchFileFormModalElement.$ref
				.one('show.bs.modal', () => {
					tagsInputTagify = new Tagify(tagsInputElement, { maxTags: config.maxTags });
					bsCustomFileInput.init(thumbnailInputSelector, modalFormSelector);
				})
				.one('hide.bs.modal', () => {
					tagsInputTagify.destroy();
					bsCustomFileInput.destroy(thumbnailInputSelector, modalFormSelector);
					config.formFilePath = '';
					if (config.formReturnHref) {
						safeWindowTop.location.href = config.formReturnHref;
					}
				})
				.modal('show');
		}

		this.ref.querySelectorAll('[data-toggle="dropdown"]').forEach((el) => {
			jQuery(el).data('popperConfig', {
				placement: 'bottom-start',
				modifiers: {
					computeStyle: {
						enabled: true,
						y: document.documentElement.dir === 'rtl' ? 'left' : 'right',
					},
				},
			});
		});
	}
}
