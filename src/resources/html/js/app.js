import './vendor/bootstrap';
import './vendor/fontawesome';
import './vendor/unfetch';
import Noty from './vendor/noty';

import '../css/app.scss';

import {override} from './helpers';

import config from './config';

import RemoteRepositoryAPI from './api/remote-repository-api';
import Repository from './repository';

import SearchContainerElement from './components/search-container-element';

window.addEventListener('load', async () => {
	// Load config from parameters and presets.
	await config.loadConfig();

	const repository = new Repository();
	const container = document.querySelector('#main');

	const searchContainerElement = new SearchContainerElement(container, {repository});
	searchContainerElement.render();

	const root = await RemoteRepositoryAPI.getRepository();
	if (root !== null) {
		repository.root = root;
		searchContainerElement.render();
	} else {
		Noty.error('Error in data loading');
	}

	window.STSearch = {
		config,
		repository,
		applyConfig: (newConfig, reset = false) => {
			config.applyConfig(newConfig, reset);
			repository.applyFilters(repository.root);
			searchContainerElement.render();
		},
		applyPreset: (preset, reset = true) => {
			config.applyPreset(preset, reset);
			repository.applyFilters(repository.root);
			searchContainerElement.render();
		},
		resetConfig: () => {
			config.resetConfig();
			repository.applyFilters(repository.root);
			searchContainerElement.render();
		},
		doSearch: (searchTerms, reset = false) => {
			if (reset) config.resetConfig();
			config.searchTerms = searchTerms;
			repository.applyFilters(reset ? repository.root : undefined);
			searchContainerElement.render();
		},
		doFocus: (fieldName = 'search-terms') => {
			const formRef = searchContainerElement.searchFilterFormElement.ref;
			const fieldRef = formRef.querySelector(`[name="${fieldName}"]`);
			if (fieldRef) fieldRef.focus();
		},
		doRefresh: async () => {
			if (!document.body.classList.contains('loading')) {
				const refreshedRoot = await RemoteRepositoryAPI.getRepository();
				if (refreshedRoot !== null) {
					repository.root = refreshedRoot;
					searchContainerElement.render();
					return true;
				}
			}

			return false;
		},
		isLoading: () => {
			return document.body.classList.contains('loading');
		}
	};
});
