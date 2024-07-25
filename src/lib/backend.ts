import { writable } from 'svelte/store';
import type { Booking, Project, Task, User } from './types';
import { DateTime } from 'luxon';

export const role = writable<UserRole | 'unauthenticated'>('employee');
export const admin = writable<boolean>(false);
export const manager = writable<boolean>(false);

const base = 'https://timetrack-api.1in9.net';

const makeUrl = (path: string) => {
	const url = new URL(path, base);

	return url;
};

const makeHeaders = (headerInit: HeadersInit) => {
	const headers = new Headers(headerInit);

	const token = localStorage.getItem('token');

	if (token) headers.set('Authorization', `Bearer ${token}`);

	return headers;
};

export type UserRole = 'admin' | 'project_manager' | 'employee';

type SignInResponse = {
	access_token: string;
	message: string;
	user_id: number;
	user_role: UserRole;
	username: string;
};

const signin = async (username: string, password: string) => {
	const response = await fetch(makeUrl('/signin'), {
		method: 'POST',
		body: JSON.stringify({
			username,
			password
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) return false;

	return (await response.json()) as SignInResponse;
};

export type GetSelfResponse = {
	id: number;
	message: string;
	role: UserRole;
};

let getSelfCache: GetSelfResponse | null = null;

const signout = () => {
	localStorage.removeItem('token');
	getSelfCache = null;
	role.set('unauthenticated');
	manager.set(false);
	admin.set(false);
};

const getSelf = async () => {
	if (getSelfCache) return getSelfCache;

	const response = await fetch(makeUrl('/'), {
		headers: makeHeaders({})
	});

	if (!response.ok) {
		signout();

		return null;
	}

	const responseData = (await response.json()) as GetSelfResponse;
	getSelfCache = responseData;
	role.set(responseData.role);
	manager.set(responseData.role == 'admin' || responseData.role == 'project_manager');
	admin.set(responseData.role == 'admin');

	return responseData;
};

type ProjectsResponse = Project[];

const getProjects = async () => {
	const response = await fetch(makeUrl('/projects'), {
		headers: makeHeaders({})
	});

	return (await response.json()) as ProjectsResponse;
};

const getProject = async (id: number) => {
	const response = await fetch(makeUrl(`/projects/${id}`), {
		headers: makeHeaders({})
	});

	return (await response.json()) as Project & {
		users: User[];
	};
};

const persistProject = (project: Project) => {};

type TasksResponse = Task[];

const getTasks = async (projectId: number) => {
	const response = await fetch(makeUrl('/tasks'), {
		headers: makeHeaders({})
	});

	return ((await response.json()) as TasksResponse).filter((task) => {
		return task.project_id == projectId;
	});
};

const getTask = async (taskId: number) => {
	const response = await fetch(makeUrl('/tasks'), {
		headers: makeHeaders({})
	});

	return ((await response.json()) as TasksResponse).find((task) => {
		return task.task_id == taskId;
	});
};

const persistTask = (task: Task) => {};

type BookingResponse = {
	time_entry_id?: string | null;
	start_time: string;
	end_time: string;
	project_id: number;
	task_id: number;
	user_id?: number;
}[];

const getBookings = async () => {
	const response = await fetch(makeUrl('/booking'), {
		headers: makeHeaders({})
	});

	const responseData = (await response.json()) as BookingResponse;

	return responseData.map((rawBooking): Booking => {
		return {
			time_entry_id: rawBooking.time_entry_id,
			project_id: rawBooking.project_id,
			task_id: rawBooking.task_id,
			user_id: rawBooking.user_id,
			startTs: DateTime.fromSQL(rawBooking.start_time),
			endTs: DateTime.fromISO(rawBooking.end_time)
		};
	});
};

const persistBooking = async (booking: Booking) => {
	const response = await fetch(makeUrl('/booking'), {
		method: 'POST',
		headers: makeHeaders({
			'Content-Type': 'application/json'
		}),
		body: JSON.stringify({
			start_time: booking.startTs.toISO(),
			project_id: booking.project_id,
			user_id: booking.user_id,
			task_id: booking.task_id,
			end_time: booking.endTs.toISO()
		})
	});

	if (!response.ok) {
		const data = await response.json();

		return data.message as string;
	}

	return response.ok;
};

type UsersResponse = User[];

const getUsers = async () => {
	const response = await fetch(makeUrl('/users'), {
		headers: makeHeaders({})
	});

	return (await response.json()) as UsersResponse;
};

const getUser = async (user_id: number) => {
	const response = await fetch(makeUrl(`/users/${user_id}`), {
		headers: makeHeaders({})
	});

	return (await response.json()) as User & {
		projects: Project[];
	};
};

const persistUser = (user: User) => {};

const isAdmin = (user: User): boolean => {
	return user.role == 'ADMIN';
};

const isProjectManager = (user: User): boolean => {
	return user.role == 'PROJECT_MANAGER' || user.role == 'ADMIN';
};

const backend = {
	signin,
	getProjects,
	getProject,
	getTasks,
	getTask,
	getUsers,
	getUser,
	getSelf,
	getBookings,
	persistBooking,
	signout
};

export default backend;
