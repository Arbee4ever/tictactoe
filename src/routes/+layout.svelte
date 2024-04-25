<script lang="ts">
	import '$lib/css/normalize.css';
	import { onMount } from 'svelte';

	onMount(() => {
		checkPrefferedTheme()
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
			checkPrefferedTheme()
		});
	});

	function checkPrefferedTheme() {
		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			document.documentElement.setAttribute('data-theme', 'dark');
		} else {
			document.documentElement.setAttribute('data-theme', 'light');
		}
	}
</script>

<svelte:head>
	<meta charset='utf-8' />
	<title>Tic-Tac-Toe | ARBEE</title>
	<meta name='description' content='Small Tic-Tac-Toe Game where only the last three moves count.' />
	<meta name='viewport' content='width=device-width, initial-scale=1.0' />
	<link rel='icon' href="https://arbeeco.de/img/2022-01_ARBEE_Bild-Marke_rgb_Verlauf_01.png" />
	<link rel='canonical' href='https://tictactoe.arbeeco.de' />
	<meta name='twitter:card' content='summary' />
	<meta name='twitter:site' content='@0Arbee0' />
	<meta name='twitter:creator' content='@0Arbee0' />
	<meta property='og:url' content='https://arbeeco.de' />
	<meta property='og:title' content='Tic-Tac-Toe' />
	<meta property='og:description' content='Small Tic-Tac-Toe Game where only the last three moves count.' />
	<meta property='og:image' content="https://arbeeco.de/img/2022-01_ARBEE_Bild-Marke_rgb_Verlauf_01.png" />
	<meta name='theme-color' content='#b222a8' />
	<meta name='keywords' content='Game, Tic-Tac-Toe, Arbee, Simple' />
</svelte:head>

<slot />

<style lang="scss">
	@import url(https://fonts.bunny.net/css?family=jetbrains-mono:400,500);

	:root {
		--bg-color: white;
		--invert: 0%;
	}

	:global([data-theme="dark"]) {
		--bg-color: black;
		--invert: 100%;
	}

	:global(*) {
		font-family: "JetBrains Mono", monospace;
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