import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserInfoComponent } from '../../user-info/user-info.component';
import { AccountService } from 'src/app/services/account.service';
import {
    AlertService,
    DialogType,
    MessageSeverity,
} from 'src/app/services/alert.service';
import { Role } from 'src/app/models/role.model';
import { UserEdit } from 'src/app/models/user-edit.model';
import { User } from 'src/app/models/user.model';
import { Permission } from 'src/app/models/permission.model';
import { Utilities } from 'src/app/services/utilities';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DeleteUserComponent } from '../../delete-user/delete-user.component';

@Component({
    selector: 'app-users-management',
    templateUrl: './users-management.component.html', // Replace with actual template path
    styleUrls: ['./users-management.component.scss'], // Replace with actual styles path
})
export class UsersManagementComponent implements OnInit {
    @ViewChild('indexTemplate', { static: true })
    indexTemplate: TemplateRef<any>;

    @ViewChild('userNameTemplate', { static: true })
    userNameTemplate: TemplateRef<any>;

    @ViewChild('rolesTemplate', { static: true })
    rolesTemplate: TemplateRef<any>;

    @ViewChild('actionsTemplate', { static: true })
    actionsTemplate: TemplateRef<any>;

    @ViewChild('editorModal', { static: true })
    editorModalTemplate: TemplateRef<any>;

    userEditor: UserInfoComponent;

    ngOnInit() {
        const gT = (key: string) => 'TranslationLogicHere'; // Replace with actual translation logic

        if (this.canManageUsers) {
            this.columns.push({
                name: '',
                width: 160,
                cellTemplate: this.actionsTemplate,
                resizeable: false,
                canAutoResize: false,
                sortable: false,
                draggable: false,
            });
        }

        this.loadData();
    }

    setUserEditorComponent(userEditor: UserInfoComponent) {
        this.userEditor = userEditor;
        if (this.sourceUser == null)
            this.editedUser = this.userEditor.newUser(this.allRoles);
        else
            this.editedUser = this.userEditor.editUser(
                this.sourceUser,
                this.allRoles
            );
    }

    editUser(row: UserEdit) {
        this.editingUserName = { name: row.userName };
        this.sourceUser = row;
        this.openUserEditor();
    }

    openUserEditor() {
        const modalRef = this.modalService.open(this.editorModalTemplate, {
            size: 'lg',
            backdrop: 'static',

        });

        modalRef.shown.subscribe(() => {
            this.userEditor.changesSavedCallback = () => {
                this.addNewUserToList();
                modalRef.close();
            };

            this.userEditor.changesCancelledCallback = () => {
                this.editedUser = new UserEdit();
                this.sourceUser = new UserEdit();
                modalRef.close();
            };
        });

        modalRef.hidden.subscribe(() => {
            this.editingUserName = { name: '' };
            this.userEditor.resetForm(true);
            this.userEditor = new UserInfoComponent(); // Replace this with your actual initialization logic Angular16
        });
    }

    addNewUserToList() {
        if (this.sourceUser) {
            Object.assign(this.sourceUser, this.editedUser);

            let sourceIndex = this.rowsCache.indexOf(this.sourceUser, 0);
            if (sourceIndex > -1) {
                Utilities.moveArrayItem(this.rowsCache, sourceIndex, 0);
            }

            sourceIndex = this.dataSource.data.indexOf(this.sourceUser, 0);
            if (sourceIndex > -1) {
                Utilities.moveArrayItem(this.dataSource.data, sourceIndex, 0);
            }

            this.editedUser = null;
            this.sourceUser = null;
        } else {
            const user = new User();
            Object.assign(user, this.editedUser);
            this.editedUser = null;

            let maxIndex = 0;
            for (const u of this.rowsCache) {
                if ((u as any).index > maxIndex) {
                    maxIndex = (u as any).index;
                }
            }
            (user as any).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, user);
            this.dataSource.data.splice(0, 0, user);
            this.dataSource.data = [... this.dataSource.data];
        }
    }
    deleteUser(row: UserEdit) {
        const modalRef = this.modalService.open(DeleteUserComponent,
            {
                size: 'lg',
                backdrop: 'static'
            });
        modalRef.componentInstance.row = row;
        modalRef.componentInstance.deleteChanged.subscribe((data) => {
            if (data) {
                this.modalService.dismissAll();
                this.loadData();
            }
        })
    }

    deleteUserHelper(row: UserEdit) {
        this.alertService.startLoadingMessage('Deleting...');
        this.loadingIndicator = true;

        this.accountService.deleteUser(row).subscribe({
            next: (_) => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.rowsCache = this.rowsCache.filter((item) => item !== row);
                this.dataSource.data = this.dataSource.data.filter((item) => item !== row);
            },
            error: (error) => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.alertService.showStickyMessage(
                    'Delete Error',
                    `An error occurred whilst deleting the user.\r\nError: "${Utilities.getHttpResponseMessages(
                        error
                    )}"`,
                    MessageSeverity.error,
                    error
                );
            },
        });
    }

    newUser() {
        this.editingUserName = null;
        this.sourceUser = null;
        this.openUserEditor();
    }

    columns: any[] = [];
    rows: User[] = [];
    rowsCache: User[] = [];
    editedUser: UserEdit;
    sourceUser: UserEdit;
    editingUserName: any;
    loadingIndicator: boolean;
    allRoles: Role[] = [];
    totalRows = 0;
    pageSize = 5;
    currentPage = 0;
    pageSizeOptions: number[] = [2, 10, 25, 100];
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    searchValue: string = "";
    constructor(
        public dialog: MatDialog,
        private alertService: AlertService,
        private modalService: NgbModal,
        private accountService: AccountService,
    ) { }

    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        if (this.canViewRoles) {
            this.accountService.getUsersAndRoles(this.currentPage + 1, this.pageSize, this.searchValue, 'name', 'desc').subscribe({
                next: (results) =>
                    this.onDataLoadSuccessful(results[0], results[1]),
                error: (error) => this.onDataLoadFailed(error),
            });
        } else {
            this.accountService.getUsers().subscribe({
                next: (users) =>
                    this.onDataLoadSuccessful(
                        users,
                        this.accountService.currentUser.roles.map(
                            (x) => new Role(x)
                        )
                    ),
                error: (error) => this.onDataLoadFailed(error),
            });
        }
    }

    onDataLoadSuccessful(users: any, roles: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.dataSource.data = users.items;

        this.totalRows = users.totalCount;
        this.allRoles = roles.items;

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
    pageChanged(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.currentPage = event.pageIndex;
        this.loadData();
    }
    // Rest of the component methods
    onSearchChanged(value: string) {
        this.searchValue = value;
        this.currentPage = 0;
        this.loadData();
    }
    openAddTaskDialog(
        enterAnimationDuration: string,
        exitAnimationDuration: string
    ): void {
        this.dialog.open(UserInfoComponent, {
            width: '600px',
            enterAnimationDuration,
            exitAnimationDuration,
        });
    }

    displayedColumns: string[] = [
        'userName',
        'fullName',
        'email',
        'roles',
        'phoneNumber',
        'actions',
    ];
    dataSource = new MatTableDataSource<User>([]);


    ongoing = true;
    pending = true;
    completed = true;
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
}
