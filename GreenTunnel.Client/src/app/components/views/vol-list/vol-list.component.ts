import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Vol } from '../../../models/vol.model';
import { MatDialog } from '@angular/material/dialog';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { AccountService } from '../../../services/account.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Permission } from '../../../models/permission.model';
import { VolService } from '../../../services/vol.service';
import { isNullOrUndefined } from '@swimlane/ngx-datatable';

@Component({
    selector: 'app-vol-list',
    templateUrl: './vol-list.component.html',
    styleUrls: ['./vol-list.component.scss']
})
export class VolListComponent {
    @Input() volId: number = 0;
    loadingIndicator: boolean;
    columns: any[] = [];
    rows: Vol[] = [];
    rowsCache: Vol[] = [];
    allVols: Vol[] = [];
    ongoing = true;
    pending = true;
    completed = true;
    totalRows = 0;
    pageSize = 5;
    currentPage = 0;
    defaultPageSize = 10; // You can set your desired default page size here
    pageSizeOptions: number[] = [5, 10, 25, 100];
    editorModalTemplate: TemplateRef<any>;

    displayedColumns: string[] = [

        'numVol',
        'numPilote',
        'numAvion',
        'villeDep',
        'villeArr',
        'heureDep',
        'heureArr'
    ];
    dataSource = new MatTableDataSource<Vol>([]);
    editingvolName: null;
    sourceUser: null;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    searchValue: string = "";
    isSubView: boolean;
    get canAssignRoles() {
        return this.accountService.userHasPermission(
            Permission.assignRolesPermission
        );
    }
    get canViewRoles() {
        return this.accountService.userHasPermission(
            Permission.viewRolesPermission
        );
    }

    get canManageUsers() {
        return this.accountService.userHasPermission(
            Permission.manageUsersPermission
        );
    }

    constructor(public dialog: MatDialog,
        private alertService: AlertService,
        private accountService: AccountService,
        private workspaceService: VolService,
        private modalService: NgbModal,
        private router: Router) { }

    ngOnInit(): void {
        if (this.volId > 0) {
            this.isSubView = true;
        }
        this.loadData();

    }

    loadData() {

        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;


        if (this.canViewRoles) {
            this.workspaceService.getVols(this.volId, this.currentPage + 1, this.pageSize, this.searchValue, 'name', 'desc').subscribe({
                next: (results) => this.onDataLoadSuccessful(results),
                error: (error) => this.onDataLoadFailed(error),
            });
        } else {
            this.workspaceService.getVols(this.currentPage, this.pageSize).subscribe({
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


    onDataLoadSuccessful(vol: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.dataSource.data = vol.items;
        this.totalRows = vol.totalCount;

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

    
    //newVOls() {
       // this.sourceUser = null;
       // if (!isNullOrUndefined(this.volId)) {

          //  this.router.navigate(['/add-edit-vol', this.volId]);
        //} else {
           // this.router.navigate(['/add-edit-vol']);

        //}
   // }
    
    newVol() {
        this.editingvolName = null;
        this.sourceUser = null;
        this.router.navigate(['/add-edit-vol']);
    }


    // Rest of the component methods
    onSearchChanged(value: string) {
        this.searchValue = value;
        this.currentPage = 0;
        this.loadData();
    }


}
