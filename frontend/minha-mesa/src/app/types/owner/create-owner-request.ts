import { RegisterRequestDTO } from "../auth/register-request";

export interface CreateOwnerRequestDTO{
    cpf:string;
    nasciment:string;
    userData?:RegisterRequestDTO
}