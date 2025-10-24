import { width, height, ligatures, svgPathData } from './fakToolCde';
import getFaUnicodeCharacter from './getUnicodeCharacter';

export { width, height, ligatures, svgPathData };
export const prefix = 'fak';
export const iconName = 'file-wcdf';
export const unicode = getFaUnicodeCharacter();
export const definition = {
	prefix,
	iconName,
	icon: [width, height, ligatures, unicode, svgPathData],
};

export { definition as faFileWcdf };
