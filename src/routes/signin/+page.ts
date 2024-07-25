import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import backend from '$lib/backend';

export const load = (async () => {
	if (browser) {
		if ((await backend.getSelf()) !== null) {
			throw redirect(302, '/');
		}
	}

	return {};
}) satisfies PageLoad;
