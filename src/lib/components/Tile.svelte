<script lang="ts">
	import XIcon from '#lib/img/X.svg';
	import OIcon from '#lib/img/0.svg';
	import { settings } from '#lib/stores/settings.svelte.ts';

	let { index, onclick, onclear } = $props();
	let health = $state(3);
	let claim: string | undefined = $state(undefined);

	export function reduceLife() {
		if (!claim) return;
		--health;
		if (health == 0) {
			clear();
		}
	}

	export function clear() {
		claim = undefined;
		onclear(index);
	}

	export function setClaim(newClaim: string) {
		claim = newClaim;
		health = 3;
	}

	export function getClaim() {
		return claim;
	}
</script>

<div class="tile" onkeydown={() => onclick(index)} onclick={() => onclick(index)} role="button" tabindex={index}>
	{#if claim}
		<img class="icon" src={claim === 'X' ? XIcon : OIcon} alt="{claim} Claim Icon" />
		{#if settings.showHealth}
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
