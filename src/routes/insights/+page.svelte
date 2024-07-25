<script lang="ts">
	import type {
		ProjectWorkHoursResponse,
		TaskWorkHoursResponse,
		UserWorkHoursResponse
	} from '$lib/backend';
	import backend from '$lib/backend';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Loader from '$lib/components/Loader.svelte';
	import ShimmerWrapper from '$lib/components/ShimmerWrapper.svelte';

	export let data: PageData;

	let userWorkHours: UserWorkHoursResponse | null = null;
	let projectWorkHours: ProjectWorkHoursResponse;
	let taskWorkHours: TaskWorkHoursResponse;

	let loading = false;

	const load = async () => {
		loading = true;
		projectWorkHours = await backend.getProjectWorkHours();

		projectWorkHours.work_hours = projectWorkHours.work_hours.sort((a, b) => {
			return b.total_hours_worked_on_project - a.total_hours_worked_on_project;
		});

		taskWorkHours = await backend.getTaskWorkHours();

		taskWorkHours.projects = taskWorkHours.projects.filter((project) => {
			return project.tasks.length > 0;
		});

		taskWorkHours.projects = taskWorkHours.projects.map((original) => {
			original.tasks = original.tasks.sort((a, b) => {
				return b.time_spent - a.time_spent;
			});

			return original;
		});

		if (data.self?.role == 'admin') userWorkHours = await backend.getUserWorkHours();
		loading = false;
	};

	onMount(load);
</script>

<div class="insights">
	<div class="box">
		<h1>Analysen</h1>
	</div>

	<div class="long">
		<Loader display="overlay" {loading} />

		{#if projectWorkHours}
			<div class="box">
				<h2>Projektzeiten</h2>

				<table>
					<thead>
						<tr>
							<th>Projekt</th>
							<th>Zeit (Std.)</th>
						</tr>
					</thead>
					<tbody>
						{#each projectWorkHours.work_hours as project}
							<tr>
								<td>
									{#await backend.getProject(project.project_id)}
										<ShimmerWrapper loading placeholder="My Project" />
									{:then db_project}
										{db_project.name}
									{/await}
								</td>
								<td>{project.total_hours_worked_on_project}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		{#if taskWorkHours}
			{#each taskWorkHours.projects as project}
				<div class="box">
					<h2>
						Aufgabenzeiten: {project.project_name}
					</h2>

					<table>
						<thead>
							<tr>
								<th>Aufgabe</th>
								<th>Zeit (Std.)</th>
							</tr>
						</thead>
						<tbody>
							{#each project.tasks as task}
								<tr>
									<td>
										{task.task_name}
									</td>
									<td>{task.time_spent}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/each}
		{/if}

		{#if userWorkHours}
			<div class="box">
				<h2>Benutzerzeiten</h2>

				<table>
					<thead>
						<tr>
							<th>Benutzer</th>
							<th>Zeit (Std.)</th>
						</tr>
					</thead>
					<tbody>
						{#each userWorkHours.work_hours as user}
							<tr>
								<td>
									{#await backend.getUser(user.user_id)}
										<ShimmerWrapper loading placeholder="max.muster" />
									{:then db_user}
										{db_user.username}
									{/await}
								</td>
								<td>{user.total_hours_worked}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.insights {
		display: flex;
		flex-direction: column;
		height: 100%;
		@include gaps;

		form {
			display: contents;
		}

		> * {
			flex-shrink: 0;
		}

		.box {
			@include box;

			table {
				width: 100%;
				text-align: center;
			}
		}

		.long {
			display: flex;
			//flex-direction: column;
			flex-wrap: wrap;
			@include gaps;
			width: 100%;
			overflow: auto;

			> * {
				flex-grow: 1;
			}
		}
	}
</style>
