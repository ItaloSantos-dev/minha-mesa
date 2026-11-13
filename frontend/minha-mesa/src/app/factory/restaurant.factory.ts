import { DayOfWeek } from '../types/enums/day-of-week';
import { RestaurantResponseDTO } from '../types/restaurant/restaurant-response';
import { BestRatingsFactory } from './best-ratings-factory';
import { WorkingScheduleFactory } from './working-schedule.factory';

export class RestaurantFactory {
  private static readonly searchMocks: RestaurantResponseDTO[] = [
  {
    id: 1,
    name: "Molho Sem Água",
    phone: "(98) 99999-1111",
    address: "Rua das Flores, 120 - Centro",
    active: true,
    imagePerfilLink: "https://placehold.co/200x200",
    imageBannerLink: "https://placehold.co/1200x400",
    workingDays: [
      { id: 1, dayOfWeek: DayOfWeek.MONDAY, timeStart: "18:00", timeEnd: "23:00" },
      { id: 2, dayOfWeek: DayOfWeek.TUESDAY, timeStart: "18:00", timeEnd: "23:00" },
      { id: 3, dayOfWeek: DayOfWeek.WEDNESDAY, timeStart: "18:00", timeEnd: "23:00" },
      { id: 4, dayOfWeek: DayOfWeek.THURSDAY, timeStart: "18:00", timeEnd: "23:00" },
      { id: 5, dayOfWeek: DayOfWeek.FRIDAY, timeStart: "18:00", timeEnd: "00:00" },
      { id: 6, dayOfWeek: DayOfWeek.SATURDAY, timeStart: "18:00", timeEnd: "00:00" }
    ],
    bestRatings: BestRatingsFactory.createMock()
  },
  {
    id: 2,
    name: "Burger House",
    phone: "(98) 98888-2222",
    address: "Av. Principal, 450 - Centro",
    active: true,
    imagePerfilLink: "https://placehold.co/200x200",
    imageBannerLink: "https://placehold.co/1200x400",
    workingDays: [
      { id: 7, dayOfWeek: DayOfWeek.MONDAY, timeStart: "11:00", timeEnd: "22:00" },
      { id: 8, dayOfWeek: DayOfWeek.TUESDAY, timeStart: "11:00", timeEnd: "22:00" },
      { id: 9, dayOfWeek: DayOfWeek.WEDNESDAY, timeStart: "11:00", timeEnd: "22:00" },
      { id: 10, dayOfWeek: DayOfWeek.THURSDAY, timeStart: "11:00", timeEnd: "22:00" },
      { id: 11, dayOfWeek: DayOfWeek.FRIDAY, timeStart: "11:00", timeEnd: "23:00" },
      { id: 12, dayOfWeek: DayOfWeek.SATURDAY, timeStart: "11:00", timeEnd: "23:00" },
      { id: 13, dayOfWeek: DayOfWeek.SUNDAY, timeStart: "17:00", timeEnd: "22:00" }
    ],
    bestRatings: BestRatingsFactory.createMock()
  },
  {
    id: 3,
    name: "Pizza Suprema",
    phone: "(98) 97777-3333",
    address: "Rua do Comércio, 85 - Vila Nova",
    active: true,
    imagePerfilLink: "https://placehold.co/200x200",
    imageBannerLink: "https://placehold.co/1200x400",
    workingDays: [
      { id: 14, dayOfWeek: DayOfWeek.TUESDAY, timeStart: "18:00", timeEnd: "23:00" },
      { id: 15, dayOfWeek: DayOfWeek.WEDNESDAY, timeStart: "18:00", timeEnd: "23:00" },
      { id: 16, dayOfWeek: DayOfWeek.THURSDAY, timeStart: "18:00", timeEnd: "23:00" },
      { id: 17, dayOfWeek: DayOfWeek.FRIDAY, timeStart: "18:00", timeEnd: "00:00" },
      { id: 18, dayOfWeek: DayOfWeek.SATURDAY, timeStart: "18:00", timeEnd: "00:00" },
      { id: 19, dayOfWeek: DayOfWeek.SUNDAY, timeStart: "18:00", timeEnd: "23:00" }
    ],
    bestRatings: BestRatingsFactory.createMock()
  },
  {
    id: 4,
    name: "Sabor Nordestino",
    phone: "(98) 96666-4444",
    address: "Rua São Pedro, 230 - Centro",
    active: true,
    imagePerfilLink: "https://placehold.co/200x200",
    imageBannerLink: "https://placehold.co/1200x400",
    workingDays: [
      { id: 20, dayOfWeek: DayOfWeek.MONDAY, timeStart: "11:00", timeEnd: "15:00" },
      { id: 21, dayOfWeek: DayOfWeek.TUESDAY, timeStart: "11:00", timeEnd: "15:00" },
      { id: 22, dayOfWeek: DayOfWeek.WEDNESDAY, timeStart: "11:00", timeEnd: "15:00" },
      { id: 23, dayOfWeek: DayOfWeek.THURSDAY, timeStart: "11:00", timeEnd: "15:00" },
      { id: 24, dayOfWeek: DayOfWeek.FRIDAY, timeStart: "11:00", timeEnd: "15:00" }
    ],
    bestRatings: BestRatingsFactory.createMock()
  },
  {
    id: 5,
    name: "La Pasta Italiana",
    phone: "(98) 95555-5555",
    address: "Av. Brasil, 510 - Jardim",
    active: true,
    imagePerfilLink: "https://placehold.co/200x200",
    imageBannerLink: "https://placehold.co/1200x400",
    workingDays: WorkingScheduleFactory.createMocks(3),
    bestRatings: BestRatingsFactory.createMock()
  },
  {
    id: 6,
    name: "Tropical Açaí",
    phone: "(98) 94444-6666",
    address: "Rua das Palmeiras, 90 - Centro",
    active: true,
    imagePerfilLink: "https://placehold.co/200x200",
    imageBannerLink: "https://placehold.co/1200x400",
    workingDays: [
      { id: 30, dayOfWeek: DayOfWeek.MONDAY, timeStart: "14:00", timeEnd: "22:00" },
      { id: 31, dayOfWeek: DayOfWeek.TUESDAY, timeStart: "14:00", timeEnd: "22:00" },
      { id: 32, dayOfWeek: DayOfWeek.WEDNESDAY, timeStart: "14:00", timeEnd: "22:00" },
      { id: 33, dayOfWeek: DayOfWeek.THURSDAY, timeStart: "14:00", timeEnd: "22:00" },
      { id: 34, dayOfWeek: DayOfWeek.FRIDAY, timeStart: "14:00", timeEnd: "23:00" },
      { id: 35, dayOfWeek: DayOfWeek.SATURDAY, timeStart: "14:00", timeEnd: "23:00" },
      { id: 36, dayOfWeek: DayOfWeek.SUNDAY, timeStart: "14:00", timeEnd: "22:00" }
    ],
    bestRatings: BestRatingsFactory.createMock()
  },
  {
    id: 7,
    name: "Churrascaria Boi na Brasa",
    phone: "(98) 93333-7777",
    address: "Av. dos Restaurantes, 700 - Centro",
    active: true,
    imagePerfilLink: "https://placehold.co/200x200",
    imageBannerLink: "https://placehold.co/1200x400",
    workingDays: [
      { id: 37, dayOfWeek: DayOfWeek.MONDAY, timeStart: "11:00", timeEnd: "15:00" },
      { id: 38, dayOfWeek: DayOfWeek.TUESDAY, timeStart: "11:00", timeEnd: "15:00" },
      { id: 39, dayOfWeek: DayOfWeek.WEDNESDAY, timeStart: "11:00", timeEnd: "15:00" },
      { id: 40, dayOfWeek: DayOfWeek.THURSDAY, timeStart: "11:00", timeEnd: "15:00" },
      { id: 41, dayOfWeek: DayOfWeek.FRIDAY, timeStart: "11:00", timeEnd: "15:00" },
      { id: 42, dayOfWeek: DayOfWeek.SATURDAY, timeStart: "11:00", timeEnd: "16:00" },
      { id: 43, dayOfWeek: DayOfWeek.SUNDAY, timeStart: "11:00", timeEnd: "16:00" }
    ],
    bestRatings: BestRatingsFactory.createMock()
  },
  {
    id: 8,
    name: "Temaki Express",
    phone: "(98) 92222-8888",
    address: "Rua das Acácias, 150 - Jardim",
    active: true,
    imagePerfilLink: "https://placehold.co/200x200",
    imageBannerLink: "https://placehold.co/1200x400",
    workingDays: [
      { id: 44, dayOfWeek: DayOfWeek.TUESDAY, timeStart: "18:00", timeEnd: "22:30" },
      { id: 45, dayOfWeek: DayOfWeek.WEDNESDAY, timeStart: "18:00", timeEnd: "22:30" },
      { id: 46, dayOfWeek: DayOfWeek.THURSDAY, timeStart: "18:00", timeEnd: "22:30" },
      { id: 47, dayOfWeek: DayOfWeek.FRIDAY, timeStart: "18:00", timeEnd: "23:30" },
      { id: 48, dayOfWeek: DayOfWeek.SATURDAY, timeStart: "18:00", timeEnd: "23:30" },
      { id: 49, dayOfWeek: DayOfWeek.SUNDAY, timeStart: "18:00", timeEnd: "22:30" }
    ],
    bestRatings: BestRatingsFactory.createMock()
  },
  {
    id: 9,
    name: "Cantina da Praça",
    phone: "(98) 91111-9999",
    address: "Praça Central, 35 - Centro",
    active: true,
    imagePerfilLink: "https://placehold.co/200x200",
    imageBannerLink: "https://placehold.co/1200x400",
    workingDays: [
      { id: 50, dayOfWeek: DayOfWeek.MONDAY, timeStart: "11:00", timeEnd: "14:30" },
      { id: 51, dayOfWeek: DayOfWeek.TUESDAY, timeStart: "11:00", timeEnd: "14:30" },
      { id: 52, dayOfWeek: DayOfWeek.WEDNESDAY, timeStart: "11:00", timeEnd: "14:30" },
      { id: 53, dayOfWeek: DayOfWeek.THURSDAY, timeStart: "11:00", timeEnd: "14:30" },
      { id: 54, dayOfWeek: DayOfWeek.FRIDAY, timeStart: "11:00", timeEnd: "14:30" },
      { id: 55, dayOfWeek: DayOfWeek.SATURDAY, timeStart: "11:00", timeEnd: "15:00" }
    ],
    bestRatings: BestRatingsFactory.createMock()
  },
  {
    id: 10,
    name: "Doce Encanto Café",
    phone: "(98) 90000-1010",
    address: "Rua do Sol, 65 - Centro",
    active: true,
    imagePerfilLink: "https://placehold.co/200x200",
    imageBannerLink: "https://placehold.co/1200x400",
    workingDays: [
      { id: 56, dayOfWeek: DayOfWeek.MONDAY, timeStart: "08:00", timeEnd: "18:00" },
      { id: 57, dayOfWeek: DayOfWeek.TUESDAY, timeStart: "08:00", timeEnd: "18:00" },
      { id: 58, dayOfWeek: DayOfWeek.WEDNESDAY, timeStart: "08:00", timeEnd: "18:00" },
      { id: 59, dayOfWeek: DayOfWeek.THURSDAY, timeStart: "08:00", timeEnd: "18:00" },
      { id: 60, dayOfWeek: DayOfWeek.FRIDAY, timeStart: "08:00", timeEnd: "18:00" },
      { id: 61, dayOfWeek: DayOfWeek.SATURDAY, timeStart: "08:00", timeEnd: "13:00" }
    ],
    bestRatings: BestRatingsFactory.createMock()
  }
  ];
  private static readonly detailMock: RestaurantResponseDTO = {
    id: 1,
    name: "Molho Sem Água",
    phone: "(98) 99999-1111",
    address: "Rua das Flores, 120 - Centro",
    active: true,
    imagePerfilLink: "https://placehold.co/200x200",
    imageBannerLink: "https://placehold.co/1200x400",
    workingDays: [
      { id: 1, dayOfWeek: DayOfWeek.MONDAY, timeStart: "18:00", timeEnd: "23:00" },
      { id: 2, dayOfWeek: DayOfWeek.TUESDAY, timeStart: "18:00", timeEnd: "23:00" },
      { id: 3, dayOfWeek: DayOfWeek.WEDNESDAY, timeStart: "18:00", timeEnd: "23:00" },
      { id: 4, dayOfWeek: DayOfWeek.THURSDAY, timeStart: "18:00", timeEnd: "23:00" },
      { id: 5, dayOfWeek: DayOfWeek.FRIDAY, timeStart: "18:00", timeEnd: "00:00" },
      { id: 6, dayOfWeek: DayOfWeek.SATURDAY, timeStart: "18:00", timeEnd: "00:00" }
    ],
    bestRatings: BestRatingsFactory.createMock()
  };
  private static readonly workingSchedulesMock = {
    id: 1,
    name: "Molho Sem Água",
    phone: "(98) 99999-1111",
    address: "Rua das Flores, 120 - Centro",
    active: true,
    imagePerfilLink: "https://placehold.co/200x200",
    imageBannerLink: "https://placehold.co/1200x400",
    workingDays: [
      { id: 1, dayOfWeek: DayOfWeek.MONDAY, timeStart: "08:00", timeEnd: "09:00" },
      { id: 2, dayOfWeek: DayOfWeek.MONDAY, timeStart: "10:30", timeEnd: "12:00" },
      { id: 3, dayOfWeek: DayOfWeek.MONDAY, timeStart: "14:00", timeEnd: "15:30" },
      { id: 4, dayOfWeek: DayOfWeek.MONDAY, timeStart: "16:30", timeEnd: "17:30" },
      { id: 5, dayOfWeek: DayOfWeek.MONDAY, timeStart: "06:00", timeEnd: "07:00" },
      { id: 6, dayOfWeek: DayOfWeek.MONDAY, timeStart: "07:00", timeEnd: "08:00" },
      { id: 7, dayOfWeek: DayOfWeek.MONDAY, timeStart: "09:00", timeEnd: "09:30" },
      { id: 8, dayOfWeek: DayOfWeek.MONDAY, timeStart: "09:30", timeEnd: "10:00" },
      { id: 9, dayOfWeek: DayOfWeek.MONDAY, timeStart: "12:00", timeEnd: "12:30" },
      { id: 10, dayOfWeek: DayOfWeek.MONDAY, timeStart: "12:30", timeEnd: "13:00" },
      { id: 11, dayOfWeek: DayOfWeek.MONDAY, timeStart: "13:00", timeEnd: "13:30" },
      { id: 12, dayOfWeek: DayOfWeek.MONDAY, timeStart: "13:30", timeEnd: "14:00" },
      { id: 13, dayOfWeek: DayOfWeek.MONDAY, timeStart: "15:30", timeEnd: "16:00" },
      { id: 14, dayOfWeek: DayOfWeek.MONDAY, timeStart: "16:00", timeEnd: "16:30" },
      { id: 15, dayOfWeek: DayOfWeek.MONDAY, timeStart: "17:30", timeEnd: "18:00" },
      { id: 16, dayOfWeek: DayOfWeek.MONDAY, timeStart: "18:00", timeEnd: "18:30" },
      { id: 17, dayOfWeek: DayOfWeek.MONDAY, timeStart: "18:30", timeEnd: "19:00" },
      { id: 18, dayOfWeek: DayOfWeek.MONDAY, timeStart: "19:00", timeEnd: "19:30" },
      { id: 19, dayOfWeek: DayOfWeek.MONDAY, timeStart: "19:30", timeEnd: "20:00" },
      { id: 20, dayOfWeek: DayOfWeek.MONDAY, timeStart: "20:00", timeEnd: "20:30" },
      { id: 21, dayOfWeek: DayOfWeek.MONDAY, timeStart: "20:30", timeEnd: "21:00" },
      { id: 22, dayOfWeek: DayOfWeek.MONDAY, timeStart: "21:00", timeEnd: "21:30" },
      { id: 23, dayOfWeek: DayOfWeek.MONDAY, timeStart: "21:30", timeEnd: "22:00" },
      { id: 24, dayOfWeek: DayOfWeek.MONDAY, timeStart: "22:00", timeEnd: "22:30" },

      { id: 5, dayOfWeek: DayOfWeek.TUESDAY, timeStart: "08:00", timeEnd: "09:30" },
      { id: 6, dayOfWeek: DayOfWeek.TUESDAY, timeStart: "11:00", timeEnd: "12:00" },
      { id: 7, dayOfWeek: DayOfWeek.TUESDAY, timeStart: "14:30", timeEnd: "16:00" },
      { id: 8, dayOfWeek: DayOfWeek.TUESDAY, timeStart: "18:00", timeEnd: "19:00" },

      { id: 9, dayOfWeek: DayOfWeek.WEDNESDAY, timeStart: "08:00", timeEnd: "09:00" },
      { id: 10, dayOfWeek: DayOfWeek.WEDNESDAY, timeStart: "10:00", timeEnd: "11:30" },
      { id: 11, dayOfWeek: DayOfWeek.WEDNESDAY, timeStart: "13:00", timeEnd: "14:00" },
      { id: 12, dayOfWeek: DayOfWeek.WEDNESDAY, timeStart: "16:30", timeEnd: "18:00" },

      { id: 13, dayOfWeek: DayOfWeek.THURSDAY, timeStart: "09:00", timeEnd: "10:00" },
      { id: 14, dayOfWeek: DayOfWeek.THURSDAY, timeStart: "11:30", timeEnd: "12:30" },
      { id: 15, dayOfWeek: DayOfWeek.THURSDAY, timeStart: "14:00", timeEnd: "15:30" },
      { id: 16, dayOfWeek: DayOfWeek.THURSDAY, timeStart: "17:00", timeEnd: "18:30" },

      { id: 17, dayOfWeek: DayOfWeek.FRIDAY, timeStart: "08:00", timeEnd: "09:00" },
      { id: 18, dayOfWeek: DayOfWeek.FRIDAY, timeStart: "10:30", timeEnd: "12:00" },
      { id: 19, dayOfWeek: DayOfWeek.FRIDAY, timeStart: "14:00", timeEnd: "15:00" },
      { id: 20, dayOfWeek: DayOfWeek.FRIDAY, timeStart: "16:30", timeEnd: "18:00" },

      { id: 21, dayOfWeek: DayOfWeek.SATURDAY, timeStart: "08:00", timeEnd: "09:30" },
      { id: 22, dayOfWeek: DayOfWeek.SATURDAY, timeStart: "10:00", timeEnd: "11:00" },
      { id: 23, dayOfWeek: DayOfWeek.SATURDAY, timeStart: "13:00", timeEnd: "14:30" },
      { id: 24, dayOfWeek: DayOfWeek.SATURDAY, timeStart: "15:30", timeEnd: "17:00" }
    ]
  };
  private static readonly recentMocks: RestaurantResponseDTO[] = [
    {
      id: 1,
      name: 'Pizzaria Bella Napoli',
      phone: '(99) 99123-4567',
      address: 'Av. Castelo Branco, 120, Centro',
      active: true,
      imagePerfilLink: 'https://placehold.co/200x200?text=Bella+Napoli',
      imageBannerLink: 'https://placehold.co/800x400?text=Bella+Napoli',
      workingDays: [
        { id: 1, dayOfWeek: DayOfWeek.MONDAY, timeStart: '18:00', timeEnd: '23:00' },
        { id: 2, dayOfWeek: DayOfWeek.TUESDAY, timeStart: '18:00', timeEnd: '23:00' },
        { id: 3, dayOfWeek: DayOfWeek.WEDNESDAY, timeStart: '17:00', timeEnd: '18:00' },
        { id: 4, dayOfWeek: DayOfWeek.THURSDAY, timeStart: '18:00', timeEnd: '23:00' },
        { id: 5, dayOfWeek: DayOfWeek.FRIDAY, timeStart: '18:00', timeEnd: '00:00' },
        { id: 6, dayOfWeek: DayOfWeek.SATURDAY, timeStart: '18:00', timeEnd: '00:00' }
      ],
      bestRatings: BestRatingsFactory.createMock()
    },
    {
      id: 2,
      name: 'Sushi House',
      phone: '(99) 99234-5678',
      address: 'Rua das Flores, 45, Centro',
      active: true,
      imagePerfilLink: 'https://placehold.co/200x200?text=Sushi+House',
      imageBannerLink: 'https://placehold.co/800x400?text=Sushi+House',
      workingDays: [
        { id: 7, dayOfWeek: DayOfWeek.TUESDAY, timeStart: '11:00', timeEnd: '14:30' },
        { id: 8, dayOfWeek: DayOfWeek.WEDNESDAY, timeStart: '11:00', timeEnd: '14:30' },
        { id: 9, dayOfWeek: DayOfWeek.THURSDAY, timeStart: '11:00', timeEnd: '14:30' },
        { id: 10, dayOfWeek: DayOfWeek.FRIDAY, timeStart: '18:00', timeEnd: '23:00' },
        { id: 11, dayOfWeek: DayOfWeek.SATURDAY, timeStart: '18:00', timeEnd: '23:00' },
        { id: 12, dayOfWeek: DayOfWeek.SUNDAY, timeStart: '18:00', timeEnd: '22:00' }
      ],
      bestRatings: BestRatingsFactory.createMock()
    },
    {
      id: 3,
      name: 'Churrascaria Fogo Nobre',
      phone: '(99) 99345-6789',
      address: 'Av. Principal, 500, Nova Cidade',
      active: true,
      imagePerfilLink: 'https://placehold.co/200x200?text=Fogo+Nobre',
      imageBannerLink: 'https://placehold.co/800x400?text=Fogo+Nobre',
      workingDays: [
        { id: 13, dayOfWeek: DayOfWeek.MONDAY, timeStart: '11:00', timeEnd: '15:00' },
        { id: 14, dayOfWeek: DayOfWeek.TUESDAY, timeStart: '11:00', timeEnd: '15:00' },
        { id: 15, dayOfWeek: DayOfWeek.WEDNESDAY, timeStart: '11:00', timeEnd: '15:00' },
        { id: 16, dayOfWeek: DayOfWeek.THURSDAY, timeStart: '11:00', timeEnd: '15:00' },
        { id: 17, dayOfWeek: DayOfWeek.FRIDAY, timeStart: '11:00', timeEnd: '15:00' },
        { id: 18, dayOfWeek: DayOfWeek.SATURDAY, timeStart: '11:00', timeEnd: '16:00' },
        { id: 19, dayOfWeek: DayOfWeek.SUNDAY, timeStart: '11:00', timeEnd: '16:00' }
      ],
      bestRatings: BestRatingsFactory.createMock()
    }
  ];

  static createMocks(count = this.searchMocks.length): RestaurantResponseDTO[] {
    return this.repeat(this.searchMocks, count);
  }

  static createMock(): RestaurantResponseDTO {
    return this.copy(this.detailMock);
  }

  static createWorkingSchedulesMock() {
    return this.copy(this.workingSchedulesMock);
  }

  static createRecentMocks(count = this.recentMocks.length): RestaurantResponseDTO[] {
    return this.repeat(this.recentMocks, count);
  }

  private static copy<T>(mock: T): T {
    return structuredClone(mock);
  }

  private static repeat<T>(mocks: readonly T[], count: number): T[] {
    return Array.from({ length: count }, (_, index) => this.copy(mocks[index % mocks.length]));
  }
}
