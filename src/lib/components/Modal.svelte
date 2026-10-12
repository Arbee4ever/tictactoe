<script lang="ts">
	let modal: HTMLDialogElement;

	export function open() {
		modal.showModal();
		modal.addEventListener('click', (e) => {
			const dialogDimensions = modal.getBoundingClientRect();
			if (
				e.clientX < dialogDimensions.left ||
				e.clientX > dialogDimensions.right ||
				e.clientY < dialogDimensions.top ||
				e.clientY > dialogDimensions.bottom
			) {
				modal.close();
			}
		});
	}

	export function close() {
		modal.close();
	}
</script>

<dialog class="modal" bind:this={modal}>
	<slot></slot>
</dialog>

<style lang="scss">
	dialog {
		max-width: 350px;
		@media (prefers-color-scheme: dark) {
			filter: invert(var(--invert));
		}

		&::backdrop {
			background: rgba(0, 0, 0, 0.4);

			@media (prefers-color-scheme: dark) {
				filter: invert(var(--invert));
			}
		}
	}
</style>
