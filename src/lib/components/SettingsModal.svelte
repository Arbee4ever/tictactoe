<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';

	let modal: Modal;
	export let showHealth: boolean = true;
	let darkmode: boolean = isDarkmode();

	export function open() {
		modal.open();
	}

	export function close() {
		modal.close();
	}

	function toggleDarkmode(e:  Event & { currentTarget: EventTarget & HTMLInputElement }) {
		if (typeof document === 'undefined') return;
		let target = e.target as HTMLInputElement;
		if (!target) return;
		if (target.checked === true) {
			document.documentElement.setAttribute('data-theme', 'dark');
		} else {
			document.documentElement.setAttribute('data-theme', 'light');
		}
	}

	function toggleHealthNums(e:  Event & { currentTarget: EventTarget & HTMLInputElement }) {
		let target = e.target as HTMLInputElement;
		if (!target) return;
		showHealth = target.checked;
	}

	function isDarkmode(): boolean {
		if (typeof document === 'undefined') return false;
		return document.documentElement.getAttribute('data-theme') === 'dark';
	}
</script>

<Modal bind:this={modal}>
	<p>Darkmode: <input type="checkbox" on:change={toggleDarkmode} checked={darkmode}></p>
	<p>Show Health: <input type="checkbox" on:change={toggleHealthNums} checked={showHealth}></p>
</Modal>