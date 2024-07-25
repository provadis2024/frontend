<script lang="ts">
	import { goto } from '$app/navigation';
	import backend from '$lib/backend';
	import Loader from '$lib/components/Loader.svelte';

	let loading = false;

	let username = '';
	let password = '';

	const signin = async () => {
		loading = true;
		const response = await backend.signin(username, password);

		if (!response) {
			alert('Ungültige Zugangsdaten');
			loading = false;
			return;
		}

		localStorage.setItem('token', response.access_token);

		goto('/');
		loading = false;
	};
</script>

<div class="signin">
	<div class="box">
		<h1>Anmelden</h1>
	</div>

	<div class="box long">
		<Loader display="overlay" {loading} />

		<form
			on:submit={(ev) => {
				ev.preventDefault();
				signin();
			}}
		>
			<input type="text" placeholder="Benutzername" bind:value={username} />
			<input type="password" placeholder="Password" bind:value={password} />

			<button>Anmelden</button>
		</form>
	</div>
</div>

<style lang="scss">
	.signin {
		display: flex;
		flex-direction: column;
		height: 100%;
		@include gaps;

		form {
			display: contents;
		}

		> * {
			flex-shrink: 0;
		}

		.box {
			@include box;
		}

		.long {
			display: flex;
			flex-direction: column;
			@include gaps;
			align-self: center;
			max-width: 400px;
			width: 100%;
			@include formStyles;
		}
	}
</style>
