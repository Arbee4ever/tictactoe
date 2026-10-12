import { getConnection } from '#lib/stores/gamestate.svelte.ts';

export const settings = $state({
	darkmode: undefined as boolean | undefined,
	showHealth: true
});

export const getDarkmode = () => settings.darkmode;
export const setDarkmode = (value: boolean | undefined) => {
	if (typeof document === 'undefined') return;
	settings.darkmode = value;
	document.documentElement.setAttribute('data-theme', settings.darkmode ? 'dark' : 'light');
};
export const getShowHealth = () => settings.showHealth;
export const setShowHealth = (value: boolean, informOthers = true) => {
	settings.showHealth = value;
	if (getConnection()?.open && informOthers) {
		getConnection()!.send({ action: 'setting', showHealth: settings.showHealth });
	}
};