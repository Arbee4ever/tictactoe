<script lang="ts">
	import Tile from '$lib/components/Tile.svelte';
	import { onMount } from 'svelte';

	let winsX = 0;
	let wins0 = 0;

	let gameOver: boolean = false;
	let grid: HTMLDivElement;
	let size: number;

	onMount(() => {
		size = grid.offsetWidth;

		window.onresize = () => {
			size = grid.offsetWidth;
		};
	});

	let showHealth: boolean = true;
	let tileCount = 9;
	let tiles: number[] = [];
	let tileEls: Tile[] = [];

	let currentPlayer = Math.random() >= 0.5 ? -1 : 1;
	clearBoard();

	function onClick(e) {
		let index = e.detail.index;
		if (tiles[index] != 0) return;
		for (const tile of tileEls) {
			let player = currentPlayer == 1 ? 'X' : '0';
			if (tile.getClaim() == player) {
				tile.reduceLife();
			}
		}
		tileEls[index].setClaim(currentPlayer == 1 ? 'X' : '0');
		tiles[index] = currentPlayer;
		let endCond = checkWin();
		if (endCond < 0) {
			wins0++;
			document.getElementById('winner')!.innerText = '0 WINS!';
			console.log('0 WINS!');
		} else if (endCond > 0) {
			winsX++;
			document.getElementById('winner')!.innerText = 'X WINS!';
			console.log('X WINS!');
		}
		if (endCond != 0) showWinScreen();
		switchCurrPlayer();
	}

	function showWinScreen() {
		gameOver = true;
	}

	function onClear(e) {
		tiles[e.detail.index] = 0;
	}

	function switchCurrPlayer() {
		currentPlayer = currentPlayer == 1 ? -1 : 1;
	}

	function checkWin(): number {
		let count = 0;
		for (let i = 0; i < tileCount; i++) {
			count += tiles[i];
			if (count == 3 || count == -3) {
				document.getElementById('winner')!.innerText = (count > 0 ? 'X' : '0') + ' WINS!';
				console.log(count > 0 ? 'X' : '0', 'WINS!');
				return count;
			}
			if ((i + 1) % 3 == 0) {
				count = 0;
			}
		}
		count = 0;
		for (let i = 0; i < tileCount / 3; i++) {
			for (let j = 0; j < tileCount / 3; j++) {
				count += tiles[i + (j * 3)];
			}
			if (count == 3 || count == -3) {
				return count;
			}
		}
		count = 0;
		count = tiles[0] + tiles[4] + tiles[8];
		if (count == 3 || count == -3) return count;
		count = tiles[2] + tiles[4] + tiles[6];
		if (count == 3 || count == -3) return count;
		count = 0;
		return count;
	}

	let aboutModal: HTMLDialogElement;

	function openAboutModal() {
		openModal(aboutModal);
	}

	function clearBoard() {
		gameOver = false;
		for (let i = 0; i < tileCount; i++) {
			tiles[i] = 0;
		}
		for (const tile of tileEls) {
			tile.clear();
		}
		currentPlayer = Math.random() >= 0.5 ? -1 : 1;
	}

	let settingsModal: HTMLDialogElement;

	function openSettingsModal() {
		openModal(settingsModal);
	}

	function openModal(modal: HTMLDialogElement) {
		modal.showModal();
		modal.addEventListener('click', e => {
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

	function toggleDarkmode(e) {
		if (e.target.checked == true) {
			document.documentElement.setAttribute('data-theme', 'dark');
		} else {
			document.documentElement.setAttribute('data-theme', 'light');
		}
	}

	function toggleHealthNums(e) {
		showHealth = e.target.checked;
	}

	function isDarkmode() {
		if(document) {
			return document.documentElement.getAttribute("data-theme") === "dark"
		}
		return false;
	}
</script>

<div id="top" style="--size: {size}px">
	<div class="item {currentPlayer === 1 ? 'active' : ''}">
		<div class="icon">
			<img src="/src/lib/img/X.svg" alt="Player">
		</div>
		<div class="score">{winsX}</div>
	</div>
	<div class="item {currentPlayer !== 1 ? 'active' : ''}">
		<div class="icon">
			<img src="/src/lib/img/0.svg" alt="Player">
		</div>
		<div class="score">{wins0}</div>
	</div>
</div>
<div id="grid" style="--tile-count: {Math.sqrt(tileCount)}" bind:this={grid}>
	{#each tiles as claim, i}
		<Tile index={i} {showHealth} bind:this={tileEls[i]} on:click={onClick} on:clear={onClear}></Tile>
	{/each}
	<div class="winScreen" class:visible={gameOver}>
		<p id="winner">NOONE WINS!</p>
		<button on:click={clearBoard}>Replay</button>
	</div>
</div>
<div id="bottom" style="--size: {size}px">
	<button on:click={openAboutModal}>About</button>
	<button on:click={clearBoard}>Clear Board</button>
	<button on:click={openSettingsModal}>Settings</button>
</div>

<dialog class="modal" bind:this={aboutModal}>
	<p>Developed by: <a href="https://arbeeco.de">ARBEE</a></p>
	<p>Made with: <a href="https://svelte.dev/">Svelte</a> & <a href="https://kit.svelte.dev/">SvelteKit</a></p>
	<p>Icons from: <a href="https://lucide.dev/">Lucide</a></p>
	<p>Font hosted by: <a href="https://fonts.bunny.net/">Bunny Fonts</a></p>
	<p>Font from: <a href="https://www.jetbrains.com/de-de/lp/mono/">JetBrains</a></p>
</dialog>

<dialog class="modal" bind:this={settingsModal}>
	<p>Darkmode: <input type="checkbox" on:change={toggleDarkmode} checked={isDarkmode}></p>
	<p>Show Health: <input type="checkbox" on:change={toggleHealthNums} checked={showHealth}></p>
</dialog>

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

	dialog {
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