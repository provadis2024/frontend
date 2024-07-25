<script lang="ts">
	import backend from '$lib/backend';
	import BookingDay from '$lib/components/BookingDay.svelte';
	import BookingForm from '$lib/components/BookingForm.svelte';
	import type { Booking } from '$lib/types';
	import { ChevronsLeft, ChevronsRight, Plus } from 'lucide-svelte';
	import { DateTime } from 'luxon';
	import { onMount } from 'svelte';
	import type { PageData } from '../$types';
	import Loader from '$lib/components/Loader.svelte';

	export let data: PageData;

	let bookingActive = false;

	let weekBase = DateTime.now();

	$: startDate = weekBase.startOf('week');
	$: endDate = weekBase.endOf('week').startOf('day');

	$: days = Array.from({ length: endDate.diff(startDate, 'days').as('days') + 1 }).map((_, i) => {
		return startDate.plus({ days: i });
	});

	let loading = false;

	let selectedUser = data.self?.id || 0;

	let dayElements: BookingDay[] = [];

	let rawBookings: Booking[] = [];

	$: bookings = rawBookings.filter((booking) => {
		return booking.user_id == selectedUser;
	});

	let form: BookingForm;

	const cancelAllSelections = () => {
		dayElements.forEach((dayElement) => {
			if (!dayElement) return;

			dayElement.cancelSelection();
		});
	};

	const load = async () => {
		loading = true;
		rawBookings = await backend.getBookings();
		loading = false;
	};

	onMount(load);
</script>

<div class="bookings">
	<div class="box">
		<h1>Zeitbuchungen</h1>

		<div class="weekswitcher">
			<button
				on:click={() => {
					weekBase = weekBase.minus({ weeks: 1 });
				}}><ChevronsLeft /></button
			>

			<div class="current">
				<span
					>W{startDate.weekNumber}{startDate.weekNumber !== endDate.weekNumber
						? `/${endDate.weekNumber}`
						: ''}</span
				>
				<span>{startDate.year}{startDate.year !== endDate.year ? `/${endDate.year}` : ''}</span>
			</div>

			<button
				on:click={() => {
					weekBase = weekBase.plus({ weeks: 1 });
				}}><ChevronsRight /></button
			>

			<button
				on:click={() => {
					form.loadBooking({
						startTs: weekBase
					});
					bookingActive = true;
				}}><Plus /></button
			>
		</div>
	</div>

	<div class="box long">
		<Loader display="overlay" {loading} />

		<div class="scroller">
			<div class="overscroll">
				<div class="days">
					{#each days as day}
						<div class="day">
							<span class="weekday">
								{day.toFormat('ccc')}
							</span>
							<span class="date">
								{day.toFormat('dd.LL.')}
							</span>
						</div>
					{/each}
				</div>
				<div class="schedules">
					{#each days as day, dayIdx}
						<div class="day">
							<BookingDay
								date={day}
								{bookings}
								on:create={(payload) => {
									bookingActive = true;

									const { start, end } = payload.detail;

									form.loadBooking({
										startTs: start.datestamp.set({ hour: start.hStart, minute: start.mStart }),
										endTs: end.datestamp.set({ hour: end.hEnd, minute: end.mEnd })
									});
								}}
								bind:this={dayElements[dayIdx]}
								on:edit={(ev) => {
									form.loadBooking(ev.detail);
									bookingActive = true;
								}}
							/>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="overlay" class:active={bookingActive}>
			<div class="container">
				<BookingForm
					on:cancel={() => {
						bookingActive = false;
						cancelAllSelections();
					}}
					on:submit={async (ev) => {
						loading = true;
						const response = await backend.persistBooking(ev.detail);

						if (typeof response === 'string') {
							alert(response);
						}

						bookingActive = false;
						cancelAllSelections();
						load();
					}}
					bind:this={form}
				/>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.bookings {
		display: flex;
		flex-direction: column;
		height: 100%;
		@include gaps;

		> * {
			flex-shrink: 0;
		}

		.box {
			@include box;
		}

		.weekswitcher {
			display: flex;
			gap: 10px;

			button {
				@include button;
				color: var(--color-accent);
				width: 40px;
				height: 40px;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.current {
				display: flex;
				flex-direction: column;
				text-align: center;
				width: 150px;
			}
		}

		.long {
			flex-grow: 1;
			display: flex;
			flex-direction: column;
			@include gaps;
			flex-basis: 0;
			height: 0;
			overflow: hidden;
			contain: layout;
			padding: 0;

			.scroller {
				width: 100%;
				height: 100%;
				overflow: auto;
				display: flex;
				flex-direction: column;

				.overscroll {
					width: fit-content;
				}

				.days {
					position: sticky;
					top: 0;
					background-color: var(--color-background);
					border-bottom: thin solid var(--color-border);
					z-index: 100;

					.day {
						padding: 15px 25px;

						display: flex;
						flex-direction: column;

						.weekday {
							font-size: 2em;
							font-weight: 800;
						}
					}
				}

				.days,
				.schedules {
					display: flex;

					> * {
						min-width: 300px;
						padding-right: 15px;
						padding-left: 10px;

						&:not(:last-child) {
							border-right: thin solid var(--color-border);
						}
					}
				}
			}

			.overlay {
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background-color: var(--color-background-transparent);
				opacity: 0;
				pointer-events: none;
				z-index: 300;

				&.active {
					opacity: 1;
					pointer-events: auto;
				}

				.container {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					width: 90%;
					max-width: 380px;
				}
			}
		}
	}
</style>
