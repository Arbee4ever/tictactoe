<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function onClick() {
		dispatch('click', {
			index: index
		});
	}

	let health = 3;
	export let showHealth: boolean = true;

	export function reduceLife() {
		if (!claim) return;
		--health;
		if (health == 0) {
			clear();
		}
	}

	export function clear() {
		claim = undefined;
		dispatch('clear', {
			index: index
		});
	}

	let claim: string | undefined = undefined;

	export function setClaim(newClaim: string) {
		claim = newClaim;
		health = 3;
	}

	export function getClaim() {
		return claim;
	}

	export let index: number;
</script>

<div class="tile" on:keydown={onClick} on:click={onClick} role="button" tabindex={index}>
	{#if claim}
		<img class="icon" src="$lib/img/{claim}.svg" alt="{claim} Claim Icon">
		{#if showHealth}
			<div class="health">
				<p>{health}</p>
			</div>
		{/if}
	{/if}
</div>

<style lang="scss">
	.tile {
		aspect-ratio: 1/1;
		border: black 1px solid;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		cursor: pointer;

		.icon {
			height: 80%;
		}

		.health {
			position: absolute;
			bottom: 0;
			right: 0;
			font-size: 5vh;
			aspect-ratio: 1/1;
			text-shadow: 0 0 5px white;
			p {
				margin: 0;
			}
		}
	}
</style>