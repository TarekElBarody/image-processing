export enum UserRoles {
  Admin = 1,
  Moderator = 2,
  User = 3
}

export type User = {
  id?: string;
  first_name: string;
  last_name: string;
  birthday: Date;
  email: string;
  password: string;
  mobile: string | null;
  role: UserRoles;
  created: Date | null;
};

export type ResUser = {
  id: string;
  first_name: string;
  last_name: string;
  birthday: Date;
  email: string;
  mobile: string | null;
  role: UserRoles;
  created: Date;
};

export type UserAll = {
  id: string;
  first_name: string;
  last_name: string;
  birthday: Date;
  email: string;
  mobile: string | null;
  role: UserRoles;
  created: Date;
  images_count: number;
  thumbs_count: number;
  total_visit: number;
  process_duration: number;
};

export type UserUpdate = {
  id: string;
  first_name?: string;
  last_name?: string;
  birthday?: Date;
  email?: string;
  password?: string;
  mobile?: string;
  role?: UserRoles;
  created?: Date;
};

export type UpdatePass = {
  id?: string;
  currentPassword: string;
  newPassword: string;
  confirmNew: string;
};
