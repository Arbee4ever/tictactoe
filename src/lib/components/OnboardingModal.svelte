<script lang="ts">
	import Modal from '#lib/components/Modal.svelte';
	import OnlineModal from '#lib/components/OnlineModal.svelte';

	let modal: Modal;
	export let onlineModal: OnlineModal | null = null;

	export function open() {
		modal.open();
	}

	export function close() {
		modal.close();
	}

	function playOnline() {
		modal.close();
		onlineModal!.open();
	}
</script>

<Modal bind:this={modal}>
	<h1>Hello there, Traveller.</h1>
	<p>This is no ordinary Tic-Tac-Toe game. There is one extra rule:</p>
	<p class="rule">Only the last three moves count.</p>
	<p>
		So when you claim a Tile, that tile is only yours until you place the third claim after. This is
		shown by the small number, which decreases by one everytime you place a claim. When this number
		reaches zero, it disappears.
	</p>
	<button on:click={close}>Play</button>
	<button on:click={playOnline} disabled={onlineModal === null}>Play Online</button>
</Modal>

<style lang="scss">
	.rule {
		outline: black 1px solid;
		padding: 1vw;
		background: rgba(0, 0, 0, 0.2);
	}
</style>
