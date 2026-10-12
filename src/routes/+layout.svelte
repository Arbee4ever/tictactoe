<script lang="ts">
	import '#lib/css/normalize.css';
	import { getDarkmode, setDarkmode } from '#lib/stores/settings.svelte.ts';

	let { children } = $props();

	checkPreferredTheme();
	if (typeof window != 'undefined') {
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
			checkPreferredTheme();
		});
	}

	function checkPreferredTheme() {
		if (typeof window == 'undefined') return;
		setDarkmode(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
	}

	$effect(() => {
		if(getDarkmode() == undefined) return;
		document.documentElement.setAttribute('--theme', getDarkmode() ? 'dark' : 'light');
	});
</script>

<svelte:head>
	<meta charset="utf-8" />
	<title>Tic-Tac-Toe | ARBEE</title>
	<meta
		name="description"
		content="Small Tic-Tac-Toe Game where only the last three moves count."
	/>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<link rel="icon" href="https://arbeeco.de/img/2022-01_ARBEE_Bild-Marke_rgb_Verlauf_01.png" />
	<link rel="canonical" href="https://tictactoe.arbeeco.de" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@0Arbee0" />
	<meta name="twitter:creator" content="@0Arbee0" />
	<meta property="og:url" content="https://arbeeco.de" />
	<meta property="og:title" content="Tic-Tac-Toe" />
	<meta
		property="og:description"
		content="Small Tic-Tac-Toe Game where only the last three moves count."
	/>
	<meta
		property="og:image"
		content="https://arbeeco.de/img/2022-01_ARBEE_Bild-Marke_rgb_Verlauf_01.png"
	/>
	<meta name="theme-color" content="#b222a8" />
	<meta name="keywords" content="Game, Tic-Tac-Toe, Arbee, Simple" />
</svelte:head>

{@render children()}

<style lang="scss">
	@import url(https://fonts.bunny.net/css?family=jetbrains-mono:400,500);

	:root {
		@media (prefers-color-scheme: light) {
			--theme: light;
		}
		--theme: dark;
	}

	:global([--theme='light']) {
		--bg-color: white;
		--invert: 0%;
	}

	:global([--theme='dark']) {
		--bg-color: black;
		--invert: 100%;
	}

	:global(*) {
		font-family: 'JetBrains Mono', monospace;
	}

	:global(body) {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: auto;
		position: relative;
		height: 100svh;
		background: var(--bg-color);
		filter: invert(var(--invert));
	}
</style>
