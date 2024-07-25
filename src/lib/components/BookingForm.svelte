<script lang="ts">
	import backend from '$lib/backend';
	import type { Booking, Project, Task } from '$lib/types';
	import { X } from 'lucide-svelte';
	import { DateTime } from 'luxon';
	import { createEventDispatcher, onMount } from 'svelte';

	const emitter = createEventDispatcher<{
		cancel: undefined;
		submit: Booking;
	}>();

	let booking: Partial<Booking> = {};

	let date = '';
	let from = '';
	let to = '';

	$: {
		const startTs = DateTime.fromISO(date + 'T' + from);
		const endTs = DateTime.fromISO(date + 'T' + to);

		booking.startTs = startTs;
		booking.endTs = endTs;
	}

	export const loadBooking = (newBooking: Partial<Booking>) => {
		date = newBooking.startTs?.toISODate() || '';
		from = newBooking.startTs?.toFormat('HH:mm') || '';
		to = newBooking.endTs?.toFormat('HH:mm') || '';

		booking = newBooking;
	};

	const submit = async () => {
		if (!date) {
			alert('Datum benötigt.');
			return;
		}
		if (!from) {
			alert('Startzeit benötigt.');
			return;
		}
		if (!to) {
			alert('Endzeit benötigt.');
			return;
		}
		if (!booking.project_id) {
			alert('Projekt benötigt.');
			return;
		}
		if (!booking.task_id) {
			alert('Aufgabe benötigt.');
			return;
		}

		const self = await backend.getSelf();

		if (!booking.user_id && self) {
			booking.user_id = self.id;
		}

		emitter('submit', booking as Booking);
	};

	let projects: Project[] | null = null;
	let tasks: Task[] | null = null;

	const load = async () => {
		projects = await backend.getProjects();
		if (booking.project_id) loadTasks(booking.project_id);
	};

	$: {
		if (booking.project_id) loadTasks(booking.project_id);
	}

	const loadTasks = async (projectId: number) => {
		//tasks = null;
		tasks = await backend.getTasks(projectId);
	};

	onMount(load);
</script>

<form
	class="booking-form"
	on:submit={(ev) => {
		submit();
		ev.preventDefault();
	}}
>
	{#if booking.time_entry_id}
		<h2>Eintrag bearbeiten</h2>
	{:else}
		<h2>Neuer Eintrag</h2>
	{/if}

	<button
		class="close"
		on:click={(ev) => {
			emitter('cancel');
			ev.preventDefault();
		}}><X /></button
	>

	<div class="group">
		<label for="day">Projekt</label>
		<input id="day" type="date" bind:value={date} />
	</div>

	<div class="combo">
		<div class="group">
			<label for="from">Von</label>
			<input type="time" id="from" bind:value={from} />
		</div>
		<div class="group">
			<label for="to">Bis</label>
			<input type="time" id="to" bind:value={to} />
		</div>
	</div>
	<div class="group">
		<label for="project">Projekt</label>
		<select id="project" bind:value={booking.project_id}>
			<option disabled selected value>Bitte auswählen...</option>
			{#each projects || [] as project}
				<option value={project.project_id}>{project.name}</option>
			{/each}
		</select>
	</div>
	<div class="group">
		<label for="task">Aufgabe</label>
		<select id="task" bind:value={booking.task_id}>
			<option disabled selected value>Bitte auswählen...</option>
			{#each tasks || [] as task}
				<option value={task.task_id}>{task.name}</option>
			{/each}
		</select>
	</div>

	<button>Speichern</button>
</form>

<style lang="scss">
	.booking-form {
		@include box;
		background-color: var(--color-background);
		display: flex;
		flex-direction: column;
		gap: 10px;
		contain: layout;

		@include formStyles;
	}
</style>
