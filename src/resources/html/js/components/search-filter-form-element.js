import { html } from 'lit-html';
import { translate } from '@appnest/lit-translate';

import formData from '../helpers/formData';
import extensionMap from '../helpers/biserver/extensionMap';

import config from '../config';

import BaseElement from './base-element';

export default class SearchFilterFormElement extends BaseElement {
	constructor(...args) {
		super(...args);
		this.className = 'search-filter-form-element';
	}

	get template() {
		return html`
			<form
				id="${this.id}"
				class="${this.className}"
				@submit=${this.formSubmitHandler}
			>
				${config.enableSearchFilter ? html`
					<div class="form-group">
						<div class="btn-toolbar d-flex">
							<div class="flex-grow-5 mb-3 mb-md-0 mr-0 mr-md-2">
								<div class="input-group">
									<div class="input-group-prepend">
										<label
											for="${this.id}-search-terms"
											class="btn btn-icon-primary input-group-text"
										>${this.faTemplate('fas-magnifying-glass')}</label>
										<button
											type="button"
											data-toggle="dropdown"
											class="btn btn-icon-primary input-group-text dropdown-toggle-split"
											title="${translate('search-filter-form.searchIn')}"
										>${this.faTemplate('fas-caret-down')}</button>
										<div class="dropdown-menu dropdown-menu-multiselect py-2 px-0">
											<div class="dropdown-item p-0">
												<div class="px-3 pb-1">${translate('search-filter-form.searchIn')}</div>
											</div>
											<div class="dropdown-item p-0">
												<div class="btn-group-toggle" data-toggle="buttons">
													<label
														class="btn btn-sm btn-link text-left px-3 w-100 rounded-0 ${config.searchInTitle ? 'active' : ''}"
														@click=${this.formFieldChangeHandlerGenerator('search-in-title')}
													>
														<input
															name="search-in-title"
															type="checkbox"
															value="true"
															.checked=${config.searchInTitle}
															@keyup=${this.formButtonCheckboxKeyupHandler}
															autocomplete="off"
														>
														${translate('search-filter-form.searchInTitle')}
													</label>
												</div>
											</div>
											<div class="dropdown-item p-0">
												<div class="btn-group-toggle" data-toggle="buttons">
													<label
														class="btn btn-sm btn-link text-left px-3 w-100 rounded-0 ${config.searchInDescription ? 'active' : ''}"
														@click=${this.formFieldChangeHandlerGenerator('search-in-description')}
													>
														<input
															name="search-in-description"
															type="checkbox"
															value="true"
															.checked=${config.searchInDescription}
															@keyup=${this.formButtonCheckboxKeyupHandler}
															autocomplete="off"
														>
														${translate('search-filter-form.searchInDescription')}
													</label>
												</div>
											</div>
											<div class="dropdown-item p-0">
												<div class="btn-group-toggle" data-toggle="buttons">
													<label
														class="btn btn-sm btn-link text-left px-3 w-100 rounded-0 ${config.searchInTags ? 'active' : ''}"
														@click=${this.formFieldChangeHandlerGenerator('search-in-tags')}
													>
														<input
															name="search-in-tags"
															type="checkbox"
															value="true"
															.checked=${config.searchInTags}
															@keyup=${this.formButtonCheckboxKeyupHandler}
															autocomplete="off"
														>
														${translate('search-filter-form.searchInTags')}
													</label>
												</div>
											</div>
											<hr class="m-2">
											<div class="dropdown-item p-0">
												<div class="btn-group-toggle" data-toggle="buttons">
													<label
														class="btn btn-sm btn-link text-left px-3 w-100 rounded-0 ${config.recursive ? 'active' : ''}"
														@click=${this.formFieldChangeHandlerGenerator('recursive')}
													>
														<input
															name="recursive"
															type="checkbox"
															value="true"
															.checked=${config.recursive}
															@keyup=${this.formButtonCheckboxKeyupHandler}
															autocomplete="off"
														>
														${translate('search-filter-form.recursive')}
													</label>
												</div>
											</div>
										</div>
									</div>
									<input
										id="${this.id}-search-terms"
										name="search-terms"
										type="search"
										class="form-control"
										placeholder="${translate('search-filter-form.search.placeholder')}"
										.value=${config.searchTerms}
										@input=${this.formFieldChangeHandlerGenerator('search-terms')}
										autofocus
									>
								</div>
							</div>
							<div class="d-flex flex-fill flex-wrap w-100 w-md-auto mx-n1 mb-n1">
								<div class="btn-group btn-group-toggle flex-grow-5 mx-1 mb-1" data-toggle="buttons">
									<button
										type="button"
										data-toggle="dropdown"
										class="btn btn-secondary"
										title="${translate('search-filter-form.mustBeIn')}"
									>
										${this.faTemplate('fas-list-check')}
									</button>
									<div class="dropdown-menu dropdown-menu-multiselect py-2 px-0">
										<div class="dropdown-item p-0">
											<div class="px-3 pb-1">${translate('search-filter-form.mustBeIn')}</div>
										</div>
										<div class="dropdown-item p-0">
											<div class="btn-group-toggle">
												<label
													class="btn btn-sm btn-link text-left px-3 w-100 rounded-0 ${config.filterHome ? 'active' : ''}"
													@click=${this.formFieldChangeHandlerGenerator('filter-home')}
												>
													<input
														name="filter-home"
														type="checkbox"
														value="true"
														.checked=${config.filterHome}
														@keyup=${this.formButtonCheckboxKeyupHandler}
														autocomplete="off"
													>
													${translate('search-filter-form.mustBeInHome')}
												</label>
											</div>
										</div>
										<div class="dropdown-item p-0">
											<div class="btn-group-toggle">
												<label
													class="btn btn-sm btn-link text-left px-3 w-100 rounded-0 ${config.filterFavorites ? 'active' : ''}"
													@click=${this.formFieldChangeHandlerGenerator('filter-favorites')}
												>
													<input
														name="filter-favorites"
														type="checkbox"
														value="true"
														.checked=${config.filterFavorites}
														@keyup=${this.formButtonCheckboxKeyupHandler}
														autocomplete="off"
													>
													${translate('search-filter-form.mustBeInFavorites')}
												</label>
											</div>
										</div>
										<div class="dropdown-item p-0">
											<div class="btn-group-toggle">
												<label
													class="btn btn-sm btn-link text-left px-3 w-100 rounded-0 ${config.filterRecents ? 'active' : ''}"
													@click=${this.formFieldChangeHandlerGenerator('filter-recents')}
												>
													<input
														name="filter-recents"
														type="checkbox"
														value="true"
														.checked=${config.filterRecents}
														@keyup=${this.formButtonCheckboxKeyupHandler}
														autocomplete="off"
													>
													${translate('search-filter-form.mustBeInRecents')}
												</label>
											</div>
										</div>
									</div>
									${config._availableOverlaysSet.has('launch.stpivot') ? html`
										<label
											class="btn btn-outline-tool-stpivot ${config._allowedExtensionsSet.has(extensionMap.get('launch.stpivot')) ? 'active' : ''}"
											title="${translate('search-filter-form.extensionsStpivot')}"
											@click=${this.formFieldChangeHandlerGenerator('allowed-extensions')}
										>
											<input
												name="allowed-extensions[]"
												type="checkbox"
												.checked=${config._allowedExtensionsSet.has(extensionMap.get('launch.stpivot'))}
												.value=${extensionMap.get('launch.stpivot')}
												@keyup=${this.formButtonCheckboxKeyupHandler}
												autocomplete="off"
											>
											${this.faTemplate('fac-tool-stpivot')}
										</label>
									` : ''}
									${config._availableOverlaysSet.has('launch.launch_new_stolap_analytics') ? html`
										<label
											class="btn btn-outline-tool-stolap ${config._allowedExtensionsSet.has(extensionMap.get('launch.launch_new_stolap_analytics')) ? 'active' : ''}"
											title="${translate('search-filter-form.extensionsStolap')}"
											@click=${this.formFieldChangeHandlerGenerator('allowed-extensions')}
										>
											<input
												name="allowed-extensions[]"
												type="checkbox"
												.checked=${config._allowedExtensionsSet.has(extensionMap.get('launch.launch_new_stolap_analytics'))}
												.value=${extensionMap.get('launch.launch_new_stolap_analytics')}
												@keyup=${this.formButtonCheckboxKeyupHandler}
												autocomplete="off"
											>
											${this.faTemplate('fac-tool-stolap')}
										</label>
									` : ''}
									${config._availableOverlaysSet.has('launch.launch-new-saiku-adhoc') ? html`
										<label
											class="btn btn-outline-tool-streport ${config._allowedExtensionsSet.has(extensionMap.get('launch.launch-new-saiku-adhoc')) ? 'active' : ''}"
											title="${translate('search-filter-form.extensionsStreport')}"
											@click=${this.formFieldChangeHandlerGenerator('allowed-extensions')}
										>
											<input
												name="allowed-extensions[]"
												type="checkbox"
												.checked=${config._allowedExtensionsSet.has(extensionMap.get('launch.launch-new-saiku-adhoc'))}
												.value=${extensionMap.get('launch.launch-new-saiku-adhoc')}
												@keyup=${this.formButtonCheckboxKeyupHandler}
												autocomplete="off"
											>
											${this.faTemplate('fac-tool-streport')}
										</label>
									` : ''}
									${config._availableOverlaysSet.has('launch.launch-new-stpanels') ? html`
										<label
											class="btn btn-outline-tool-stpanels ${config._allowedExtensionsSet.has(extensionMap.get('launch.launch-new-stpanels')) ? 'active' : ''}"
											title="${translate('search-filter-form.extensionsStpanels')}"
											@click=${this.formFieldChangeHandlerGenerator('allowed-extensions')}
										>
											<input
												name="allowed-extensions[]"
												type="checkbox"
												.checked=${config._allowedExtensionsSet.has(extensionMap.get('launch.launch-new-stpanels'))}
												.value=${extensionMap.get('launch.launch-new-stpanels')}
												@keyup=${this.formButtonCheckboxKeyupHandler}
												autocomplete="off"
											>
											${this.faTemplate('fac-tool-stpanels')}
										</label>
									` : ''}
									${config._availableOverlaysSet.has('launch.stdashboardButton') ? html`
										<label
											class="btn btn-outline-tool-stdashboard ${config._allowedExtensionsSet.has(extensionMap.get('launch.stdashboardButton')) ? 'active' : ''}"
											title="${translate('search-filter-form.extensionsStdashboard')}"
											@click=${this.formFieldChangeHandlerGenerator('allowed-extensions')}
										>
											<input
												name="allowed-extensions[]"
												type="checkbox"
												.checked=${config._allowedExtensionsSet.has(extensionMap.get('launch.stdashboardButton'))}
												.value=${extensionMap.get('launch.stdashboardButton')}
												@keyup=${this.formButtonCheckboxKeyupHandler}
												autocomplete="off"
											>
											${this.faTemplate('fac-tool-stdashboard')}
										</label>
									` : ''}
									${config._availableOverlaysSet.has('launch.launch-new-stagile') ? html`
										<label
											class="btn btn-outline-tool-stagile ${config._allowedExtensionsSet.has(extensionMap.get('launch.launch-new-stagile')) ? 'active' : ''}"
											title="${translate('search-filter-form.extensionsStagile')}"
											@click=${this.formFieldChangeHandlerGenerator('allowed-extensions')}
										>
											<input
												name="allowed-extensions[]"
												type="checkbox"
												.checked=${config._allowedExtensionsSet.has(extensionMap.get('launch.launch-new-stagile'))}
												.value=${extensionMap.get('launch.launch-new-stagile')}
												@keyup=${this.formButtonCheckboxKeyupHandler}
												autocomplete="off"
											>
											${this.faTemplate('fac-tool-stagile')}
										</label>
									` : ''}
									${config._availableOverlaysSet.has('launch.launch_new_cde') ? html`
										<label
											class="btn btn-outline-tool-cde ${config._allowedExtensionsSet.has(extensionMap.get('launch.launch_new_cde')) ? 'active' : ''}"
											title="${translate('search-filter-form.extensionsCde')}"
											@click=${this.formFieldChangeHandlerGenerator('allowed-extensions')}
										>
											<input
												name="allowed-extensions[]"
												type="checkbox"
												.checked=${config._allowedExtensionsSet.has(extensionMap.get('launch.launch_new_cde'))}
												.value=${extensionMap.get('launch.launch_new_cde')}
												@keyup=${this.formButtonCheckboxKeyupHandler}
												autocomplete="off"
											>
											${this.faTemplate('fac-tool-cde')}
										</label>
									` : ''}
									<label
										class="btn btn-outline-tool-other ${config._allowedExtensionsSet.has(extensionMap.get('other')) ? 'active' : ''}"
										title="${translate('search-filter-form.extensionsOther')}"
										@click=${this.formFieldChangeHandlerGenerator('allowed-extensions')}
									>
										<input
											name="allowed-extensions[]"
											type="checkbox"
											.checked=${config._allowedExtensionsSet.has(extensionMap.get('other'))}
											.value=${extensionMap.get('other')}
											@keyup=${this.formButtonCheckboxKeyupHandler}
											autocomplete="off"
										>
										${this.faTemplate('fac-tool-other')}
									</label>
								</div>
								<div class="btn-group flex-fill mx-1 mb-1">
									<button
										type="button"
										class="btn btn-info"
										title="${translate('search-filter-form.refresh')}"
										@click=${this.formRefreshHandler}
									>
										${this.faTemplate('fas-arrows-rotate')}
									</button>
								</div>
							</div>
						</div>
					</div>
				` : ''}
				${config.enableDateFilter ? html`
					<div class="form-group">
						<div class="btn-toolbar d-flex">
							<div class="flex-fill mb-3 mb-md-0 mr-0 mr-md-2">
								<div class="input-group">
									<div class="input-group-prepend">
										<label
											for="${this.id}-date-min"
											class="btn btn-icon-primary input-group-text"
										>${this.faTemplate('far-calendar-days')}</label>
									</div>
									<input
										id="${this.id}-date-min"
										name="date-min"
										type="date"
										class="form-control"
										placeholder="yyyy-mm-dd"
										.value=${config.dateMin}
										@change=${this.formFieldChangeHandlerGenerator('date-min')}
									>
									<div class="input-group-prepend input-group-append">
										<label
											for="${this.id}-date-max"
											class="btn btn-icon-primary input-group-text"
										>${this.faTemplate('fas-right-long')}</label>
									</div>
									<input
										id="${this.id}-date-max"
										name="date-max"
										type="date"
										class="form-control"
										placeholder="yyyy-mm-dd"
										.value=${config.dateMax}
										@change=${this.formFieldChangeHandlerGenerator('date-max')}
									>
								</div>
							</div>
							<div class="d-flex flex-row w-100 w-md-auto">
								<div class="input-group flex-fill">
									<select
										name="date-property"
										class="custom-select"
										@change=${this.formFieldChangeHandlerGenerator('date-property')}
									>
										<option
											value="created"
											.selected=${config.dateProperty === 'created'}
										>${translate('search-filter-form.creationDate')}</option>
										<option
											value="modified"
											.selected=${config.dateProperty === 'modified'}
										>${translate('search-filter-form.modificationDate')}</option>
									</select>
								</div>
							</div>
						</div>
					</div>
				` : ''}
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

	get formRefreshHandler() {
		return {
			capture: true,
			passive: false,
			once: false,
			handleEvent: () => {
				if (typeof this.options.formRefreshCallback === 'function') {
					this.options.formRefreshCallback();
				}
			},
		};
	}

	formFieldChangeHandlerGenerator(field) {
		return {
			capture: true,
			passive: false,
			once: false,
			handleEvent: (event) => {
				if (typeof this.options.formFieldChangeCallback === 'function') {
					this.options.formFieldChangeCallback(field, event);
				}
			},
		};
	}

	formButtonCheckboxKeyupHandler(event) {
		// The checked state for checkbox and radio buttons is only updated via click event on the button.
		// https://getbootstrap.com/docs/4.3/components/buttons/#checkbox-and-radio-buttons
		if (event.code === 'Space') {
			event.target.parentElement.click();
		}
	}
}
