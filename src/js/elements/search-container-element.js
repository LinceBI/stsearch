import clamp from 'lodash/clamp';
import {html} from 'lit-html';

import BaseElement from './base-element';
import SearchFilterFormElement from './search-filter-form-element';
import SearchFolderListElement from './search-folder-list-element';
import SearchFileListElement from './search-file-list-element';
import SearchPaginationElement from './search-pagination-element';

export default class SearchContainerElement extends BaseElement {
	get template() {
		let searchFilterFormElement = new SearchFilterFormElement(null, {
			formSubmitCallback: data => {
				this.options.repository.searchTerms = data.get('search-terms');
				this.options.repository.allowedExtensions = data.get('allowed-extensions');
				this.options.repository.dateMin = data.get('date-min');
				this.options.repository.dateMax = data.get('date-max');
				this.options.repository.dateProperty = data.get('date-property');
				this.options.repository.applyFilters();
				this.options.pageNumber = 0;
				this.render();
			}
		});

		let searchFolderListElement = new SearchFolderListElement(null, {
			folders: this.options.repository.nestedFolders,
			hasParent: this.options.repository.parentFolder !== null,
			folderUpCallback: () => {
				this.options.repository.currentFolder = this.options.repository.parentFolder;
				this.render();
			},
			folderDownCallback: folder => {
				this.options.repository.currentFolder = folder;
				this.render();
			}
		});

		let filesStart = this.options.pageNumber * this.options.pageSize;
		let filesEnd = filesStart + this.options.pageSize;
		let searchFileListElement = new SearchFileListElement(null, {
			files: this.options.repository.nestedFiles.slice(filesStart, filesEnd),
			fileEditCallback: file => {
				console.log('edit', file);
			},
			fileHomeCallback: file => {
				console.log('home', file);
			},
			fileFavoriteCallback: file => {
				console.log('favorite', file);
			},
			fileTagCallback: tag => {
				console.log('tag', tag);
			}
		});

		let pageTotal = Math.ceil(this.options.repository.nestedFiles.length / this.options.pageSize);
		let searchPaginationElement = new SearchPaginationElement(null, {
			pageNumber: this.options.pageNumber,
			pagePlaces: this.options.pagePlaces,
			pageTotal: pageTotal,
			pageChangeCallback: pageNumber => {
				this.options.pageNumber = clamp(pageNumber, 0, pageTotal);
				this.render();
			}
		});

		return html`
			<div class="container-fluid">
				<div class="my-4">${searchFilterFormElement.template}</div>
				<div class="my-4">${searchFolderListElement.template}</div>
				<div class="my-4">${searchFileListElement.template}</div>
				<div class="my-4">${searchPaginationElement.template}</div>
			</div>
		`;
	}
}
