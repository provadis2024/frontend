<script lang="ts">
	import backend from '$lib/backend';
	import type { Project } from '$lib/types';
	import { X } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import Loader from './Loader.svelte';

	const emitter = createEventDispatcher<{
		cancel: undefined;
		submit: Project & { user_ids: number[] };
	}>();

	let project: Partial<Project & { user_ids: number[] }> = {
		user_ids: []
	};

	export const loadProject = (newProject: Partial<Project & { user_ids: number[] }>) => {
		if (!newProject.user_ids) {
			newProject.user_ids = [];
		}

		project = newProject;
	};

	const submit = () => {
		/*if (!null) {
			alert('Aufgabe benötigt.');
			return;
		}*/

		emitter('submit', project as Project & { user_ids: number[] });
	};
</script>

<form
	class="project-form"
	on:submit={(ev) => {
		submit();
		ev.preventDefault();
	}}
>
	{#if project.project_id}
		<h2>Projekt bearbeiten</h2>
	{:else}
		<h2>Neues Projekt</h2>
	{/if}

	<button
		class="close"
		on:click={(ev) => {
			emitter('cancel');
			ev.preventDefault();
		}}><X /></button
	>

	<div class="group">
		<label for="name">Name</label>
		<input id="name" type="text" bind:value={project.name} />
	</div>

	<div class="group">
		<label for="description">Beschreibung</label>
		<textarea id="description" bind:value={project.description} />
	</div>

	{#await backend.getUsers()}
		<Loader />
	{:then users}
		<div class="group">
			<label for="owner">Projektleiter</label>
			<select id="owner" bind:value={project.owner_id}>
				{#each users as user}
					<option value={user.user_id}>{user.username}</option>
				{/each}
			</select>
		</div>

		<div class="group">
			<label for="users">Mitarbeiter</label>
			<select id="users" multiple bind:value={project.user_ids}>
				{#each users as user}
					<option value={user.user_id}>{user.username}</option>
				{/each}
			</select>
		</div>
	{/await}

	<button>Speichern</button>
</form>

<style lang="scss">
	.project-form {
		@include box;
		background-color: var(--color-background);
		display: flex;
		flex-direction: column;
		gap: 10px;
		contain: layout;

		@include formStyles;
	}
</style>
