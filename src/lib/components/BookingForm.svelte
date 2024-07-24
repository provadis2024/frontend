<script lang="ts">
	import type { Booking } from "$lib/types";
	import type { Timestep } from "$lib/utils";
	import { X } from "lucide-svelte";
	import { DateTime } from "luxon";
	import { createEventDispatcher } from "svelte";

    const emitter = createEventDispatcher<{
        "cancel": undefined,
        "submit": Booking
    }>();

    let booking: Partial<Booking> = {};

    let date = '';
    let from = '';
    let to = '';

    $: {
        const startTs = DateTime.fromISO(date+'T'+from);
        const endTs = DateTime.fromISO(date+'T'+to);

        booking.startTs = startTs;
        booking.endTs = endTs;
    }

    export const loadBooking = (newBooking: Partial<Booking>) => {
        date = newBooking.startTs?.toISODate() || '';
        from = newBooking.startTs?.toFormat('HH:mm') || '';
        to   = newBooking.endTs?.toFormat('HH:mm') || '';

        booking = newBooking;
    }

    const submit = () => {
        if(!date) {
            alert("Datum benötigt.");
            return;
        }
        if(!from) {
            alert("Startzeit benötigt.");
            return;
        }
        if(!to) {
            alert("Endzeit benötigt.");
            return;
        }
        if(!booking.project) {
            alert("Projekt benötigt.");
            return;
        }
        if(!booking.task) {
            alert("Aufgabe benötigt.");
            return;
        }

        emitter("submit", booking as Booking);
    }
</script>
<form class="booking-form" on:submit={(ev) => {
    submit();
    ev.preventDefault();
}}>
    {#if booking.id}
        <h2>Eintrag bearbeiten</h2>
    {:else}
        <h2>Neuer Eintrag</h2>
    {/if}

    <button class="close" on:click={(ev) => {
        emitter("cancel");
        ev.preventDefault();
    }}><X/></button>

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
        <select id="project" bind:value={booking.project}>
            <option value="0">Allgemeine Arbeiten</option>
            <option value="1">My Project</option>
        </select>
    </div>
    <div class="group">
        <label for="task">Aufgabe</label>
        <select id="task" bind:value={booking.task}>
            <option value="0">Toilette</option>
            <option value="1">Kaffee holen</option>
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