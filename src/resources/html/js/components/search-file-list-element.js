import {html} from 'lit-html';

import BaseElement from './base-element';
import SearchFileElement from './search-file-element';

export default class SearchFileListElement extends BaseElement {
	constructor(...args) {
		super(...args);
		this.className = 'search-file-list-element';
	}

	get template() {
		let fileTemplates;
		if (Array.isArray(this.options.files)) {
			fileTemplates = this.options.files.map(file => {
				return new SearchFileElement(null, {
					file,
					fileEditCallback: this.options.fileEditCallback,
					fileHomeCallback: this.options.fileHomeCallback,
					fileFavoriteCallback: this.options.fileFavoriteCallback,
					fileTagCallback: this.options.fileTagCallback,
					fileOpenCallback: this.options.fileOpenCallback
				}).template;
			});
		} else {
			fileTemplates = [];
		}

		return html`
			<div id="${this.id}" class="${this.className} row">${fileTemplates}</div>
		`;
	}
}