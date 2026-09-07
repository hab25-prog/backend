export type CreateUserInput = {
    email: string;
    username: string;
    passwordHash: string;
    fullName: string;
};

export type LoginInput = {
    username: string;
    password: string;
};

export type UpdateUserInput = {
    fullName?: string;
    profileImage?: string;
};