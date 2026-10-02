import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TableResponseDTO } from '../../../../../types/table/table-response';
import { UtilityService } from '../../../../../service/utility-service/utility-service';
import { RestaurantService } from '../../../../../service/restaurant-service/restaurant-service';
import { TableService } from '../../../../../service/table-service/table-service';
import { FormControl, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { CreateTableRequestDTO } from '../../../../../types/table/create-table-request';

@Component({
  selector: 'app-owner-show-tables',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './owner-show-tables.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerShowTables {
  private readonly utilityService = inject(UtilityService);
  private restaurantService = inject(RestaurantService);
  private tableService = inject(TableService);

  readonly tablesMock: TableResponseDTO[] = [
    { id: 1, number: 1, capacity: 2, active: true },
    { id: 2, number: 2, capacity: 4, active: true },
    { id: 3, number: 3, capacity: 6, active: true },
    { id: 4, number: 4, capacity: 4, active: true },
    { id: 5, number: 5, capacity: 8, active: true },
  ];

  readonly tables = signal(<TableResponseDTO[]>[]);

  readonly searchTerm = signal('');
  readonly inactiveTableIds = signal<number[]>([]);
  readonly selectedTable = signal<TableResponseDTO | null>(null);
  readonly isDeactivateConfirmationOpen = signal(false);
  readonly isCreateFormOpen = signal(false);
  readonly newTableNumber = signal('');
  readonly newTableCapacity = signal('');
  readonly createTableError = signal('');

  readonly filteredTables = computed(() => {
    const search = this.searchTerm().trim();
    return this.tables().filter((table) => !search || String(table.number).includes(search));
  });

  createTableForm = new FormGroup({
    number: new FormControl(0, [Validators.required]),
    capacity: new FormControl(1, [Validators.required, Validators.min(1)]),
  })

  readonly totalCapacity = computed(() =>
    this.tables().reduce((capacity, table) => capacity + table.capacity, 0),
  );

  readonly activeTablesCount = computed(() => this.tables().length - this.inactiveTableIds().length);

  setSearchTerm(value: string) {
    this.searchTerm.set(value.replace(/\D/g, ''));
  }

  openTableDetails(table: TableResponseDTO) {
    this.selectedTable.set(table);
    this.isDeactivateConfirmationOpen.set(false);
  }

  closeTableDetails() {
    this.selectedTable.set(null);
    this.isDeactivateConfirmationOpen.set(false);
  }

  isTableActive(tableId: number): boolean {
    return !this.inactiveTableIds().includes(tableId);
  }

  requestTableDeactivation() {
    if (this.selectedTable() && this.isTableActive(this.selectedTable()!.id)) {
      this.isDeactivateConfirmationOpen.set(true);
    }
  }

  cancelTableDeactivation() {
    this.isDeactivateConfirmationOpen.set(false);
  }

  confirmTableDeactivation() {
    const table = this.selectedTable();
    if (!table) return;

    this.tableService.deleteTableById(table.id).subscribe({
      next: (value) => {
        this.loadTables()
      },
      error:(err) => {
        console.log(err);
      }
    });
    this.isDeactivateConfirmationOpen.set(false);
  }

  activateSelectedTable() {
    const table = this.selectedTable();
    if (!table) return;

    this.inactiveTableIds.update((inactiveIds) => inactiveIds.filter((id) => id !== table.id));
  }

  openCreateForm() {
    this.createTableError.set('');
    this.isCreateFormOpen.set(true);
  }

  verifyIfExistsTableWithNumber(){
    const newTableNumber = this.createTableForm.get('number')?.value as number;
    const existsTableWithNumber = this.tables().some(table => table.number===newTableNumber);
    if (existsTableWithNumber) {
      this.createTableError.set('Já existe uma messa com esse número');
    }
  }

  closeCreateForm() {
    this.isCreateFormOpen.set(false);
    this.newTableNumber.set('');
    this.newTableCapacity.set('');
    this.createTableError.set('');
  }

  

  loadTables(){
    this.restaurantService.getTablesOfRestaurant().subscribe({
      next:(dado) =>{
        this.tables.set(dado);
      },
      error:(err) => {
        console.log(err);
      }
    })
  }

  ngOnInit() {
    this.utilityService.updateCurrentPageOfOwnerMenu(2);
    this.loadTables();
  }
  createTableRequest():CreateTableRequestDTO {
    
    return {
      number: this.createTableForm.get('number')?.value as number,
      capacity: this.createTableForm.get('capacity')?.value as number,
    }
  }
  ngCreateTable(){
    if (this.createTableForm.get('number')?.invalid && this.createTableForm.get('capacity')?.invalid){
      this.createTableError.set('Dados inválidos')
      return
    }
    this.tableService.createTable(this.createTableRequest()).subscribe({
      next:() =>{
        this.closeCreateForm()
        this.loadTables();
      },
      error:(err) => {
        console.log(err);
      }
    })
  }

}
