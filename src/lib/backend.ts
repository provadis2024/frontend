import type { Booking, Project, Task, User } from "./types";

const backend = {};

const getSelf = (): User => {
    const user: User = {
        id: '1',
        username: 'demo',
        role: 'ADMIN'
    };

    return user;
}

const getProjects = () => {

}

const getProject = (id: string) => {

}

const persistProject = (project: Project) => {

}

const getTasks = (projectId: string) => {

}

const persistTask = (task: Task) => {

}

const getBookings = () => {

}

const persistBooking = (booking: Booking) => {

}

const getUsers = () => {
    
}

const persistUser = (user: User) => {
    
}

const isAdmin = (user: User): boolean => {
    return user.role == 'ADMIN';
}

const isProjectManager = (user: User): boolean => {
    return user.role == 'PROJECT_MANAGER' || user.role == 'ADMIN';
}



export default backend;