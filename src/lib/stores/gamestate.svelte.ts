import Tile from '#lib/components/Tile.svelte';
import type { DataConnection } from 'peerjs';
import { getShowHealth, setShowHealth } from '#lib/stores/settings.svelte.ts';
import { get } from 'svelte/store';

export const scores = $state({
	X: 0,
	O: 0
});
let host: boolean = $state(false);
export const getHost = () => host;
export const setHost = (value: boolean) => (host = value);
let connection: DataConnection | undefined = $state(undefined);
export const getConnection = () => connection;
export const setConnection = (value: DataConnection | undefined) => (connection = value);
let gameOver: boolean = $state(false);
export const getGameOver = () => gameOver;
export const tileCount = 9;
const tiles: Array<number> = $state([]);
export const getTiles = () => tiles;
const tileEls: Array<Tile> = $state([]);
export const getTileEl = (index: number) => tileEls[index];
export const setTileEl = (index: number, el: Tile) => (tileEls[index] = el);
let currentPlayer = $state(Math.random() >= 0.5 ? -1 : 1);
export const getCurrentPlayer = () => currentPlayer;
let winner: string = $state('NOONE');
export const getWinner = () => winner;

export function ondata(data: { action: string, index?: number, player?: number, showHealth?: boolean }) {
	console.log('Received:', data);
	switch (data.action) {
		case 'start':
			clearBoard();
			setShowHealth(getShowHealth());
			currentPlayer = data.player!;
			break;
		case 'claim':
			claim(data.index!);
			break;
		case 'setting':
			setShowHealth(data.showHealth!, false);
	}
}

export function claim(index: number) {
	if (tiles[index] != 0) return;
	for (const tile of tileEls) {
		const player = currentPlayer == 1 ? 'X' : '0';
		if (tile.getClaim() == player) {
			tile.reduceLife();
		}
	}
	tileEls[index].setClaim(currentPlayer == 1 ? 'X' : '0');
	tiles[index] = currentPlayer;
	const endCond = checkWin();
	if (endCond < 0) {
		scores.O++;
		winner = '0';
		console.log('0 WINS!');
	} else if (endCond > 0) {
		scores.X++;
		winner = 'X';
		console.log('X WINS!');
	}
	if (endCond != 0) showWinScreen();
	switchCurrPlayer();
}

export function clear() {
	clearBoard();
	connection?.send({ action: 'start', player: currentPlayer });
}

export function clearBoard() {
	gameOver = false;
	for (let i = 0; i < tileCount; i++) {
		tiles[i] = 0;
	}
	for (const tile of tileEls) {
		tile.clear();
	}
	currentPlayer = Math.random() >= 0.5 ? -1 : 1;
}

export function switchCurrPlayer() {
	currentPlayer = currentPlayer == 1 ? -1 : 1;
}

export function checkWin(): number {
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
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			count += tiles[i + j * 3];
		}
		if (count == 3 || count == -3) {
			return count;
		}
		count = 0;
	}
	count = 0;
	count = tiles[0] + tiles[4] + tiles[8];
	if (count == 3 || count == -3) return count;
	count = tiles[2] + tiles[4] + tiles[6];
	if (count == 3 || count == -3) return count;
	count = 0;
	return count;
}

export function showWinScreen() {
	gameOver = true;
}