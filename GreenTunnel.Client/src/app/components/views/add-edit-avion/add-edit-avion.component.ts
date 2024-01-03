import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { AccountService } from '../../../services/account.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Avion } from '../../../models/avion.model';
import { AvionService } from '../../../services/avionServices/avion.service';
import { Permission } from '../../../models/permission.model';
import { Pilote } from 'src/app/models/pilote.model';
import { Utilities } from 'src/app/services/utilities';

@Component({
  selector: 'app-add-edit-avion',
  templateUrl: './add-edit-avion.component.html',
  styleUrls: ['./add-edit-avion.component.scss']
})



export class AddEditAvionComponent implements OnInit  {

    loadingIndicator: boolean;
    allAvion: Avion[] = [];
    totalRows = 0;
    pageSize = 5;
    currentPage = 0;
    defaultPageSize = 10;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    displayedColumns: string[] = [
        'nomAvion',
        'capacite',
        'Localisation',
        'actions'
    ];

    dataSource = new MatTableDataSource<Avion>([]);
    editingFactoryName: null;
    sourceUser: null;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    searchValue: string = "";
    constructor(
        public dialog: MatDialog,
        private alertService: AlertService,
        private accountService: AccountService,
        private avionService: AvionService,
        private router: Router,
        private modalService: NgbModal,
    ) { }

    ngOnInit(): void {
        this.loadData();
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        if (this.canViewRoles) {
            this.avionService.getAvion(this.currentPage + 1, this.pageSize, this.searchValue, 'name', 'desc').subscribe({
                next: (results) => this.onDataLoadSuccessful(results),
                error: (error) => this.onDataLoadFailed(error),
            });
        } else {
            this.avionService.getAvion(this.currentPage, this.pageSize).subscribe({
                next: (users) => this.onDataLoadSuccessful(users),
                error: (error) => this.onDataLoadFailed(error),
            });
        }
    }

    pageChanged(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.currentPage = event.pageIndex;
        this.loadData();
    }

    onDataLoadSuccessful(avions: any) {
        debugger
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.dataSource.data = avions.items;
        this.totalRows = avions.totalCount;
    }

    onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.alertService.showStickyMessage(
            'Load Error',
            `Unable to retrieve users from the server.\r\nErrors: "${error}"`,
            MessageSeverity.error,
            error
        );
    }

    onSearchChanged(value: string) {
        this.searchValue = value;
        this.currentPage = 0;
        this.loadData();
    }
   

    deleteUserHelper(row: Avion) {
        this.alertService.startLoadingMessage('Deleting...');
        this.loadingIndicator = true;

        this.avionService.deleteAvion(row).subscribe({
            next: (_) => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.loadData();
                this.dataSource.data = this.dataSource.data.filter((item) => item !== row);
            },
            error: (error) => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.alertService.showStickyMessage(
                    'Delete Error',
                    `An error occurred whilst deleting the Pilote.\r\nError: "${Utilities.getHttpResponseMessages(
                        error
                    )}"`,
                    MessageSeverity.error,
                    error
                );
            },
        });
    }
    get canAssignRoles() {
        return this.accountService.userHasPermission(Permission.assignRolesPermission);
    }

    get canViewRoles() {
        return this.accountService.userHasPermission(Permission.viewRolesPermission);
    }

    get canManageUsers() {
        return this.accountService.userHasPermission(Permission.manageUsersPermission);
    }

}
