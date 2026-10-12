<script lang="ts">
	import Modal from '#lib/components/Modal.svelte';

	let modal: Modal;

	export function open() {
		modal.open();
	}

	export function close() {
		modal.close();
	}
</script>

<Modal bind:this={modal}>
	<p>Developed by: <a href="https://arbeeco.de">ARBEE</a></p>
	<p>
		Made with: <a href="https://svelte.dev/">Svelte</a> &
		<a href="https://kit.svelte.dev/">SvelteKit</a>
	</p>
	<p>Icons from: <a href="https://lucide.dev/">Lucide</a></p>
	<p>Font hosted by: <a href="https://fonts.bunny.net/">Bunny Fonts</a></p>
	<p>Font from: <a href="https://www.jetbrains.com/de-de/lp/mono/">JetBrains</a></p>
</Modal>
