import { ReserveStatus } from '../types/enums/reserve-status';
import { ReserveResponseDTO } from '../types/reserve/reserve-response';

export class ReserveFactory {
  private static readonly ownerMocks: ReserveResponseDTO[] = [
    {
        id: 1,
        clientName: "Carice freire",
        restaurantName: "Restaurante molho sem água",
        tableNumber: 1,
        date: "2026-09-04",
        dayOfWeek: "FRIDAY",
        timeStart: "14:00:00",
        timeEnd: "15:00:00",
        status: ReserveStatus.CANCELED,
        observation: "Meu filho autista irá me acompanhar",
        peoples: 2
    },
    {
        id: 2,
        clientName: "Carice freire",
        restaurantName: "Restaurante molho sem água",
        tableNumber: 1,
        date: "2026-10-02",
        dayOfWeek: "FRIDAY",
        timeStart: "14:00:00",
        timeEnd: "15:00:00",
        status: ReserveStatus.SCHEDULED,
        observation: "Meu filho autista irá me acompanhar",
        peoples: 2
    },
    {
        id: 3,
        clientName: "italo",
        restaurantName: "Restaurante molho sem água",
        tableNumber: 1,
        date: "2026-10-09",
        dayOfWeek: "FRIDAY",
        timeStart: "14:00:00",
        timeEnd: "15:00:00",
        status: ReserveStatus.SCHEDULED,
        observation: "Meu filho autista irá me acompanhar",
        peoples: 2
    },
    {
        id: 4,
        clientName: "italo",
        restaurantName: "Restaurante molho sem água",
        tableNumber: 1,
        date: "2026-10-16",
        dayOfWeek: "FRIDAY",
        timeStart: "14:00:00",
        timeEnd: "15:00:00",
        status: ReserveStatus.SCHEDULED,
        observation: "Meu filho autista irá me acompanhar",
        peoples: 2
    },
    {
        id: 5,
        clientName: "italo",
        restaurantName: "Restaurante molho sem água",
        tableNumber: 1,
        date: "2026-10-23",
        dayOfWeek: "FRIDAY",
        timeStart: "14:00:00",
        timeEnd: "15:00:00",
        status: ReserveStatus.SCHEDULED,
        observation: "Meu filho autista irá me acompanhar",
        peoples: 2
    },
    {
        id: 6,
        clientName: "italo",
        restaurantName: "Restaurante molho sem água",
        tableNumber: 1,
        date: "2026-10-30",
        dayOfWeek: "FRIDAY",
        timeStart: "14:00:00",
        timeEnd: "15:00:00",
        status: ReserveStatus.SCHEDULED,
        observation: "Meu filho autista irá me acompanhar",
        peoples: 2
    },
    {
        id: 7,
        clientName: "italo",
        restaurantName: "Restaurante molho sem água",
        tableNumber: 1,
        date: "2026-11-06",
        dayOfWeek: "FRIDAY",
        timeStart: "14:00:00",
        timeEnd: "15:00:00",
        status: ReserveStatus.SCHEDULED,
        observation: "Meu filho autista irá me acompanhar",
        peoples: 2
    },
    {
        id: 8,
        clientName: "italo",
        restaurantName: "Restaurante molho sem água",
        tableNumber: 1,
        date: "2026-11-13",
        dayOfWeek: "FRIDAY",
        timeStart: "14:00:00",
        timeEnd: "15:00:00",
        status: ReserveStatus.SCHEDULED,
        observation: "Meu filho autista irá me acompanhar",
        peoples: 2
    },
    {
        id: 9,
        clientName: "italo",
        restaurantName: "Restaurante molho sem água",
        tableNumber: 1,
        date: "2026-11-20",
        dayOfWeek: "FRIDAY",
        timeStart: "14:00:00",
        timeEnd: "15:00:00",
        status: ReserveStatus.SCHEDULED,
        observation: "Meu filho autista irá me acompanhar",
        peoples: 2
    },
    {
        id: 9,
        clientName: "italo",
        restaurantName: "Restaurante molho sem água",
        tableNumber: 1,
        date: "2026-11-20",
        dayOfWeek: "FRIDAY",
        timeStart: "14:00:00",
        timeEnd: "15:00:00",
        status: ReserveStatus.SCHEDULED,
        observation: "Meu filho autista irá me acompanhar",
        peoples: 2
    }
  ];
  private static readonly detailMock: ReserveResponseDTO = {
        id: 1,
        clientName: "Carice freire",
        restaurantName: "Restaurante molho sem água",
        tableNumber: 1,
        date: "2026-09-04",
        dayOfWeek: "FRIDAY",
        timeStart: "14:00:00",
        timeEnd: "15:00:00",
        status: ReserveStatus.SCHEDULED,
        observation: "Meu filho autista irá me acompanhar",
        peoples: 2
  };
  private static readonly dashboardTodayMocks: ReserveResponseDTO[] = [
    {
      id: 101,
      clientName: 'João Silva',
      restaurantName: 'Pizzaria Bella Napoli',
      tableNumber: 4,
      date: '2026-10-20',
      dayOfWeek: 'TUESDAY',
      timeStart: '19:00',
      timeEnd: '20:00',
      status: ReserveStatus.CONFIRMED,
      observation: 'Mesa próxima à janela',
      peoples: 4
    },
    {
      id: 102,
      clientName: 'Maria Oliveira',
      restaurantName: 'Sushi House',
      tableNumber: 2,
      date: '2026-10-20',
      dayOfWeek: 'TUESDAY',
      timeStart: '19:30',
      timeEnd: '20:30',
      status: ReserveStatus.SCHEDULED,
      observation: 'Comemoração de aniversário',
      peoples: 2
    },
    {
      id: 103,
      clientName: 'Pedro Santos',
      restaurantName: 'Churrascaria Fogo Nobre',
      tableNumber: 8,
      date: '2026-10-20',
      dayOfWeek: 'TUESDAY',
      timeStart: '20:00',
      timeEnd: '21:00',
      status: ReserveStatus.COMPLETED,
      observation: '',
      peoples: 6
    },
    {
      id: 104,
      clientName: 'Ana Costa',
      restaurantName: 'Pizzaria Bella Napoli',
      tableNumber: 3,
      date: '2026-10-20',
      dayOfWeek: 'TUESDAY',
      timeStart: '20:30',
      timeEnd: '21:30',
      status: ReserveStatus.CANCELED,
      observation: 'Cliente cancelou a reserva',
      peoples: 2
    },
    {
      id: 105,
      clientName: 'Lucas Ferreira',
      restaurantName: 'Sushi House',
      tableNumber: 5,
      date: '2026-10-20',
      dayOfWeek: 'TUESDAY',
      timeStart: '21:00',
      timeEnd: '22:00',
      status: ReserveStatus.NO_SHOW,
      observation: 'Cliente não compareceu',
      peoples: 3
    }
  ];
  private static readonly dashboardNextMocks: ReserveResponseDTO[] = [
      {
        id: 1,
        clientName: 'João Silva',
        restaurantName: 'Minha Mesa',
        tableNumber: 1,
        date: '2026-09-24',
        dayOfWeek: 'THURSDAY',
        timeStart: '18:00',
        timeEnd: '19:30',
        status: ReserveStatus.CONFIRMED,
        observation: 'Mesa próxima à janela',
        peoples: 4
      },
      {
        id: 2,
        clientName: 'Maria Santos',
        restaurantName: 'Minha Mesa',
        tableNumber: 1,
        date: '2026-09-24',
        dayOfWeek: 'THURSDAY',
        timeStart: '20:00',
        timeEnd: '21:30',
        status: ReserveStatus.SCHEDULED,
        observation: '',
        peoples: 2
      }
    ];

  static createMocks(count = this.ownerMocks.length): ReserveResponseDTO[] {
    return this.repeat(this.ownerMocks, count);
  }

  static createMock(): ReserveResponseDTO {
    return this.copy(this.detailMock);
  }

  static createDashboardTodayMocks(count = this.dashboardTodayMocks.length): ReserveResponseDTO[] {
    return this.repeat(this.dashboardTodayMocks, count);
  }

  static createDashboardNextMocks(count = this.dashboardNextMocks.length): ReserveResponseDTO[] {
    return this.repeat(this.dashboardNextMocks, count);
  }

  private static copy<T>(mock: T): T {
    return structuredClone(mock);
  }

  private static repeat<T>(mocks: readonly T[], count: number): T[] {
    return Array.from({ length: count }, (_, index) => this.copy(mocks[index % mocks.length]));
  }
}
