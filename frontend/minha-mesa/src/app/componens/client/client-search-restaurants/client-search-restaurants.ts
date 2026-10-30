import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UtilityService } from '../../../service/utility-service/utility-service';
import { RestaurantResponseDTO } from '../../../types/restaurant/restaurant-response';
import { UserService } from '../../../service/user-service/user-service';
import { ExceptionService } from '../../../service/exception-service/exception-service';
import { HttpErrorResponse } from '@angular/common/http';
import { ExceptionResponse } from '../../../types/exception/excpetion-response';
import { MessageError } from '../../message-error/message-error';
import { ClientRecentRestaurants } from '../client-home/client-recent-restaurants/client-recent-restaurants';
import { RestaurantService } from '../../../service/restaurant-service/restaurant-service';
import { ClientCardRestaurant } from '../client-card-restaurant/client-card-restaurant';
import { DayOfWeek } from '../../../types/enums/day-of-week';

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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
