import { browser } from '$app/environment';
import backend from '$lib/backend';
import type { Project } from '$lib/types';
import type { User } from 'lucide-svelte';
import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
	if (!browser) {
		const dummyProject: Project & { users: User[] } = {
			name: 'Loading...',
			description: null,
			owner_id: 0,
			users: []
		};

		return { project: dummyProject };
	}

	const project = await backend.getProject(params.id);

	return { project };
}) satisfies PageLoad;
