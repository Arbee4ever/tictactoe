<script lang="ts">
	import Peer from 'peerjs';
	import Modal from '#lib/components/Modal.svelte';
	import {
		getConnection,
		getCurrentPlayer,
		getHost,
		ondata,
		setConnection,
		setHost
	} from '#lib/stores/gamestate.svelte.ts';

	let modal: Modal;
	let peer: Peer | undefined;
	let onlineId = $state('');
	let otherId = $state('');
	let connectionStatus = $state('');

	export function open() {
		modal.open();
		initiatePeer();
	}

	export function close() {
		modal.close();
	}

	function initiatePeer() {
		if (peer) return;
		peer = new Peer();

		peer.on('open', (id) => {
			onlineId = id;
			console.log('My peer ID:', id);

			let remoteId = new URLSearchParams(window.location.search).get('id');
			if (remoteId) {
				otherId = remoteId;
				play();
			}
		});

		peer.on('connection', (incomingConnection) => {
			setupConnection(incomingConnection);
		});

		peer.on('error', (error) => {
			connectionStatus = `Connection error: ${error.message}`;
			console.error('PeerJS error:', error);
		});
	}

	function play() {
		if (!peer || !peer.id) {
			connectionStatus = 'Your peer ID is not ready yet.';
			return;
		}
		if (!otherId.trim()) {
			connectionStatus = 'Enter the other player\'s peer ID.';
			return;
		}
		if (otherId === peer.id) {
			connectionStatus = 'You cannot connect to your own peer.';
			return;
		}

		setupConnection(peer.connect(otherId.trim()));
		setHost(true);
	}

	function setupConnection(newConnection: ReturnType<Peer['connect']>) {
		if (getConnection() != undefined) return;
		setConnection(newConnection);
		connectionStatus = 'Connecting...';

		getConnection()!.on('data', (data) => {
			ondata(data as {
				action: string;
				index?: number;
				player?: number;
				showHealth?: boolean;
			});
		});

		getConnection()!.on('open', () => {
			if (getConnection() !== newConnection) return;
			peer?.disconnect();
			console.log('Connection established!');
			connectionStatus = 'Connected!';
			if (getHost()) {
				getConnection()!.send({ action: 'start', player: getCurrentPlayer() });
			}
			close();
		});

		getConnection()!.on('error', (error) => {
			if (getConnection()! !== newConnection) return;
			connectionStatus = `Connection error: ${error.message}`;
			console.error('Data connection error:', error);
		});

		getConnection()!.on('close', () => {
			if (getConnection()! !== newConnection) return;
			console.log('Connection closed!');
			connectionStatus = 'Connection closed.';
			setConnection(undefined);
		});
	}

	async function share() {
		const data = {
			title: 'Tic Tac Toe',
			text: 'Play Tic Tac Toe with a friend!',
			url: `${window.location.href}?id=${encodeURIComponent(onlineId)}`
		};
		try {
			await navigator.share();
		} catch (e) {
			console.log('e', e);
			try {
				await navigator.clipboard.writeText(data.url);
			} catch (error) {
				console.log(error);
			}
		}
	}
</script>

<Modal bind:this={modal}>
	<p>{onlineId || 'Connecting...'}</p>
	<input type="text" bind:value={otherId} />
	<button onclick={share}>Share</button>
	<button onclick={play}>Play</button>
	<p>{connectionStatus}</p>
</Modal>
