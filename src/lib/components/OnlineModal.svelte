<script lang="ts">
	import Peer from 'peerjs';
	import Modal from '$lib/components/Modal.svelte';
	import { onMount } from 'svelte';

	let modal: Modal;
	let peer: Peer | undefined;
	let connection: ReturnType<Peer['connect']> | undefined;
	let onlineId = '';
	let otherId = '';
	let connectionStatus = '';

	export function open() {
		modal.open();
	}

	export function close() {
		modal.close();
	}

	onMount(() => {
		let id = new URLSearchParams(window.location.search).get('id');
		if (id) {
			otherId = id;
		}

		if (peer) return;

		peer = new Peer();

		peer.on('open', id => {
			onlineId = id;
			console.log('My peer ID:', id);
		});

		peer.on('connection', incomingConnection => {
			setupConnection(incomingConnection);
		});

		peer.on('error', error => {
			connectionStatus = `Connection error: ${error.message}`;
			console.error('PeerJS error:', error);
		});
	});


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
	}

	function setupConnection(newConnection: ReturnType<Peer['connect']>) {
		if (connection != undefined) return;
		connection = newConnection;
		connectionStatus = 'Connecting...';

		connection.on('data', data => {
			console.log('Received:', data);
		});

		connection.on('open', () => {
			if (connection !== newConnection) return;
			console.log('Connection established!');
			connectionStatus = 'Connected!';
			connection.send('Hello, peer! 👋');
			close();
		});

		connection.on('error', error => {
			if (connection !== newConnection) return;
			connectionStatus = `Connection error: ${error.message}`;
			console.error('Data connection error:', error);
		});

		connection.on('close', () => {
			if (connection !== newConnection) return;
			console.log('Connection closed!');
			connectionStatus = 'Connection closed.';
			connection = undefined;
		});
	}
</script>

<Modal bind:this={modal}>
	<p>{onlineId || 'Connecting...'}</p>
	<input type="text" bind:value={otherId} />
	<a href="?id={encodeURIComponent(onlineId)}">Share</a>
	<button on:click={play}>Play</button>
	<p>{connectionStatus}</p>
</Modal>