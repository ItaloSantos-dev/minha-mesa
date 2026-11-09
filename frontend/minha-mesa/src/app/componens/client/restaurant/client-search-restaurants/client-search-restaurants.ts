import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UtilityService } from '../../../../service/utility-service/utility-service';
import { RestaurantResponseDTO } from '../../../../types/restaurant/restaurant-response';
import { UserService } from '../../../../service/user-service/user-service';
import { ExceptionService } from '../../../../service/exception-service/exception-service';
import { HttpErrorResponse } from '@angular/common/http';
import { ExceptionResponse } from '../../../../types/exception/excpetion-response';
import { MessageError } from '../../../message-error/message-error';
import { ClientRecentRestaurants } from '../../client-home/client-recent-restaurants/client-recent-restaurants';
import { RestaurantService } from '../../../../service/restaurant-service/restaurant-service';
import { ClientCardRestaurant } from '../../client-card-restaurant/client-card-restaurant';
import { DayOfWeek } from '../../../../types/enums/day-of-week';

@Component({
  selector: 'app-client-search-restaurants',
  imports: [MessageError, ClientRecentRestaurants, ClientCardRestaurant],
  templateUrl: './client-search-restaurants.html',
  styleUrl: './client-search-restaurants.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientSearchRestaurants {
  private readonly utilityService = inject(UtilityService);
  private readonly userService = inject(UserService);
  private readonly exceptionService = inject(ExceptionService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private restaurantService = inject(RestaurantService);
  recentRestaurants = signal<RestaurantResponseDTO[]>([]);
  readonly searchTerm = signal('');
  readonly searchQuery = signal('');
  readonly hasSearchQuery = computed(() => this.searchQuery().length > 0);
  restaurantsSearched = signal(<RestaurantResponseDTO[]>[])

  restaurantsSearchedMock: RestaurantResponseDTO[] = [
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
    bestRatings: {
      bestDishes: [
        {
          id: 1, name: "Hambúrguer da Casa", dishCategoryName: "Hambúrgueres", dishCategoryId: 1,
          restaurantName: "Molho Sem Água", restaurantId: 1, description: "Hambúrguer artesanal com molho especial.",
          preparationTime: 1200, rating: 4.9, price: 32.90, slug: "hamburguer-da-casa",
          imageLink: "https://placehold.co/400x300", active: true
        },
        {
          id: 2, name: "Batata Suprema", dishCategoryName: "Acompanhamentos", dishCategoryId: 2,
          restaurantName: "Molho Sem Água", restaurantId: 1, description: "Batatas crocantes com cheddar e bacon.",
          preparationTime: 900, rating: 4.8, price: 24.90, slug: "batata-suprema",
          imageLink: "https://placehold.co/400x300", active: true
        }
      ],
      bestRatesDish: [
        {
          id: 1, clientName:'Autor',dishId: 1, dishName: "Hambúrguer da Casa", reserveId: 10,
          restaurantName: "Molho Sem Água", rating: 5, comment: "Simplesmente perfeito!"
        },
        {
          id: 2, clientName:'Autor',dishId: 2, dishName: "Batata Suprema", reserveId: 11,
          restaurantName: "Molho Sem Água", rating: 5, comment: "Muito saborosa!"
        }
      ]
    }
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
    bestRatings: {
      bestDishes: [
        {
          id: 3, name: "Double Bacon", dishCategoryName: "Hambúrgueres", dishCategoryId: 3,
          restaurantName: "Burger House", restaurantId: 2, description: "Hambúrguer duplo com bacon crocante.",
          preparationTime: 1500, rating: 4.9, price: 38.90, slug: "double-bacon",
          imageLink: "https://placehold.co/400x300", active: true
        },
        {
          id: 4, name: "Milkshake de Chocolate", dishCategoryName: "Bebidas", dishCategoryId: 4,
          restaurantName: "Burger House", restaurantId: 2, description: "Milkshake cremoso de chocolate.",
          preparationTime: 300, rating: 4.7, price: 16.90, slug: "milkshake-chocolate",
          imageLink: "https://placehold.co/400x300", active: true
        }
      ],
      bestRatesDish: [
        {
          id: 3, clientName:'Autor',dishId: 3, dishName: "Double Bacon", reserveId: 12,
          restaurantName: "Burger House", rating: 5, comment: "O melhor hambúrguer que já comi."
        }
      ]
    }
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
    bestRatings: {
      bestDishes: [
        {
          id: 5, name: "Pizza Suprema", dishCategoryName: "Pizzas", dishCategoryId: 5,
          restaurantName: "Pizza Suprema", restaurantId: 3, description: "Pizza especial da casa com ingredientes selecionados.",
          preparationTime: 1800, rating: 4.9, price: 59.90, slug: "pizza-suprema",
          imageLink: "https://placehold.co/400x300", active: true
        }
      ],
      bestRatesDish: [
        {
          id: 4, clientName:'Autor',dishId: 5, dishName: "Pizza Suprema", reserveId: 13,
          restaurantName: "Pizza Suprema", rating: 5, comment: "Massa excelente e muito recheio!"
        }
      ]
    }
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
    bestRatings: {
      bestDishes: [
        {
          id: 6, name: "Carne de Sol com Macaxeira", dishCategoryName: "Pratos regionais", dishCategoryId: 6,
          restaurantName: "Sabor Nordestino", restaurantId: 4, description: "Carne de sol acompanhada de macaxeira.",
          preparationTime: 2100, rating: 4.8, price: 42.90, slug: "carne-de-sol-com-macaxeira",
          imageLink: "https://placehold.co/400x300", active: true
        }
      ],
      bestRatesDish: [
        {
          id: 5, clientName:'Autor',dishId: 6, dishName: "Carne de Sol com Macaxeira", reserveId: 14,
          restaurantName: "Sabor Nordestino", rating: 5, comment: "Comida deliciosa e bem servida."
        }
      ]
    }
  },
  {
    id: 5,
    name: "La Pasta Italiana",
    phone: "(98) 95555-5555",
    address: "Av. Brasil, 510 - Jardim",
    active: true,
    imagePerfilLink: "https://placehold.co/200x200",
    imageBannerLink: "https://placehold.co/1200x400",
    workingDays: [
      { id: 25, dayOfWeek: DayOfWeek.TUESDAY, timeStart: "18:00", timeEnd: "23:00" },
      { id: 26, dayOfWeek: DayOfWeek.WEDNESDAY, timeStart: "18:00", timeEnd: "23:00" },
      { id: 27, dayOfWeek: DayOfWeek.THURSDAY, timeStart: "18:00", timeEnd: "23:00" },
      { id: 28, dayOfWeek: DayOfWeek.FRIDAY, timeStart: "18:00", timeEnd: "23:30" },
      { id: 29, dayOfWeek: DayOfWeek.SATURDAY, timeStart: "18:00", timeEnd: "23:30" }
    ],
    bestRatings: {
      bestDishes: [
        {
          id: 7, name: "Lasanha à Bolonhesa", dishCategoryName: "Massas", dishCategoryId: 7,
          restaurantName: "La Pasta Italiana", restaurantId: 5, description: "Lasanha artesanal com molho à bolonhesa.",
          preparationTime: 2400, rating: 4.9, price: 39.90, slug: "lasanha-a-bolonhesa",
          imageLink: "https://placehold.co/400x300", active: true
        }
      ],
      bestRatesDish: [
        {
          id: 6, clientName:'Autor',dishId: 7, dishName: "Lasanha à Bolonhesa", reserveId: 15,
          restaurantName: "La Pasta Italiana", rating: 5, comment: "Sabor incrível, recomendo!"
        }
      ]
    }
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
    bestRatings: {
      bestDishes: [
        {
          id: 8, name: "Açaí Tradicional", dishCategoryName: "Açaí", dishCategoryId: 8,
          restaurantName: "Tropical Açaí", restaurantId: 6, description: "Açaí cremoso com acompanhamentos à escolha.",
          preparationTime: 600, rating: 4.9, price: 19.90, slug: "acai-tradicional",
          imageLink: "https://placehold.co/400x300", active: true
        }
      ],
      bestRatesDish: [
        {
          id: 7, clientName:'Autor',dishId: 8, dishName: "Açaí Tradicional", reserveId: 16,
          restaurantName: "Tropical Açaí", rating: 5, comment: "Muito cremoso e saboroso!"
        }
      ]
    }
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
    bestRatings: {
      bestDishes: [
        {
          id: 9, name: "Picanha na Brasa", dishCategoryName: "Carnes", dishCategoryId: 9,
          restaurantName: "Churrascaria Boi na Brasa", restaurantId: 7, description: "Picanha grelhada acompanhada de guarnições.",
          preparationTime: 1800, rating: 4.9, price: 69.90, slug: "picanha-na-brasa",
          imageLink: "https://placehold.co/400x300", active: true
        }
      ],
      bestRatesDish: [
        {
          id: 8, clientName:'Autor',dishId: 9, dishName: "Picanha na Brasa", reserveId: 17,
          restaurantName: "Churrascaria Boi na Brasa", rating: 5, comment: "Carne no ponto perfeito!"
        }
      ]
    }
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
    bestRatings: {
      bestDishes: [
        {
          id: 10, name: "Temaki de Salmão", dishCategoryName: "Temakis", dishCategoryId: 10,
          restaurantName: "Temaki Express", restaurantId: 8, description: "Temaki recheado com salmão fresco.",
          preparationTime: 900, rating: 4.8, price: 29.90, slug: "temaki-de-salmao",
          imageLink: "https://placehold.co/400x300", active: true
        }
      ],
      bestRatesDish: [
        {
          id: 9, clientName:'Autor',dishId: 10, dishName: "Temaki de Salmão", reserveId: 18,
          restaurantName: "Temaki Express", rating: 5, comment: "Muito fresco e bem preparado!"
        }
      ]
    }
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
    bestRatings: {
      bestDishes: [
        {
          id: 11, name: "Filé à Parmegiana", dishCategoryName: "Pratos executivos", dishCategoryId: 11,
          restaurantName: "Cantina da Praça", restaurantId: 9, description: "Filé empanado com molho de tomate e queijo.",
          preparationTime: 1800, rating: 4.7, price: 36.90, slug: "file-a-parmegiana",
          imageLink: "https://placehold.co/400x300", active: true
        }
      ],
      bestRatesDish: [
        {
          id: 10, clientName:'Autor',dishId: 11, dishName: "Filé à Parmegiana", reserveId: 19,
          restaurantName: "Cantina da Praça", rating: 5, comment: "Almoço muito bem servido."
        }
      ]
    }
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
    bestRatings: {
      bestDishes: [
        {
          id: 12, name: "Cappuccino Especial", dishCategoryName: "Bebidas quentes", dishCategoryId: 12,
          restaurantName: "Doce Encanto Café", restaurantId: 10, description: "Cappuccino cremoso com chocolate.",
          preparationTime: 300, rating: 4.9, price: 14.90, slug: "cappuccino-especial",
          imageLink: "https://placehold.co/400x300", active: true
        }
      ],
      bestRatesDish: [
        {
          id: 11, clientName:'Autor',dishId: 12, dishName: "Cappuccino Especial", reserveId: 20,
          restaurantName: "Doce Encanto Café", rating: 5, comment: "Perfeito para acompanhar o café da manhã."
        }
      ]
    }
  }
  ];

  ngOnInit(){
    this.utilityService.updateCurrentPageOfOwnerMenu(1);
    this.loadParameters();
    if (!this.hasSearchQuery())
      this.loadRecentRestaurants();
    else{
      this.loadRestaurants();
      this.haveMoreSchedules.set(this.restaurantsSearched().length===10);
    }  
  }

  loadRestaurants(){
    console.log("Buscando restaurantes: " + this.searchQuery() + " " + this.actualPage());
    
    this.restaurantService.getRestaurantsLikeName(this.searchQuery(), this.actualPage()).subscribe({
      next:(dado) =>{
        this.restaurantsSearched.set(dado)
        
      },
      error: (error:HttpErrorResponse) => {
        const showError = this.exceptionService.handlerRedirectExceptionResponse(error, UtilityService.pathsOfApplication.CLIENT_HOME);
        if (showError) {
          this.utilityService.handlerShowMenssageErrorSubject(ExceptionResponse.fromHttpError(error))
        }
      }
    })
  }
  loadRecentRestaurants(){
    this.userService.getDashboardOfUser().subscribe({
      next:(data) =>{
        this.recentRestaurants.set(data.recentRestaurants)
      }, error: (error:HttpErrorResponse) => {
        const showError = this.exceptionService.handlerRedirectExceptionResponse(error, UtilityService.pathsOfApplication.CLIENT_HOME);
        if (showError) {
          this.utilityService.handlerShowMenssageErrorSubject(ExceptionResponse.fromHttpError(error))
        }
      }
    })
  }
  loadParameters(){
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const query = params.get('search')?.trim() ?? '';
      this.searchQuery.set(query);
      this.searchTerm.set(query);
      this.loadRestaurants();
      if (query!==''){
        const page = Number(params.get('page') ?? 0);
        this.actualPage.set(page); 
      }
    });
  }
   
  haveMoreSchedules = signal(false)
  actualPage = signal(0);


  searchRestaurants(event: SubmitEvent) {
    event.preventDefault();
    this.updateSearchQuery(this.searchTerm().trim(), null);
  }

  clearSearch() {
    this.searchTerm.set('');
    this.updateSearchQuery('', null);
  }

  updateSearchQuery(search: string, page:number|null) {
    if (search==='') {
      this.router.navigate(['client', 'restaurants'])
    }
    else{
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { search: search || null, page:page|| 0 },
        queryParamsHandling: 'merge',
      });
    }
  }
}
