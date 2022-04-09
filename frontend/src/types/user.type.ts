export default interface IUser {
    id?: any | null;
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
    role?: Array<string>;
}
