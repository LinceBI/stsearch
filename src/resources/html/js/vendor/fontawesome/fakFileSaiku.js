import { width, height, ligatures, svgPathData } from './fakToolSaiku';
import getFaUnicodeCharacter from './getUnicodeCharacter';

export { width, height, ligatures, svgPathData };
export const prefix = 'fak';
export const iconName = 'file-saiku';
export const unicode = getFaUnicodeCharacter();
export const definition = {
	prefix,
	iconName,
	icon: [width, height, ligatures, unicode, svgPathData],
};

export { definition as faFileSaiku };
