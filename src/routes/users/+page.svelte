<script lang="ts">
	import backend from '$lib/backend';
	import RoleGate from '$lib/components/RoleGate.svelte';
	import UserForm from '$lib/components/UserForm.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import ShimmerWrapper from '$lib/components/ShimmerWrapper.svelte';
	import type { User } from '$lib/types';
	import { Plus, User as UserIcon } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let loading = false;

	let editorActive = false;
	let editor: UserForm;

	let users: User[] = [];

	const load = async () => {
		loading = true;
		users = await backend.getUsers();
		loading = false;
	};

	onMount(load);
</script>

<div class="projects">
	<div class="box">
		<h1>Benutzer</h1>
	</div>

	<div class="overlay" class:active={editorActive}>
		<div class="container">
			<UserForm
				on:cancel={() => (editorActive = false)}
				bind:this={editor}
				on:submit={async (ev) => {
					loading = true;
					const response = await backend.persistUser(ev.detail);

					if (typeof response === 'string') {
						alert(response);
					}

					editorActive = false;
					load();
				}}
			/>
		</div>
	</div>

	<div class="box long">
		<div class="controls">
			<ShimmerWrapper {loading} placeholder="22">{users.length}</ShimmerWrapper> Benutzer
		</div>

		<div class="list">
			<RoleGate required="admin">
				<button
					class="add-btn"
					on:click={() => {
						editor.loadUser({});
						editorActive = true;
					}}
				>
					<Plus />
					<span>Neuer Benutzer</span>
				</button>
			</RoleGate>

			<Loader {loading} />

			{#each users as user}
				<button
					on:click={() => {
						editor.loadUser(user);
						editorActive = true;
					}}
					class="user"
					id="user-{user.user_id}"
				>
					<UserIcon />
					<span>{user.username}</span>
				</button>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	.projects {
		display: flex;
		flex-direction: column;
		height: 100%;
		@include gaps;

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

		.list {
			display: flex;
			flex-wrap: wrap;
			flex-grow: 1;
			align-items: flex-start;
			align-content: flex-start;
			@include gaps;

			.add-btn {
				align-self: stretch;
				width: 200px;
				@include button;
				border-style: dashed;
				border-width: 2px;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				gap: 10px;
			}

			.user {
				align-self: stretch;
				width: 200px;
				@include button;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				gap: 10px;
				background-color: transparent;
				border-color: var(--color-border);
				border-width: 2px;

				&:target {
					color: var(--color-accent);
					border-color: var(--color-accent);
				}
			}
		}

		.controls {
			@include box;
			padding: 8px 15px;
		}

		> * {
			flex-shrink: 0;
		}

		.box {
			@include box;
		}

		.long {
			flex-grow: 1;
			display: flex;
			flex-direction: column;
			@include gaps;
		}
	}
</style>
