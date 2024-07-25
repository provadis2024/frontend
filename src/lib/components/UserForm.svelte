<script lang="ts">
	import { admin } from '$lib/backend';
	import type { User } from '$lib/types';
	import { X } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	const emitter = createEventDispatcher<{
		cancel: undefined;
		submit: User;
	}>();

	let user: Partial<User> = {};

	export const loadUser = (newUser: Partial<User>) => {
		user = newUser;
	};

	const submit = () => {
		if (!user.password) {
			alert('Passwort benötigt.');
			return;
		}
		if (!user.username) {
			alert('Benutzername benötigt.');
			return;
		}

		emitter('submit', user as User);
	};
</script>

<form
	class="user-form"
	on:submit={(ev) => {
		submit();
		ev.preventDefault();
	}}
>
	{#if user.user_id}
		<h2>Benutzer bearbeiten</h2>
	{:else}
		<h2>Neuer Benutzer</h2>
	{/if}

	<button
		class="close"
		on:click={(ev) => {
			emitter('cancel');
			ev.preventDefault();
		}}><X /></button
	>

	<div class="group">
		<label for="name">Benutzername</label>
		<input id="name" type="text" bind:value={user.username} readonly={!$admin} />
	</div>

	<div class="group">
		<label for="role">Berechtigungen</label>
		<select id="role" bind:value={user.user_role} disabled={!$admin}>
			<option value="employee">Mitarbeiter</option>
			<option value="project_manager">Projektmanager</option>
			<option value="admin">Administrator</option>
		</select>
	</div>

	{#if $admin}
		<div class="group">
			<label for="password">Passwort</label>
			<input id="password" type="password" bind:value={user.password} />
		</div>

		<button>Speichern</button>
	{/if}
</form>

<style lang="scss">
	.user-form {
		@include box;
		background-color: var(--color-background);
		display: flex;
		flex-direction: column;
		gap: 10px;
		contain: layout;

		@include formStyles;
	}
</style>
