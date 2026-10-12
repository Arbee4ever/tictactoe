<script lang="ts">
	import Tile from '#lib/components/Tile.svelte';
	import XIcon from '#lib/img/X.svg';
	import OIcon from '#lib/img/0.svg';
	import { onMount } from 'svelte';
	import OnboardingModal from '#lib/components/OnboardingModal.svelte';
	import SettingsModal from '#lib/components/SettingsModal.svelte';
	import AboutModal from '#lib/components/AboutModal.svelte';
	import OnlineModal from '#lib/components/OnlineModal.svelte';
	import * as game from '#lib/stores/gamestate.svelte.ts';
	import { getConnection } from '#lib/stores/gamestate.svelte.ts';

	let grid: HTMLDivElement;
	let size: number;

	onMount(() => {
		size = grid.offsetWidth;

		window.onresize = () => {
			size = grid.offsetWidth;
		};

		onboardingModal.open();
	});

	game.clearBoard();

	function claim(index: number) {
		if (getConnection()) {
			getConnection()!.send({ action: 'claim', index: index });
		}
		game.claim(index);
	}

	function onClear(index: number) {
		game.getTiles()[index] = 0;
	}

	let settingsModal: SettingsModal;
	let onboardingModal: OnboardingModal;
	let aboutModal: AboutModal;
	let onlineModal: OnlineModal;
</script>

<div id="top" style="--size: {size}px">
	<div class="item {game.getCurrentPlayer() === 1 ? 'active' : ''}">
		<div class="icon">
			<img src={XIcon} alt="Player" />
		</div>
		<div class="score">{game.scores.X}</div>
	</div>
	<div class="item {game.getCurrentPlayer() !== 1 ? 'active' : ''}">
		<div class="icon">
			<img src={OIcon} alt="Player" />
		</div>
		<div class="score">{game.scores.O}</div>
	</div>
</div>
<div id="grid" style="--tile-count: {Math.sqrt(game.tileCount)}" bind:this={grid}>
	{#each game.getTiles().keys() as i}
		<Tile index={i} bind:this={() => game.getTileEl(i), (el) => game.setTileEl(i, el)} onclick={claim} onclear={onClear}></Tile>
	{/each}
	{#if game.getGameOver()}
		<div class="winScreen visible">
			<p id="winner">{game.getWinner()} WINS!</p>
			<button on:click={game.clear}>Replay</button>
		</div>
	{/if}
</div>
<div id="bottom" style="--size: {size}px">
	<button on:click={aboutModal.open}>About</button>
	<button on:click={game.clear}>Clear Board</button>
	<button on:click={settingsModal.open}>Settings</button>
</div>

<AboutModal bind:this={aboutModal}></AboutModal>
<SettingsModal bind:this={settingsModal}></SettingsModal>
<OnboardingModal bind:this={onboardingModal} {onlineModal}></OnboardingModal>
<OnlineModal bind:this={onlineModal}></OnlineModal>

<style lang="scss">
	#top {
		display: flex;
		min-width: var(--size);
		justify-content: space-between;
		align-items: center;
		gap: 2vw;
		height: 100%;
		margin-top: 2px;

		.item {
			display: flex;
			align-items: center;
			justify-content: space-evenly;
			flex-direction: column;
			width: 100%;
			height: 100%;
			border: black 1px solid;

			.icon {
				display: flex;
				align-items: center;
				height: 100%;
				width: 80%;

				img {
					width: 100%;
				}
			}

			&.active {
				background: rgba(0, 0, 0, 0.2);
			}

			.score {
				display: flex;
				align-items: center;
				justify-content: center;
				height: 10vh;
				width: 100%;
				font-size: 3em;
				background: rgba(0, 0, 0, 0.2);
				outline: black 1px solid;
			}
		}
	}

	#grid {
		display: grid;
		grid-template-columns: repeat(var(--tile-count), 1fr);
		gap: 0;
		height: 90vw;
		width: 90vw;
		margin: 2vw 0;
		position: relative;

		.winScreen {
			display: none;
			position: absolute;
			height: 100%;
			width: 100%;
			background: rgba(0, 0, 0, 0.4);
			justify-content: center;
			place-items: center;
			flex-direction: column;
			gap: 1vw;
			font-size: 3em;

			* {
				all: unset;
				background: white;
			}

			button {
				cursor: pointer;
			}

			&.visible {
				display: flex;
			}
		}
	}

	#bottom {
		min-width: var(--size);
		width: var(--size);
		margin-bottom: 1px;
		text-align: center;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 2vw;

		button {
			all: unset;
			cursor: pointer;
			aspect-ratio: 1/1;
			border: black 1px solid;
			width: 100%;
			height: fit-content;
		}
	}
</style>
