import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { RestaurantFactory } from '../../../../factory/restaurant.factory';
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

  restaurantsSearchedMock: RestaurantResponseDTO[] = RestaurantFactory.createMocks();

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
