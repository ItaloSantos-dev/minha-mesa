import { CreateOwnerRequestDTO } from "../owner/create-owner-request";

export interface CreateRestaurantRequestDTO{
    name:string;
    address:string;
    phone:string;
    ownerData:CreateOwnerRequestDTO
}