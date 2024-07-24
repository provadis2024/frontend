import type { DateTime } from "luxon";


export type Booking = {
    id?: string|null
    startTs: DateTime
    endTs: DateTime
    project: string
    task: string
};

export type Project = {
    id?: string|null
    name: string
    description: string
    members: User[]|string[]
    owner: User|string
}

export type User = {
    id?: string|null
    username: string
    password?: string
    role: string
}

export type Task = {
    id?: string|null
    project: string
    text: string
    description: string
}