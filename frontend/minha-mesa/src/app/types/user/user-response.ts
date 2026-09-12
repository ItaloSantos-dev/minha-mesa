import { UserRole } from "../enums/user-role";

export interface UserResponseDTO{
    id: number;
    name:string;
    phone:string;
    role:UserRole
}