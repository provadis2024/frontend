<script lang="ts">
	import type { Project, User } from '$lib/types';
	import { ChevronRight, ClipboardList, Timer, User as UserIcon } from 'lucide-svelte';
	import ShimmerWrapper from './ShimmerWrapper.svelte';
	import backend from '$lib/backend';
	import { onMount } from 'svelte';

	export let project: Project;

	let taskCount: null | number = null;
	let owner: null | User = null;

	const load = async () => {
		if (!project.project_id) return;

		taskCount = (await backend.getTasks(project.project_id)).length;

		if (!project.owner_id) return;

		owner = await backend.getUser(project.owner_id);
	};

	onMount(load);
</script>

<a href="/projects/{project.project_id}" class="project">
	<span class="name">{project.name}</span>
	<div class="facts">
		<ClipboardList />
		<span><ShimmerWrapper loading={taskCount == null}>{taskCount}</ShimmerWrapper></span><br />
		<UserIcon />
		<span><ShimmerWrapper loading={owner == null}>{owner?.username}</ShimmerWrapper></span>
	</div>
	<span class="cta">Projekt öffnen <ChevronRight /></span>
</a>

<style lang="scss">
	.project {
		@include box;
		display: flex;
		flex-direction: column;
		gap: 5px;
		padding: 15px;
		min-width: 200px;

		.name {
			font-size: 1.2em;
			font-weight: 700;
		}

		.facts {
			display: flex;
			align-items: center;
			opacity: 0.75;
			gap: 5px;

			> :global(svg) {
				stroke-width: 1px;
			}
		}

		.cta {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			color: var(--color-accent);
		}
	}
</style>
