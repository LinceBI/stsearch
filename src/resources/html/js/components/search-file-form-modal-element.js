import { html } from 'lit-html';
import { translate } from '@appnest/lit-translate';

import formData from '../helpers/formData';
import safeJSON from '../helpers/safeJSON';

import BaseElement from './base-element';

export default class SearchFileFormModalElement extends BaseElement {
	constructor(...args) {
		super(...args);
		this.className = 'search-file-form-modal-element';
	}

	get template() {
		return html`
			<form
				id="${this.id}"
				class="${this.className} modal"
				@submit=${this.formSubmitHandler}
				tabindex="-1"
			>
				<div class="modal-dialog modal-lg">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title">${this.options.file.title}</h5>
							<button type="button" class="close" data-dismiss="modal">&times;</button>
						</div>
						<div class="modal-body">
							<div class="row">
								<div class="col-sm-12 col-lg-3 mb-3">
									<div class="square-box square-box-centered border" style="max-height: 128px; max-width: 128px">
										<div class="square-box-content p-1 bg-light text-muted">
										${this.options.file.properties.thumbnail ? html`
											<img class="card-img" src="${this.options.file.properties.thumbnail}">
										` : html`
											${this.faTemplate('fas-camera-retro', 'w-auto mw-100 h-50')}
											No image
										`}
										</div>
									</div>
								</div>
								<div class="col-sm-12 col-lg-9">
									<div class="form-group">
										<input
											id="${this.id}-form-path"
											name="path"
											type="text"
											class="form-control"
											.value=${this.options.file.path}
											readonly
										>
									</div>
									<div class="form-group">
										<label
											for="${this.id}-form-title"
											class="mb-2"
										>${translate('search-file-form-modal.title.label')}</label>
										<input
											id="${this.id}-form-title"
											name="title"
											type="text"
											class="form-control"
											maxlength="100"
											.value=${this.options.file.title}
										>
									</div>
									<div class="form-group">
										<label
											for="${this.id}-form-tags"
											class="mb-2"
										>${translate('search-file-form-modal.tags.label')}</label>
										<input
											id="${this.id}-form-tags"
											name="tags"
											type="hidden"
											class="form-control"
											.value=${this.options.file.properties.tags ? safeJSON.stringify(this.options.file.properties.tags, '[]') : '[]'}
										>
									</div>
									<div class="form-group">
										<label
											for="${this.id}-form-description"
											class="mb-2"
										>${translate('search-file-form-modal.description.label')}</label>
										<textarea
											id="${this.id}-form-description"
											name="description"
											type="text"
											class="form-control"
											rows="3"
											maxlength="1000"
										>${this.options.file.description}</textarea>
									</div>
									<div class="form-group">
										<label
											for="${this.id}-form-thumbnail"
											class="mb-2"
										>${translate('search-file-form-modal.image.label')}</label>
										<div class="custom-file">
											<input
												id="${this.id}-form-thumbnail"
												name="thumbnail"
												type="file"
												class="custom-file-input"
											>
											<span class="custom-file-label"></span>
										</div>
									</div>
									<div class="form-group">
										<label
											for="${this.id}-form-embedded"
											class="mb-2"
										>${translate('search-file-form-modal.embedded.label')}</label>
										<select
											id="${this.id}-form-embedded"
											name="embedded"
											class="form-control"
										>
											<option value="auto" ?selected=${!/^(true)|(false)$/.test(this.options.file.properties.embedded)}>${translate('search-file-form-modal.embedded.auto')}</option>
											<option value="true" ?selected=${this.options.file.properties.embedded === 'true'}>${translate('search-file-form-modal.embedded.true')}</option>
											<option value="false" ?selected=${this.options.file.properties.embedded === 'false'}>${translate('search-file-form-modal.embedded.false')}</option>
										</select>
									</div>
								</div>
							</div>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-danger" data-dismiss="modal">${translate('search-file-form-modal.cancel')}</button>
							<button type="submit" class="btn btn-primary">${translate('search-file-form-modal.ok')}</button>
						</div>
					</div>
				</div>
			</form>
		`;
	}

	get formSubmitHandler() {
		return {
			capture: true,
			passive: false,
			once: false,
			handleEvent: (event) => {
				event.preventDefault();
				if (typeof this.options.formSubmitCallback === 'function') {
					const form = new FormData(event.target);

					// Ensure that the entry exists if the checkbox is not checked.
					const checkboxes = event.target.querySelectorAll('[type=checkbox], [type=radio]');
					checkboxes.forEach((checkbox) => {
						const name = checkbox.getAttribute('name');
						if (!form.has(name)) {
							form.set(name, '');
						}
					});

					const formObj = formData.objectify(form);
					this.options.formSubmitCallback(formObj);
				}
			},
		};
	}

	get opened() {
		return this.ref.classList.contains('show');
	}
}
