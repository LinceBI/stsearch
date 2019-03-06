import {html} from 'lit-html';

import {CONFIG} from '../config';

import BaseElement from './base-element';

export default class SearchBannerElement extends BaseElement {
	constructor(...args) {
		super(...args);
		this.className = 'search-banner-element';
	}

	get template() {
		return html`
			<div id="${this.id}" class="${this.className}"
				style="background-color: ${CONFIG['banner-background']}"
				title="${CONFIG['banner-title']}">
				<img src="${CONFIG['banner-src']}">
			</div>
		`;
	}
}
