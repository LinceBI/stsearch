import cloneDeep from 'lodash/cloneDeep';
import fetch from 'unfetch';
import { get } from '@appnest/lit-translate';

import getContextPath from './getContextPath';
import getLocale from './getLocale';
import isDemo from '../isDemo';
import safeJSON from '../safeJSON';
import searchParams from '../searchParams';

import Noty from '../../vendor/noty';

export default async (metadata, { locale = getLocale() } = {}) => {
	if (!Array.isArray(metadata)) {
		metadata = [metadata];
	}

	// Mock metadata update in demo environment.
	if (isDemo) {
		Noty.warning(get('notifications.dataWillNotPersistInDemoEnv'));
		return metadata.map(entry => ({ fullPath: entry.path }));
	}

	// If "locale" is a promise, resolve it.
	if (locale instanceof Promise) {
		locale = await locale;
	}

	if (/^en(?:_[A-Z]{2})?$/.test(locale)) {
		locale = 'default';
	}

	// Clone "metadata" object to avoid mutating the original.
	metadata = cloneDeep(metadata);

	// Transform "metadata" object.
	// TODO: remove when eslint/eslint#12117 is fixed.
	// eslint-disable-next-line no-unused-vars
	for await (const child of metadata) {
		// "properties" must be defined.
		if (typeof child.properties === 'undefined') {
			child.properties = {};
		}

		// "properties.tags" must be converted to string.
		if (Array.isArray(child.properties.tags)) {
			const strTags = safeJSON.stringify(child.properties.tags, '[]');
			child.properties.tags = strTags;
		}
	}

	const contextPath = await getContextPath();
	const endpoint = `${contextPath}plugin/file-metadata/api/set?${searchParams.stringify(
		{ locale }
	)}`;
	const response = await fetch(endpoint, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(metadata)
	});

	if (response.status === 200) {
		return response.json();
	}

	return null;
};
