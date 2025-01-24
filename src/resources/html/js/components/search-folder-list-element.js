import { html } from 'lit-html';

import config from '../config';

import BaseElement from './base-element';
import SearchFolderElement from './search-folder-element';

export default class SearchFolderListElement extends BaseElement {
	constructor(...args) {
		super(...args);
		this.className = 'search-folder-list-element';
	}

	get template() {
		let folderTemplates;
		if (Array.isArray(this.options.folders)) {
			folderTemplates = this.options.folders.map((options) => {
				const folder = new SearchFolderElement(null, {
					...options,
					folderClickCallback: this.options.folderDownCallback,
				});
				return folder.template;
			});
		} else {
			folderTemplates = [];
		}

		return html`
			<div id="${this.id}" class="${this.className} row">
				<div class="col">
					<div class="row mb-2">
						<div class="col">
							<div class="input-group">
								<div class="input-group-prepend">
									<button
										type="button"
										class="btn btn-icon-primary input-group-text"
										@click=${this.arrowBackClickHandler}
										?disabled=${!this.options.parent || (config.chroot && this.options.current.path === config.defaultFolderPath)}
									>
										${this.faTemplate('fas-arrow-left')}
									</button>
									<button
										type="button"
										class="btn btn-icon-primary input-group-text"
										data-toggle="collapse" href="#${this.id}-folder-container"
									>
										<span class="expanded-content">${this.faTemplate('fas-folder-open')}</span>
										<span class="collapsed-content">${this.faTemplate('fas-folder')}</span>
									</button>
								</div>
								<input
									type="text"
									class="form-control"
									.value=${this.options.current.path.slice(config.chroot ? config.defaultFolderPath.length : 0) || '/'}
									readonly
								>
							</div>
						</div>
					</div>
					<div class="row mb-0">
						<div class="col">
							<div id="${this.id}-folder-container" class="row m-n1 collapse show">
								${folderTemplates}
							</div>
						</div>
					</div>
				</div>
			</div>
		`;
	}

	get arrowBackClickHandler() {
		return {
			capture: true,
			passive: true,
			once: false,
			handleEvent: () => {
				if (typeof this.options.folderUpCallback === 'function') {
					this.options.folderUpCallback(this.options.parent);
				}
			},
		};
	}
}
