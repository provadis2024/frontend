import { Settings } from 'luxon';
import type { LayoutLoad } from './$types';

export const load = (async () => {
    Settings.defaultLocale = "de-DE";
    return {};
}) satisfies LayoutLoad;