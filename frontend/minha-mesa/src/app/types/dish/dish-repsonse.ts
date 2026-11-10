export interface DishResponseDTO{
    id: number;
    name: string;
    dishCategoryName: string | null;
    dishCategoryId: number | null;
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