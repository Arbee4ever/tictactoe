<script lang="ts">
	import Modal from '#lib/components/Modal.svelte';
	import { getDarkmode, getShowHealth, setDarkmode, setShowHealth } from '#lib/stores/settings.svelte.ts';

	let modal: Modal;

	export function open() {
		modal.open();
	}

	export function close() {
		modal.close();
	}
</script>

<Modal bind:this={modal}>
	<p>Darkmode: <input type="checkbox" bind:checked={() => getDarkmode(), (v) => setDarkmode(v)} /></p>
	<p>Show Health: <input type="checkbox" bind:checked={() => getShowHealth(), (v) => setShowHealth(v)} /></p>
</Modal>
