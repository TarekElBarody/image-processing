import { derived, Writable, writable } from 'svelte/store';

export enum UserRoles {
    Admin = 1,
    Moderator = 2,
    User = 3
}

export type User = {
    id: string | null;
    first_name: string | null;
    last_name: string | null;
    role: UserRoles | null;
    email?: UserRoles | null;
};

export type Tasks = {
    task?: string;
    userID?: string;
};

export const isAuthenticated = writable(false);
export const token = writable('');

export const user: Writable<User> = writable({
    id: null,
    first_name: null,
    last_name: null,
    role: null
});

export const error = writable();

export const tasks: Writable<Tasks[]> = writable([]);

export const user_tasks = derived([tasks, user], ([$tasks, $user]) => {
    let logged_in_user_tasks: any[] = [];

    if ($user && $user.id) {
        logged_in_user_tasks = $tasks.filter((task) => task.userID === $user.id);
    }

    return logged_in_user_tasks;
});
