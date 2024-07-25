import { Settings } from 'luxon';
import type { LayoutLoad } from './$types';
import backend from '$lib/backend';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';

export const load = (async ({ route }) => {
	let self = null;

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
