import { library, dom } from '@fortawesome/fontawesome-svg-core';

(async () => {
	const container = document.createElement('div');
	container.style.display = 'none';
	document.body.append(container);

	const icons = await Promise.all([
		import(/* webpackMode: "eager" */ '@fortawesome/free-regular-svg-icons/faCalendarDays'),
		import(/* webpackMode: "eager" */ '@fortawesome/free-regular-svg-icons/faHeart'),
		import(/* webpackMode: "eager" */ '@fortawesome/free-solid-svg-icons/faAngleLeft'),
		import(/* webpackMode: "eager" */ '@fortawesome/free-solid-svg-icons/faAngleRight'),
		import(/* webpackMode: "eager" */ '@fortawesome/free-solid-svg-icons/faAnglesLeft'),
		import(/* webpackMode: "eager" */ '@fortawesome/free-solid-svg-icons/faAnglesRight'),
		import(/* webpackMode: "eager" */ '@fortawesome/free-solid-svg-icons/faArrowLeft'),
		import(/* webpackMode: "eager" */ '@fortawesome/free-solid-svg-icons/faArrowRight'),
		import(/* webpackMode: "eager" */ '@fortawesome/free-solid-svg-icons/faArrowsRotate'),
		import(/* webpackMode: "eager" */ '@fortawesome/free-solid-svg-icons/faCameraRetro'),
		import(/* webpackMode: "eager" */ '@fortawesome/free-solid-svg-icons/faCaretDown'),
		import(/* webpackMode: "eager" */ '@fortawesome/free-solid-svg-icons/faFolder'),
		import(/* webpackMode: "eager" */ '@fortawesome/free-solid-svg-icons/faFolderOpen'),
		import(/* webpackMode: "eager" */ '@fortawesome/free-solid-svg-icons/faHeart'),
		import(/* webpackMode: "eager" */ '@fortawesome/free-solid-svg-icons/faLeftLong'),
		import(/* webpackMode: "eager" */ '@fortawesome/free-solid-svg-icons/faLink'),
		import(/* webpackMode: "eager" */ '@fortawesome/free-solid-svg-icons/faList'),
		import(/* webpackMode: "eager" */ '@fortawesome/free-solid-svg-icons/faListCheck'),
		import(/* webpackMode: "eager" */ '@fortawesome/free-solid-svg-icons/faMagnifyingGlass'),
		import(/* webpackMode: "eager" */ '@fortawesome/free-solid-svg-icons/faMapLocationDot'),
		import(/* webpackMode: "eager" */ '@fortawesome/free-solid-svg-icons/faPencil'),
		import(/* webpackMode: "eager" */ '@fortawesome/free-solid-svg-icons/faRightLong'),
		import(/* webpackMode: "eager" */ '@fortawesome/free-solid-svg-icons/faTableCellsLarge'),
		import(/* webpackMode: "eager" */ '@fortawesome/free-solid-svg-icons/faTableList'),
		import(/* webpackMode: "eager" */ './fontawesome/fakFileAdhoc'),
		import(/* webpackMode: "eager" */ './fontawesome/fakFileCsv'),
		import(/* webpackMode: "eager" */ './fontawesome/fakFileOther'),
		import(/* webpackMode: "eager" */ './fontawesome/fakFilePdf'),
		import(/* webpackMode: "eager" */ './fontawesome/fakFilePrpt'),
		import(/* webpackMode: "eager" */ './fontawesome/fakFileSaiku'),
		import(/* webpackMode: "eager" */ './fontawesome/fakFileSta'),
		import(/* webpackMode: "eager" */ './fontawesome/fakFileStd'),
		import(/* webpackMode: "eager" */ './fontawesome/fakFileStp'),
		import(/* webpackMode: "eager" */ './fontawesome/fakFileStolap'),
		import(/* webpackMode: "eager" */ './fontawesome/fakFileUrl'),
		import(/* webpackMode: "eager" */ './fontawesome/fakFileWcdf'),
		import(/* webpackMode: "eager" */ './fontawesome/fakFileXjpivot'),
		import(/* webpackMode: "eager" */ './fontawesome/fakHomeOutline'),
		import(/* webpackMode: "eager" */ './fontawesome/fakHomeSolid'),
		import(/* webpackMode: "eager" */ './fontawesome/fakToolCde'),
		import(/* webpackMode: "eager" */ './fontawesome/fakToolOther'),
		import(/* webpackMode: "eager" */ './fontawesome/fakToolSaiku'),
		import(/* webpackMode: "eager" */ './fontawesome/fakToolStagile'),
		import(/* webpackMode: "eager" */ './fontawesome/fakToolStdashboard'),
		import(/* webpackMode: "eager" */ './fontawesome/fakToolStolap'),
		import(/* webpackMode: "eager" */ './fontawesome/fakToolStpanels'),
		import(/* webpackMode: "eager" */ './fontawesome/fakToolStpivot'),
		import(/* webpackMode: "eager" */ './fontawesome/fakToolStreport'),
	]);

	icons.forEach((icon) => {
		const symbol = document.createElement('i');
		symbol.dataset.faSymbol = `${icon.prefix}-${icon.iconName}`;
		symbol.classList.add(icon.prefix, `fa-${icon.iconName}`, 'fa-fw');
		container.append(symbol);
		library.add(icon.definition);
	});

	dom.i2svg({ node: container });
})();
