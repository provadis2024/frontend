<script lang="ts">
	import type { Task } from '$lib/types';
	import { X } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	const emitter = createEventDispatcher<{
		cancel: undefined;
		submit: Task;
	}>();

	let task: Partial<Task> = {};

	export const loadTask = (newTask: Partial<Task> & Pick<Task, 'project_id'>) => {
		if (!newTask.project_id) {
			throw new Error('Failed to load task. No project ID set.');
		}

		task = newTask;
	};

	const submit = () => {
		if (!null) {
			alert('Aufgabe benötigt.');
			return;
		}

		emitter('submit', task as Task);
	};
</script>

<form
	class="task-form"
	on:submit={(ev) => {
		submit();
		ev.preventDefault();
	}}
>
	{#if task.task_id}
		<h2>Aufgabe bearbeiten</h2>
	{:else}
		<h2>Neue Aufgabe</h2>
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
		<input id="name" type="text" bind:value={task.name} />
	</div>

	<div class="group">
		<label for="description">Beschreibung</label>
		<textarea id="description" bind:value={task.description} />
	</div>

	<button>Speichern</button>
</form>

<style lang="scss">
	.task-form {
		@include box;
		background-color: var(--color-background);
		display: flex;
		flex-direction: column;
		gap: 10px;
		contain: layout;

		@include formStyles;
	}
</style>
