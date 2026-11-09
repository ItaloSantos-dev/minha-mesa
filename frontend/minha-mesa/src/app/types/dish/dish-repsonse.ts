export interface DishResponseDTO{
    id: number;
    name: string;
    dishCategoryName: string;
    dishCategoryId: number;
    restaurantName: string;
    restaurantId: number;
    description: string | null;
    preparationTime: number;
    rating: number;
    price: number;
    slug: string;
    imageLink: string;
    active: boolean;
}