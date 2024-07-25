<script lang="ts">
	import backend, { type GetSelfResponse, type UserRole } from '$lib/backend';
	import { onMount } from 'svelte';

	export let required: UserRole = 'employee';

	let self: GetSelfResponse | null = null;

	let gateOk = false;

	const load = async () => {
		self = await backend.getSelf();

		if (required == 'employee') {
			gateOk = self != null;
			return;
		}

		if (required == 'project_manager') {
			gateOk = self.role == 'project_manager' || self.role == 'admin';
			return;
		}

		if (required == 'admin') {
			gateOk = self.role == 'admin';
			return;
		}
	};

	onMount(load);
</script>

{#if gateOk}
	<slot />
{/if}
