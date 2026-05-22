import getMetadata from './getMetadata';

export default async ({ locale, depth = -1, refresh = false } = {}) => {
	document.body.classList.add('loading');

	const response = await getMetadata({ fullPath: '/' }, { locale, depth, refresh });

	document.body.classList.remove('loading');

	if (Array.isArray(response) && response.length === 1) {
		return response[0];
	}

	return null;
};
