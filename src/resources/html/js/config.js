import camelCase from 'lodash/camelCase';
import cloneDeep from 'lodash/cloneDeep';
import escapeRegExp from 'lodash/escapeRegExp';
import isString from 'lodash/isString';

import extensionMap from './helpers/biserver/extensionMap';
import getCanAdminister from './helpers/biserver/getCanAdminister';
import getOverlays from './helpers/biserver/getOverlays';
import override from './helpers/override';
import searchParams from './helpers/searchParams';
import strToBool from './helpers/strToBool';
import strToInt from './helpers/strToInt';

class Config {
	constructor() {
		this._presets = {};
		this._initialConfig = {};
	}

	async loadConfig() {
		const response = await fetch('./presets.json', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		});

		if (response.status === 200) {
			this._presets = await response.json();
			const params = searchParams.parse(window.location.search, { preset: 'default' });

			override(this._initialConfig, this._presets.default, this._presets[params.preset], params);

			// If "available-overlays" is not defined, retrieve available overlays.
			if (typeof this._initialConfig['available-overlays'] === 'undefined') {
				const availableOverlays = Array.from((await getOverlays()).keys());
				this._initialConfig['available-overlays'] = availableOverlays;
			}

			// If "allowed-extensions" is not defined, define it according to the available overlays.
			if (typeof this._initialConfig['allowed-extensions'] === 'undefined') {
				const allowedExtensions = [extensionMap.get('other')];
				this._initialConfig['available-overlays'].forEach((overlay) => {
					if (extensionMap.has(overlay)) {
						allowedExtensions.push(extensionMap.get(overlay));
					}
				});
				this._initialConfig['allowed-extensions'] = allowedExtensions;
			}

			// If "enable-file-home" is "true", check if the user really has permission.
			if (this._initialConfig['enable-file-home'] === 'true') {
				const canAdminister = await getCanAdminister();
				this._initialConfig['enable-file-home'] = canAdminister;
			}

			this.resetConfig();
		}
	}

	applyConfig(config, reset = false) {
		if (reset) this.resetConfig();
		Object.entries(config).forEach(([key, value]) => {
			this[camelCase(key)] = cloneDeep(value);
		});
	}

	applyPreset(preset, reset = true) {
		if (reset) this.resetConfig();
		Object.entries(this._presets[preset]).forEach(([key, value]) => {
			this[camelCase(key)] = cloneDeep(value);
		});
	}

	resetConfig() {
		Object.entries(this._initialConfig).forEach(([key, value]) => {
			this[camelCase(key)] = cloneDeep(value);
		});
	}

	get availableOverlays() {
		return this._availableOverlays;
	}

	set availableOverlays(availableOverlays) {
		this._availableOverlays = availableOverlays;
		this._availableOverlaysSet = new Set(availableOverlays);
	}

	get enableBanner() {
		return this._enableBanner;
	}

	set enableBanner(enableBanner) {
		this._enableBanner = isString(enableBanner)
			? strToBool(enableBanner)
			: enableBanner;
	}

	get enableFilters() {
		return this._enableFilters;
	}

	set enableFilters(enableFilters) {
		this._enableFilters = isString(enableFilters)
			? strToBool(enableFilters)
			: enableFilters;
	}

	get enableFolders() {
		return this._enableFolders;
	}

	set enableFolders(enableFolders) {
		this._enableFolders = isString(enableFolders)
			? strToBool(enableFolders)
			: enableFolders;
	}

	get enableFileTags() {
		return this._enableFileTags;
	}

	set enableFileTags(enableFileTags) {
		this._enableFileTags = isString(enableFileTags)
			? strToBool(enableFileTags)
			: enableFileTags;
	}

	get enableFileForm() {
		return this._enableFileForm;
	}

	set enableFileForm(enableFileForm) {
		this._enableFileForm = isString(enableFileForm)
			? strToBool(enableFileForm)
			: enableFileForm;
	}

	get enableFileHome() {
		return this._enableFileHome;
	}

	set enableFileHome(enableFileHome) {
		this._enableFileHome = isString(enableFileHome)
			? strToBool(enableFileHome)
			: enableFileHome;
	}

	get enableFileFavorite() {
		return this._enableFileFavorite;
	}

	set enableFileFavorite(enableFileFavorite) {
		this._enableFileFavorite = isString(enableFileFavorite)
			? strToBool(enableFileFavorite)
			: enableFileFavorite;
	}

	get enableFileOpen() {
		return this._enableFileOpen;
	}

	set enableFileOpen(enableFileOpen) {
		this._enableFileOpen = isString(enableFileOpen)
			? strToBool(enableFileOpen)
			: enableFileOpen;
	}

	get enableFileEdit() {
		return this._enableFileEdit;
	}

	set enableFileEdit(enableFileEdit) {
		this._enableFileEdit = isString(enableFileEdit)
			? strToBool(enableFileEdit)
			: enableFileEdit;
	}

	get bannerSrc() {
		return this._bannerSrc;
	}

	set bannerSrc(bannerSrc) {
		this._bannerSrc = bannerSrc;
	}

	get bannerTitle() {
		return this._bannerTitle;
	}

	set bannerTitle(bannerTitle) {
		this._bannerTitle = bannerTitle;
	}

	get bannerBackground() {
		return this._bannerBackground;
	}

	set bannerBackground(bannerBackground) {
		this._bannerBackground = bannerBackground;
	}

	get searchInTitle() {
		return this._searchInTitle;
	}

	set searchInTitle(searchInTitle) {
		this._searchInTitle = isString(searchInTitle)
			? strToBool(searchInTitle)
			: searchInTitle;
	}

	get searchInDescription() {
		return this._searchInDescription;
	}

	set searchInDescription(searchInDescription) {
		this._searchInDescription = isString(searchInDescription)
			? strToBool(searchInDescription)
			: searchInDescription;
	}

	get searchInTags() {
		return this._searchInTags;
	}

	set searchInTags(searchInTags) {
		this._searchInTags = isString(searchInTags)
			? strToBool(searchInTags)
			: searchInTags;
	}

	get searchTerms() {
		return this._searchTerms;
	}

	set searchTerms(searchTerms) {
		this._searchTerms = searchTerms;
		this._searchTermsRegex = new RegExp(escapeRegExp(this._searchTerms), 'i');
		this._searchTermsExactRegex = new RegExp(`^${escapeRegExp(this._searchTerms)}$`, 'i');
	}

	get filterHome() {
		return this._filterHome;
	}

	set filterHome(filterHome) {
		this._filterHome = isString(filterHome)
			? strToBool(filterHome)
			: filterHome;
	}

	get filterFavorites() {
		return this._filterFavorites;
	}

	set filterFavorites(filterFavorites) {
		this._filterFavorites = isString(filterFavorites)
			? strToBool(filterFavorites)
			: filterFavorites;
	}

	get filterRecents() {
		return this._filterRecents;
	}

	set filterRecents(filterRecents) {
		this._filterRecents = isString(filterRecents)
			? strToBool(filterRecents)
			: filterRecents;
	}

	get allowedExtensions() {
		return this._allowedExtensions;
	}

	set allowedExtensions(allowedExtensions) {
		this._allowedExtensions = allowedExtensions;
		this._allowedExtensionsSet = new Set(allowedExtensions);
		this._allowedExtensionsRegex = new RegExp(`^(?:${this._allowedExtensions.join('|')})$`, 'i');
	}

	get dateMin() {
		return this._dateMin;
	}

	set dateMin(dateMin) {
		this._dateMin = dateMin;
		this._dateMinDate = new Date(dateMin);
		this._dateMinEpoch = this._dateMinDate.getTime();
	}

	get dateMax() {
		return this._dateMax;
	}

	set dateMax(dateMax) {
		this._dateMax = dateMax;
		this._dateMaxDate = new Date(dateMax);
		this._dateMaxEpoch = this._dateMaxDate.getTime();
	}

	get dateProperty() {
		return this._dateProperty;
	}

	set dateProperty(dateProperty) {
		this._dateProperty = dateProperty;
	}

	get maxTags() {
		return this._maxTags;
	}

	set maxTags(maxTags) {
		this._maxTags = isString(maxTags)
			? strToInt(maxTags)
			: maxTags;
	}

	get pagePlaces() {
		return this._pagePlaces;
	}

	set pagePlaces(pagePlaces) {
		this._pagePlaces = isString(pagePlaces)
			? strToInt(pagePlaces)
			: pagePlaces;
	}

	get pageSize() {
		return this._pageSize;
	}

	set pageSize(pageSize) {
		this._pageSize = isString(pageSize)
			? strToInt(pageSize)
			: pageSize;
	}

	get defaultFolderPath() {
		return this._defaultFolderPath;
	}

	set defaultFolderPath(defaultFolderPath) {
		this._defaultFolderPath = defaultFolderPath;
	}

	get formFilePath() {
		return this._formFilePath;
	}

	set formFilePath(formFilePath) {
		this._formFilePath = formFilePath;
	}

	get formReturnHref() {
		return this._formReturnHref;
	}

	set formReturnHref(formReturnHref) {
		this._formReturnHref = formReturnHref;
	}
}

export default new Config();
