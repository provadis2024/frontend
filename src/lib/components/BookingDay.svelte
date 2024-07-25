<script lang="ts">
	import type { Booking } from '$lib/types';
	import { makeTimesteps, type Timestep } from '$lib/utils';
	import { DateTime } from 'luxon';
	import { createEventDispatcher } from 'svelte';
	import BookingButton from './BookingButton.svelte';

	export let date: DateTime;

	export let bookings: Booking[];

	$: filteredBookings = bookings.filter((booking) => {
		return (
			booking.startTs.day == date.day &&
			booking.startTs.month == date.month &&
			booking.startTs.year == date.year
		);
	});

	const emitter = createEventDispatcher<{
		create: { start: Timestep; end: Timestep };
		cancel: undefined;
		edit: Booking;
	}>();

	const timesteps = makeTimesteps(date);

	let startSlot: Timestep | null = null;
	let endSlot: Timestep | null = null;

	let dragging = false;

	/**
	 * Compare two Timesteps
	 * @param a
	 * @param b
	 */
	const compareTs = (a: Timestep | null, b: Timestep | null): number => {
		if (a == null || b == null) return 0;

		if (a.hStart == b.hStart && a.mStart == b.mStart) return 0;

		if (a.hStart > b.hStart || (a.hStart == b.hStart && a.mStart > b.mStart)) {
			return -1;
		}

		return 1;
	};

	/**
	 * Correct the ordering so start is before end
	 * @param start
	 * @param end
	 */
	const correctOrder = (
		start: Timestep | null,
		end: Timestep | null
	): [typeof start | typeof end, typeof end | typeof start] => {
		if (start == null || end == null) return [start, end];

		if (compareTs(start, end) < 0) {
			// Misordered
			//console.log("MISS", start, end)
			return [end, start];
		}

		return [start, end];
	};

	/**
	 * Checks if a given timestep is in between a start and an end.
	 * @param start Starting boundary
	 * @param end Ending boundary
	 * @param timestep Timestep to check
	 */
	const checkInBounds = (
		start: Timestep | null,
		end: Timestep | null,
		timestep: Timestep
	): boolean => {
		[start, end] = correctOrder(start, end);

		if (start == null || end == null) return false;

		if (compareTs(start, timestep) < 0) return false;

		if (compareTs(timestep, end) < 0) return false;

		return true;
	};

	const bookingLeftPadPx = 45 + 10;
	const bookingTopPadPx = 20;
	const bookingHourLengthPx = 30 * 2;

	export const cancelSelection = () => {
		dragging = false;
		startSlot = null;
		endSlot = null;
	};
</script>

<div class="booking-day">
	<div
		class="bg"
		on:mouseleave={() => {
			if (!dragging) return;

			startSlot = null;
			endSlot = null;
			dragging = false;
		}}
		role="none"
	>
		{#each timesteps as timestep, timestepIdx}
			{@const isSelected = checkInBounds(startSlot, endSlot, timestep)}
			<div
				class="timestep"
				class:top={timestep.type == 'top'}
				class:selected={isSelected}
				class:selectStart={startSlot == timestep}
				class:selectEnd={timestepIdx > 0 && endSlot == timesteps[timestepIdx - 1]}
				class:selectEndDirect={endSlot == timesteps[timestepIdx]}
				role="cell"
				on:mousedown={(ev) => {
					if (ev.button !== 0) return;

					dragging = true;

					startSlot = null;
					endSlot = null;
				}}
				on:mouseleave={() => {
					if (!dragging) return;

					if (!startSlot) startSlot = timestep;
					if (!endSlot) endSlot = timestep;
				}}
				on:dblclick={() => {
					startSlot = timestep;
					endSlot = timestep;

					emitter('create', { start: startSlot, end: endSlot });
				}}
				on:mouseenter={() => {
					if (!dragging) return;

					if (compareTs(timestep, startSlot) > 0) {
						return;
					}

					endSlot = timestep;
				}}
				on:mouseup={(ev) => {
					if (!dragging) return;
					if (ev.button !== 0) return;

					dragging = false;

					if (!startSlot || !endSlot) return;

					emitter('create', { start: startSlot, end: endSlot });
				}}
				tabindex="0"
			>
				<span class="label">{timestep.hStart}:{timestep.mStart.toString().padStart(2, '0')}</span>
				<div class="marking" />
			</div>
		{/each}
	</div>
	<div class="fg">
		{#each filteredBookings as booking}
			<BookingButton {booking} {bookingHourLengthPx} {bookingLeftPadPx} {bookingTopPadPx} />
		{/each}
	</div>
</div>

<style lang="scss">
	.booking-day {
		width: 100%;
		contain: layout;

		.fg {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			pointer-events: none;
		}

		.bg {
			padding-top: 20px;
			padding-bottom: 20px;
			.timestep {
				display: flex;
				height: 30px;

				.label {
					margin-top: -11px;
					opacity: 0;
					margin-right: 10px;
					width: 45px;
					text-align: right;
					user-select: none;
				}

				.marking {
					flex-grow: 1;
					border-top: thin solid var(--color-border-slight);
				}

				&.top {
					.marking {
						border-top-color: var(--color-border);
					}

					.label {
						opacity: 1;
					}
				}

				&:last-child {
					.marking {
						border-bottom: thin solid var(--color-border);
					}
				}

				&.selectEndDirect:last-child {
					.marking {
						border-bottom-color: var(--color-accent);
					}
				}

				&.selected {
					.marking {
						background-color: var(--color-accent-bg);
					}
				}

				&.selectStart,
				&.selectEnd {
					.marking {
						border-top-color: var(--color-accent);
					}
					.label {
						color: var(--color-accent);
						opacity: 1;
					}
				}
			}
		}
	}
</style>
