<script lang="ts">
	import backend from '$lib/backend';
	import Loader from '$lib/components/Loader.svelte';
	import ProjectForm from '$lib/components/ProjectForm.svelte';
	import ProjectTile from '$lib/components/ProjectTile.svelte';
	import RoleGate from '$lib/components/RoleGate.svelte';
	import ShimmerWrapper from '$lib/components/ShimmerWrapper.svelte';
	import type { Project } from '$lib/types';
	import { Plus } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let loading = false;

	let editorActive = false;
	let editor: ProjectForm;

	let projects: Project[] = [];

	const load = async () => {
		loading = true;
		projects = await backend.getProjects();
		loading = false;
	};

	onMount(load);
</script>

<div class="projects">
	<div class="box">
		<h1>Projekte</h1>
	</div>

	<div class="overlay" class:active={editorActive}>
		<div class="container">
			<ProjectForm on:cancel={() => (editorActive = false)} bind:this={editor} />
		</div>
	</div>

	<div class="box long">
		<div class="controls">
			<ShimmerWrapper {loading} placeholder="22">{projects.length}</ShimmerWrapper> Projekt{projects.length !==
			1
				? 'e'
				: ''}
		</div>

		<div class="list">
			<Loader display="default" {loading} />

			<RoleGate required="project_manager">
				<button
					class="add-btn"
					on:click={() => {
						editor.loadProject({});
						editorActive = true;
					}}
				>
					<Plus />
					<span>Neues Projekt</span>
				</button>
			</RoleGate>

			{#each projects as project}
				<ProjectTile {project} />
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
