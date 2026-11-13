import { DishResponseDTO } from "../types/dish/dish-repsonse";
import { RateDishFactory } from "./rate-dish-factory";

export class DishFactory {
  private static readonly mocks: DishResponseDTO[] = [
    {
      id: 1,
      name: 'X-Bacon',
      dishCategoryName: 'Hambúrgueres',
      dishCategoryId: 1,
      restaurantName: 'Molho Sem Água',
      restaurantId: 1,
      description: 'Pão, hambúrguer artesanal, queijo cheddar, bacon e molho especial.',
      preparationTime: 900,
      rating: 4.8,
      price: 25.90,
      slug: 'x-bacon',
      imageLink: 'default/dish.jpg',
      active: true,
      rates: RateDishFactory.createMocks(3),
    },
    {
      id: 2,
      name: 'Pizza Calabresa',
      dishCategoryName: 'Pizzas',
      dishCategoryId: 2,
      restaurantName: 'Pizzaria Central',
      restaurantId: 2,
      description: 'Pizza com molho de tomate, muçarela, calabresa e cebola.',
      preparationTime: 1800,
      rating: 4.5,
      price: 39.90,
      slug: 'pizza-calabresa',
      imageLink: 'default/dish.jpg',
      active: true,
      rates: RateDishFactory.createMocks(2),
    },
    {
      id: 3,
      name: 'Hambúrguer Artesanal',
      dishCategoryName: 'Hambúrgueres',
      dishCategoryId: 1,
      restaurantName: 'Molho Sem Água',
      restaurantId: 1,
      description: 'Hambúrguer artesanal com queijo, alface, tomate e molho da casa.',
      preparationTime: 1200,
      rating: 5,
      price: 29.90,
      slug: 'hamburguer-artesanal',
      imageLink: 'default/dish.jpg',
      active: true,
      rates: RateDishFactory.createMocks(4),
    },
    {
      id: 4,
      name: 'Batata Frita',
      dishCategoryName: 'Acompanhamentos',
      dishCategoryId: 3,
      restaurantName: 'Molho Sem Água',
      restaurantId: 1,
      description: 'Porção de batatas fritas crocantes.',
      preparationTime: 600,
      rating: 4.2,
      price: 15.90,
      slug: 'batata-frita',
      imageLink: 'default/dish.jpg',
      active: true,
      rates: RateDishFactory.createMocks(2),
    },
    {
      id: 5,
      name: 'Suco de Laranja',
      dishCategoryName: 'Bebidas',
      dishCategoryId: 4,
      restaurantName: 'Molho Sem Água',
      restaurantId: 1,
      description: 'Suco natural de laranja, preparado na hora.',
      preparationTime: 300,
      rating: 4.7,
      price: 8.90,
      slug: 'suco-de-laranja',
      imageLink: 'default/dish.jpg',
      active: false,
      rates: RateDishFactory.createMocks(1),
    },
  ];

  static createMock(): DishResponseDTO {
    return structuredClone(this.mocks[0]);
  }

  static createMocks(count = this.mocks.length): DishResponseDTO[] {
    return Array.from(
      { length: count },
      (_, index) => structuredClone(this.mocks[index % this.mocks.length]),
    );
  }
}