<script lang="ts">
	import '../app.scss';
	import {
		House,
		ChevronsLeft,
		ChevronsRight,
		Users,
		ClipboardList,
		CalendarClock,
		Moon,
		LogIn
	} from 'lucide-svelte';
	import { page } from '$app/stores';
	import Loader from '$lib/components/Loader.svelte';
	import type { PageData } from './$types';

	let sidebarExtended = true;

	export let data: PageData;
</script>

<div class="layout">
	<Loader display="overlay" loading={data.self == null} />

	<nav class="sidebar" class:extended={sidebarExtended}>
		<a href="/" class="logo">
			{#if sidebarExtended}
				TimeTrack
			{:else}
				TT
			{/if}
		</a>

		<hr />

		{#if !data.isLogin}
			<a href="/" class:active={$page.url.pathname == '/'}>
				<House />
				{#if sidebarExtended}<span>Dashboard</span>{/if}
			</a>

			<a href="/projects" class:active={$page.url.pathname.startsWith('/projects')}>
				<ClipboardList />
				{#if sidebarExtended}<span>Projekte</span>{/if}
			</a>
			<a href="/bookings" class:active={$page.url.pathname.startsWith('/bookings')}>
				<CalendarClock />
				{#if sidebarExtended}<span>Zeitbuchungen</span>{/if}
			</a>
			<a href="/users" class:active={$page.url.pathname.startsWith('/users')}>
				<Users />
				{#if sidebarExtended}<span>Benutzer</span>{/if}
			</a>
		{:else}
			<a href="/signin" class:active={$page.url.pathname == '/signin'}>
				<LogIn />
				{#if sidebarExtended}<span>Anmeldung</span>{/if}
			</a>
		{/if}

		<button class="night-button" on:click={() => document.body.classList.toggle('light')}>
			<Moon />
		</button>
		<button class="extend-button" on:click={() => (sidebarExtended = !sidebarExtended)}>
			{#if sidebarExtended}
				<ChevronsLeft />
			{:else}
				<ChevronsRight />
			{/if}
		</button>
	</nav>
	<div class="content">
		<slot />
	</div>
	<footer></footer>
</div>

<style lang="scss">
	.layout {
		display: flex;
		width: 100%;
		min-height: 100vh;
		@include gaps;
		padding: var(--padding-box);

		.content {
			flex-grow: 1;
			container-type: size;
			container-name: layout;
			overflow: auto;
		}

		.sidebar {
			@include box;

			display: flex;
			flex-direction: column;
			gap: 10px;

			hr {
				width: 100%;
				border-color: var(--color-border);
			}

			&.extended {
				width: 250px;
			}

			.logo {
				justify-content: center;
				border: 1px solid var(--color-border);
			}

			a,
			button {
				color: inherit;
				text-decoration: none;
				padding: 10px;
				border-radius: 20px;
				display: flex;
				align-items: center;
				gap: 10px;
				border: none;
				margin: 0;
				cursor: pointer;
				background-color: transparent;
				color: inherit;

				&.active {
					background-color: var(--color-accent-bg);
					color: var(--color-accent);
				}
			}

			button {
				justify-content: right;
				align-self: flex-end;
			}

			.night-button {
				margin-top: auto;
			}

			/*.extend-button {
                margin-top: auto;
            }*/
		}
	}
</style>
