import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Permission } from 'src/app/models/permission.model';
import { AccountService } from 'src/app/services/account.service';
import { AlertService, DialogType, MessageSeverity } from 'src/app/services/alert.service';
import { PiloteService } from 'src/app/services/piloteServices/pilote.service';
import { Utilities } from 'src/app/services/utilities';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Pilote } from 'src/app/models/pilote.model';


@Component({
    selector: 'app-pilote-list',
    templateUrl: './pilote-list.component.html',
    styleUrls: ['./pilote-list.component.scss']
})
export class PiloteListComponent implements OnInit {
    loadingIndicator: boolean;
    allPilotes: Pilote[] = [];
    totalRows = 0;
    pageSize = 5;
    currentPage = 0;
    defaultPageSize = 10;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    displayedColumns: string[] = [
        'nomPilote',
        'adresse',
         'actions'
    ];
    dataSource = new MatTableDataSource<Pilote>([]);
    editingFactoryName: null;
    sourceUser: null;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    searchValue: string = "";
    constructor(
        public dialog: MatDialog,
        private alertService: AlertService,
        private accountService: AccountService,
        private piloteService: PiloteService,
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
            this.piloteService.getPilotes(this.currentPage + 1, this.pageSize, this.searchValue, 'name', 'desc').subscribe({
                next: (results) => this.onDataLoadSuccessful(results),
                error: (error) => this.onDataLoadFailed(error),
            });
        } else {
            this.piloteService.getPilotes(this.currentPage, this.pageSize).subscribe({
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

    onDataLoadSuccessful(pilotes: any) {
        debugger
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.dataSource.data = pilotes.items;
        this.totalRows = pilotes.totalCount;
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

    

    newVol() {
       this.editingFactoryName = null;
        this.sourceUser = null;
       this.router.navigate(['/add-edit-test']);
    }

    // editTest(id: number) {
    //     this.router.navigate(['/add-edit-test'], { queryParams: { id: id } });
    // }



    onSearchChanged(value: string) {
        this.searchValue = value;
        this.currentPage = 0;
        this.loadData();
    }
   


    deleteUserHelper(row: Pilote) {
        this.alertService.startLoadingMessage('Deleting...');
        this.loadingIndicator = true;

        this.piloteService.deletePilote(row).subscribe({
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
