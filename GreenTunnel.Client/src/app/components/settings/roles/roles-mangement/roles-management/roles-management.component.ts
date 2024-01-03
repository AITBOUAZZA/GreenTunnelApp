import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountService } from 'src/app/services/account.service';
import {
    AlertService,
    DialogType,
    MessageSeverity,
} from 'src/app/services/alert.service';
import { Role } from 'src/app/models/role.model';
import { Permission } from 'src/app/models/permission.model';
import { Utilities } from 'src/app/services/utilities';
import { RoleEditorComponent } from '../../role-editor/role-editor/role-editor.component';
import { MatTableDataSource } from '@angular/material/table';
import { AppTranslationService } from 'src/app/services/app-translation.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DeleteRoleComponent } from '../../delete-role/delete-role.component';

@Component({
    selector: 'app-roles-management',
    templateUrl: './roles-management.component.html',
    styleUrls: ['./roles-management.component.scss'],
})
export class RolesManagementComponent implements OnInit {
    displayedColumns: string[] = [
        'name',
        'description',
        'usersCount',
        'actions',
    ];
    columns: any[] = [];
    rows: Role[] = [];
    rowsCache: Role[] = [];
    allPermissions: Permission[] = [];
    editedRole: Role;
    sourceRole: Role;
    editingRoleName: any;
    loadingIndicator: boolean;
    totalRows = 0;
    pageSize = 5;
    currentPage = 0;
    pageSizeOptions: number[] = [2, 10, 25, 100];
    searchValue: string = "";

    @ViewChild('editorModal', { static: true })
    editorModalTemplate: TemplateRef<any>;

    roleEditor: RoleEditorComponent;
    @ViewChild('indexTemplate', { static: true })
    indexTemplate: TemplateRef<any>;

    @ViewChild('actionsTemplate', { static: true })
    actionsTemplate: TemplateRef<any>;

    constructor(
        private dialog: MatDialog,
        private alertService: AlertService,
        private translationService: AppTranslationService,
        private accountService: AccountService,
        private modalService: NgbModal
    ) { }

    ngOnInit() {
        const gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            {
                prop: 'index',
                name: '#',
                width: 50,
                cellTemplate: this.indexTemplate,
                canAutoResize: false,
            },
            { prop: 'name', name: gT('roles.management.Name'), width: 180 },
            {
                prop: 'description',
                name: gT('roles.management.Description'),
                width: 320,
            },
            {
                prop: 'usersCount',
                name: gT('roles.management.Users'),
                width: 50,
            },
            {
                name: '',
                width: 160,
                cellTemplate: this.actionsTemplate,
                resizeable: false,
                canAutoResize: false,
                sortable: false,
                draggable: false,
            },
        ];
        this.loadData();
    }

    setRoleEditorComponent(roleEditor: any) {
        this.roleEditor = roleEditor;
        if (!this.sourceRole)
            this.editedRole = this.roleEditor.newRole(this.allPermissions);
        else
            this.editedRole = this.roleEditor.editRole(
                this.sourceRole,
                this.allPermissions
            );
    }

    addNewRoleToList() {
        if (this.sourceRole) {
            Object.assign(this.sourceRole, this.editedRole);

            let sourceIndex = this.rowsCache.indexOf(this.sourceRole, 0);
            if (sourceIndex > -1) {
                Utilities.moveArrayItem(this.rowsCache, sourceIndex, 0);
            }

            sourceIndex = this.rows.indexOf(this.sourceRole, 0);
            if (sourceIndex > -1) {
                Utilities.moveArrayItem(this.rows, sourceIndex, 0);
            }

            this.editedRole = null;
            this.sourceRole = null;
        } else {
            const role = new Role();
            Object.assign(role, this.editedRole);
            this.editedRole = null;

            let maxIndex = 0;
            for (const r of this.rowsCache) {
                if ((r as any).index > maxIndex) {
                    maxIndex = (r as any).index;
                }
            }

            (role as any).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, role);
            this.dataSource.data.splice(0, 0, role);
            this.dataSource.data = [... this.dataSource.data];
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.accountService.getRolesAndPermissions(this.currentPage + 1, this.pageSize, this.searchValue, 'name', 'desc').subscribe({
            next: (results: any) => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                const roles = results[0];
                const permissions = results[1];

                roles.items.forEach((role, index) => {
                    (role as any).index = index + 1;
                });

                //this.rowsCache = [...roles];
                this.dataSource.data = roles.items;
                this.totalRows = roles.totalCount;


                this.allPermissions = permissions;
            },
            error: (error) => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.alertService.showStickyMessage(
                    'Load Error',
                    `Unable to retrieve roles from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(
                        error
                    )}"`,
                    MessageSeverity.error,
                    error
                );
            },
        });
    }

    newRole() {
        this.editingRoleName = null;
        this.sourceRole = null;

        this.openRoleEditor();
    }

    editRole(row: Role) {
        this.editingRoleName = { name: row.name };
        this.sourceRole = row;

        this.openRoleEditor();
    }

    openRoleEditor() {
        const modalRef = this.modalService.open(this.editorModalTemplate, {
          size: 'lg',
          backdrop: 'static'
        });
    
        modalRef.shown.subscribe(() => {
          this.roleEditor.changesSavedCallback = () => {
            this.addNewRoleToList();
            modalRef.close();
          };
    
          this.roleEditor.changesCancelledCallback = () => {
            this.editedRole = null;
            this.sourceRole = null;
            modalRef.close();
          };
        });
    
        modalRef.hidden.subscribe(() => {
          this.editingRoleName = null;
          this.roleEditor.resetForm(true);
          this.roleEditor = null;
        });
      }

    deleteRole(row: Role) {
        const modalRef = this.modalService.open(
            DeleteRoleComponent,
            {
                size: 'lg',
                backdrop: 'static'
            }
        );
        modalRef.componentInstance.row = row;
        modalRef.componentInstance.deleteChanged.subscribe((data) => {
            if (data) {
                this.modalService.dismissAll();
                this.loadData();
            }
        })
    }

    deleteRoleHelper(row: Role) {
        this.alertService.startLoadingMessage('Deleting...');
        this.loadingIndicator = true;

        this.accountService.deleteRole(row).subscribe({
            next: (_) => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.rowsCache = this.rowsCache.filter((item) => item !== row);
                this.rows = this.rows.filter((item) => item !== row);
            },
            error: (error) => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.alertService.showStickyMessage(
                    'Delete Error',
                    `An error occurred whilst deleting the role.\r\nError: "${Utilities.getHttpResponseMessages(
                        error
                    )}"`,
                    MessageSeverity.error,
                    error
                );
            },
        });
    }

    get canManageRoles() {
        return this.accountService.userHasPermission(
            Permission.manageRolesPermission
        );
    }
    onSearchChanged(value: string) {
        this.searchValue = value;
        this.currentPage = 0;
        this.loadData();
    }
    pageChanged(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.currentPage = event.pageIndex;
        this.loadData();
    }
    openAddTaskDialog(
        enterAnimationDuration: string,
        exitAnimationDuration: string
    ): void {
        this.dialog.open(RoleEditorComponent, {
            width: '600px',
            enterAnimationDuration,
            exitAnimationDuration,
        });
    }

    dataSource = new MatTableDataSource<Role>([]);

    @ViewChild(MatPaginator) paginator: MatPaginator;


}
