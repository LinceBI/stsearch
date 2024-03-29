import '../css/app.scss';

import cloneDeep from 'lodash/cloneDeep';
import { get } from '@appnest/lit-translate';

import './vendor/bootstrap';
import './vendor/fontawesome';
import './vendor/lit-translate';
import Noty from './vendor/noty';

import getRepository from './helpers/biserver/getRepository';
import safeWindowParent from './helpers/safeWindowParent';

import config from './config';
import Repository from './repository';

import SearchContainerElement from './components/search-container-element';

window.addEventListener('load', async () => {
	// Load config from parameters and presets.
	await config.loadConfig();

	const repository = new Repository();
	const container = document.querySelector('#main');

	const searchContainerElement = new SearchContainerElement(container, { repository });
	searchContainerElement.render();

	if ('stsearch_initial_repository' in safeWindowParent) {
		repository.root = cloneDeep(safeWindowParent.stsearch_initial_repository);
	} else {
		try {
			repository.root = await getRepository();
		} catch (err) {
			Noty.error(get('notifications.errorLoadingData'));
			console.error(err);
		}
	}

	searchContainerElement.render();

	// Public API
	// ==========

	const STSearch = { config, repository };

	STSearch.applyConfig = (newConfig, reset = false) => {
		config.applyConfig(newConfig, reset);
		repository.applyFilters(config.defaultFolderPath);
		searchContainerElement.render();
		return STSearch;
	};

	STSearch.applyPreset = (preset, reset = true) => {
		config.applyPreset(preset, reset);
		repository.applyFilters(config.defaultFolderPath);
		searchContainerElement.render();
		return STSearch;
	};

	STSearch.resetConfig = () => {
		config.resetConfig();
		repository.applyFilters(config.defaultFolderPath);
		searchContainerElement.render();
		return STSearch;
	};

	STSearch.isLoading = () => {
		return document.body.classList.contains('loading');
	};

	STSearch.doSearch = (searchTerms, reset = false) => {
		if (reset) config.resetConfig();
		config.searchTerms = searchTerms;
		repository.applyFilters(reset ? config.defaultFolderPath : undefined);
		searchContainerElement.render();
		return STSearch;
	};

	STSearch.doFocus = (fieldName = 'search-terms') => {
		const formRef = searchContainerElement.searchFilterFormElement.ref;
		const fieldRef = formRef.querySelector(`[name="${fieldName}"]`);
		if (fieldRef) fieldRef.focus();
		return STSearch;
	};

	STSearch.doRefresh = async () => {
		if (!STSearch.isLoading()) {
			const refreshedRoot = await getRepository();
			if (refreshedRoot !== null) {
				repository.root = refreshedRoot;
				searchContainerElement.render();
			}
		}
		return STSearch;
	};

	window.STSearch = STSearch;
});
