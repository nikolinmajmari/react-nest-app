import User from "../users/entities/user.entity";

export interface AuthenticatedDTO {
    user: Partial<User>;
}
