<script lang="ts">
	import backend from '$lib/backend';
	import type { Booking, Project, Task } from '$lib/types';
	import { createEventDispatcher, onMount } from 'svelte';
	import ShimmerWrapper from './ShimmerWrapper.svelte';

	export let booking: Booking;
	export let bookingHourLengthPx: number;
	export let bookingTopPadPx: number;
	export let bookingLeftPadPx: number;

	const emitter = createEventDispatcher<{
		edit: Booking;
	}>();

	let project: Project | null = null;
	let task: Task | null | undefined = null;

	const load = async () => {
		project = await backend.getProject(booking.project_id);
		if (booking.task_id) task = await backend.getTask(booking.task_id);
	};

	onMount(load);
</script>

<button
	class="booking"
	style="height: {booking.endTs.diff(booking.startTs).as('hours') *
		bookingHourLengthPx}px; top: {bookingTopPadPx +
		(booking.startTs.hour + booking.startTs.minute / 60) *
			bookingHourLengthPx}px; left: {bookingLeftPadPx}px; width: calc(100% - {bookingLeftPadPx}px);"
	on:click={(ev) => {
		emitter('edit', booking);
		ev.preventDefault();
	}}
>
	<span class="project">
		<ShimmerWrapper loading={project == null}>{project?.name}</ShimmerWrapper>
	</span>
	<span class="task">
		{#if booking.task_id !== null}
			<ShimmerWrapper loading={task == null}>{task?.name}</ShimmerWrapper>
		{/if}
	</span>
</button>

<style lang="scss">
	.booking {
		color: inherit;
		font: inherit;
		text-align: left;
		position: absolute;
		border: thin solid var(--color-accent);
		border-radius: var(--radius);
		background-color: var(--color-accent-bg);
		padding: 10px;
		pointer-events: auto;
		cursor: pointer;
		display: flex;
		flex-direction: column;

		.project {
			font-weight: 800;
		}
	}
</style>
