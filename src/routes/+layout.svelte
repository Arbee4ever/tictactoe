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