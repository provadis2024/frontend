import { Settings } from 'luxon';
import type { LayoutLoad } from './$types';
import backend, { type GetSelfResponse } from '$lib/backend';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';

export const load = (async ({ route }) => {
	let self: GetSelfResponse | null | undefined = undefined;

	if (browser) {
		self = await backend.getSelf();
	}

	const isLogin = route.id == '/signin';

	if (browser && self == null && !isLogin) {
		goto('/signin');
	}

	Settings.defaultLocale = 'de-DE';
	return { self, isLogin };
}) satisfies LayoutLoad;
