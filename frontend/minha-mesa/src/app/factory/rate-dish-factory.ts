import { RateDishResponseDTO } from "../types/rate_dish/rate-dish-response";

export class RateDishFactory {
  private static readonly mocks: RateDishResponseDTO[] = [
    {
      id: 1,
      clientName: 'João Silva',
      dishId: 1,
      dishName: 'X-Bacon',
      reserveId: 1,
      restaurantName: 'Molho Sem Água',
      rating: 5,
      comment: 'Muito saboroso, ingredientes de qualidade!',
    },
    {
      id: 2,
      clientName: 'Maria Santos',
      dishId: 2,
      dishName: 'Pizza Calabresa',
      reserveId: 2,
      restaurantName: 'Pizzaria Central',
      rating: 4,
      comment: 'Muito boa, massa leve e recheio saboroso.',
    },
    {
      id: 3,
      clientName: 'Pedro Oliveira',
      dishId: 1,
      dishName: 'X-Bacon',
      reserveId: 3,
      restaurantName: 'Molho Sem Água',
      rating: 3,
      comment: 'Bom, mas poderia vir mais quente.',
    },
    {
      id: 4,
      clientName: 'Ana Costa',
      dishId: 3,
      dishName: 'Hambúrguer Artesanal',
      reserveId: 4,
      restaurantName: 'Burger House',
      rating: 5,
      comment: 'Excelente! Com certeza pediria novamente.',
    },
    {
      id: 5,
      clientName: 'Lucas Ferreira',
      dishId: 2,
      dishName: 'Pizza Calabresa',
      reserveId: 5,
      restaurantName: 'Pizzaria Central',
      rating: 4,
      comment: 'Muito saborosa e bem preparada.',
    },
  ];

  static createMock(): RateDishResponseDTO {
    return structuredClone(this.mocks[0]);
  }

  static createMocks(count = this.mocks.length): RateDishResponseDTO[] {
    return Array.from(
      { length: count },
      (_, index) => structuredClone(this.mocks[index % this.mocks.length]),
    );
  }
}