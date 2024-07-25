import type { DateTime } from 'luxon';

export type Booking = {
	time_entry_id?: string | null;
	startTs: DateTime;
	endTs: DateTime;
	project_id: number;
	task_id: number | null;
	user_id?: number;
};

export type Project = {
	project_id?: number | null;
	name: string;
	description: string | null;
	owner_id: number;
};

export type User = {
	user_id?: string | null;
	username: string;
	password?: string;
	role?: string;
};

export type Task = {
	task_id?: number | null;
	project_id: number;
	name: string;
	description: string;
};
