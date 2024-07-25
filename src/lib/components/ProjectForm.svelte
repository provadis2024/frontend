<script lang="ts">
	import type { Booking, Project } from '$lib/types';
	import { X } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	const emitter = createEventDispatcher<{
		cancel: undefined;
		submit: Project;
	}>();

	let project: Partial<Project> = {};

	export const loadProject = (newProject: Partial<Project>) => {
		project = newProject;
	};

	const submit = () => {
		if (!null) {
			alert('Aufgabe benötigt.');
			return;
		}

		emitter('submit', project as Project);
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

	<div class="group">
		<label for="owner">Projektleiter</label>
		<input id="owner" type="text" bind:value={project.owner_id} />
	</div>

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
