import { html } from 'lit-html';
import { translate } from '@appnest/lit-translate';

import config from '../config';

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
			fileTemplates = this.options.files.map((file) => {
				return new SearchFileElement(null, {
					file,
					fileFormCallback: this.options.fileFormCallback,
					fileHomeCallback: this.options.fileHomeCallback,
					fileFavoriteCallback: this.options.fileFavoriteCallback,
					fileTagCallback: this.options.fileTagCallback,
					fileOpenCallback: this.options.fileOpenCallback,
					fileEditCallback: this.options.fileEditCallback,
				}).template;
			});
		} else {
			fileTemplates = [];
		}

		return html`
			<div id="${this.id}" class="${this.className} p-0 ${config.layout === 'grid' ? 'row' : 'col'}">
				${fileTemplates.length > 0 ? html`
					${fileTemplates}
				` : html`
					<div class="empty">
						${this.faTemplate('fas-magnifying-glass', 'empty-icon')}
						<div class="empty-text">${translate('search-file-list.noResultsFound')}</div>
					</div>
				`}
			</div>
		`;
	}
}
