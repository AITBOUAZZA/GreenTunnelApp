import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Permission } from 'src/app/models/permission.model';
import { Role } from 'src/app/models/role.model';
import { UserEdit } from 'src/app/models/user-edit.model';
import { User } from 'src/app/models/user.model';
import { AccountService } from 'src/app/services/account.service';
import { AlertService, MessageSeverity } from 'src/app/services/alert.service';
import { Utilities } from 'src/app/services/utilities';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent {
    hide = true;
    hidePass = true;
    hideConfirmPass = true;
    public isEditMode = false;
    public isNewUser = false;
    public isSaving = false;
    public isChangePassword = false;
    public isEditingSelf = false;
    public showValidationErrors = false;
    public uniqueId = Utilities.uniqueId();
    public user = new User();
    public userEdit: UserEdit;
    public allRoles: Role[] = [];

    public formResetToggle = true;

    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;

    @Input()
    isViewOnly: boolean;

    @Input()
    isGeneralEditor = false;

    // Outupt to broadcast this instance so it can be accessible from within ng-bootstrap modal template
    @Output()
    afterOnInit = new EventEmitter<AccountComponent>();


    @ViewChild('f')
    public form:any;

    // ViewChilds required because ngIf hides template variables from global scope within template
    @ViewChild('userName')
    public userName :string ='';

    @ViewChild('userPassword')
    public userPassword:string ='';

    @ViewChild('email')
    public email:string='';

    @ViewChild('currentPassword')
    public currentPassword:string='';

    @ViewChild('newPassword')
    public newPassword:string='';

    @ViewChild('confirmPassword')
    public confirmPassword:string='';

    @ViewChild('roles')
    public roles:any;

    constructor(private alertService: AlertService | null = null, private accountService: AccountService | null = null,
        private serviceT: CustomizerSettingsService, private toasterService:ToastrService)  {
    }

    ngOnInit() {
      if (!this.isGeneralEditor) {
        this.loadCurrentUserData();


      }

      this.afterOnInit.emit(this);
    }
    toggleTheme() {
        this.serviceT.toggleTheme();
    }

    toggleSidebarTheme() {
       this.serviceT.toggleSidebarTheme();
    }
    toggleHeaderTheme() {
        this.serviceT.toggleHeaderTheme();
    }

    toggleCardBorderTheme() {
        this.serviceT.toggleCardBorderTheme();
    }
    isDark() {
        return this.serviceT.isDark();
    }

    isSidebarDark() {
        return this.serviceT.isSidebarDark();
    }
    isHeaderDark() {
        return this.serviceT.isHeaderDark();
    }

    isCardBorder() {
        return this.serviceT.isCardBorder();
    }
    private loadCurrentUserData() {
      this.alertService?.startLoadingMessage();

      if (this.canViewAllRoles) {
        this.accountService?.getUserAndRoles()
          .subscribe({
            next: (results:any) => this.onCurrentUserDataLoadSuccessful(results[0], results[1]),
            error: (error:any) => this.onCurrentUserDataLoadFailed(error)
          });
      } else {
        this.accountService?.getUser()
          .subscribe({
            next: (user:any) => this.onCurrentUserDataLoadSuccessful(user, user.roles.map((x:any) => new Role(x))),
            error: (error:any) => this.onCurrentUserDataLoadFailed(error)
          });
      }
    }

    private onCurrentUserDataLoadSuccessful(user: User, roles: Role[]) {
      this.alertService?.stopLoadingMessage();
      this.user = user;
      if(this.user != null){
        this.edit();
      }
      this.allRoles = roles;
    }

    private onCurrentUserDataLoadFailed(error: any) {
      this.alertService?.stopLoadingMessage();
      this.alertService?.showStickyMessage('Load Error', `Unable to retrieve user data from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
        MessageSeverity.error, error);

      this.user = new User();
    }



    getRoleByName(name: string) {
      return this.allRoles.find((r) => r.name === name);
    }



    showErrorAlert(caption: string, message: string) {
      this.toasterService.error(caption, message);
    }


    deletePasswordFromUser(user: UserEdit | User) {
      const userEdit = user as UserEdit | any;

      delete userEdit.currentPassword;
      delete userEdit.newPassword;
      delete userEdit.confirmPassword;
    }


    edit() {
      if (!this.isGeneralEditor) {
        this.isEditingSelf = true;
        this.userEdit = new UserEdit();
        Object.assign(this.userEdit, this.user);
      } else {
        if (!this.userEdit) {
          this.userEdit = new UserEdit();
        }

        this.isEditingSelf = this.accountService?.currentUser ? this.userEdit.id === this.accountService?.currentUser.id : false;
      }

      this.isEditMode = true;
      this.showValidationErrors = true;
      this.isChangePassword = false;
    }


    save() {
      this.isSaving = true;
      this.alertService?.startLoadingMessage('Saving changes...');

      if (this.isNewUser) {
        this.accountService?.newUser(this.userEdit)
          .subscribe({
            next: (user:any) => this.saveSuccessHelper(user),
            error: (error:any) => this.saveFailedHelper(error)
          });
      } else {
        this.accountService?.updateUser(this.userEdit)
          .subscribe({
            next: (_: any) => this.saveSuccessHelper(),
            error: (error: any) => this.saveFailedHelper(error)
          });
      }
    }


    private saveSuccessHelper(user?: User) {
      this.testIsRoleUserCountChanged(this.user, this.userEdit);

      if (user) {
        Object.assign(this.userEdit, user);
      }

      this.isSaving = false;
      this.alertService?.stopLoadingMessage();
      this.isChangePassword = false;
      this.showValidationErrors = false;

      this.deletePasswordFromUser(this.userEdit);
      Object.assign(this.user, this.userEdit);
      this.userEdit = new UserEdit();
      this.resetForm();


      if (this.isGeneralEditor) {
        if (this.isNewUser) {
          this.alertService?.showMessage('Success', `User \"${this.user.userName}\" was created successfully`, MessageSeverity.success);
        } else if (!this.isEditingSelf) {
          this.alertService?.showMessage('Success', `Changes to user \"${this.user.userName}\" was saved successfully`, MessageSeverity.success);
        }
      }

      if (this.isEditingSelf) {
        this.alertService?.showMessage('Success', 'Changes to your User Profile was saved successfully', MessageSeverity.success);
        this.refreshLoggedInUser();
      }

      this.isEditMode = true;


      if (this.changesSavedCallback) {
        this.changesSavedCallback();
      }
    }


    private saveFailedHelper(error: any) {
      this.isSaving = false;
      this.alertService?.stopLoadingMessage();
      this.alertService?.showStickyMessage('Save Error', 'The below errors occurred whilst saving your changes:', MessageSeverity.error, error);
      this.alertService?.showStickyMessage(error, '', MessageSeverity.error);

      if (this.changesFailedCallback) {
        this.changesFailedCallback();
      }
    }



    private testIsRoleUserCountChanged(currentUser: User, editedUser: User) {

      const rolesAdded = this.isNewUser ? editedUser.roles : editedUser.roles.filter((role: any) => currentUser.roles.indexOf(role) === -1);
      const rolesRemoved = this.isNewUser ? [] : currentUser.roles.filter((role: any) => editedUser.roles.indexOf(role) === -1);

      const modifiedRoles = rolesAdded.concat(rolesRemoved);

      if (modifiedRoles.length) {
        setTimeout(() => this.accountService?.onRolesUserCountChanged(modifiedRoles));
      }
    }



    cancel() {
      if (this.isGeneralEditor) {
        this.userEdit = this.user = new UserEdit();
      } else {
        this.userEdit = new UserEdit();
      }

      this.showValidationErrors = false;
      this.resetForm();

      this.alertService?.showMessage('Cancelled', 'Operation cancelled by user', MessageSeverity.default);
      this.alertService?.resetStickyMessage();

      if (!this.isGeneralEditor) {
        this.isEditMode = false;
      }

      if (this.changesCancelledCallback) {
        this.changesCancelledCallback();
      }
    }


    close() {
      this.userEdit = this.user = new UserEdit();
      this.showValidationErrors = false;
      this.resetForm();
      this.isEditMode = false;

      if (this.changesSavedCallback) {
        this.changesSavedCallback();
      }
    }



    private refreshLoggedInUser() {
      this.accountService?.refreshLoggedInUser()
        .subscribe({
          next: (_: any) => {
            this.loadCurrentUserData();
          },
          error: (error: any) => {
            this.alertService?.resetStickyMessage();
            this.alertService?.showStickyMessage('Refresh failed', 'An error occurred whilst refreshing logged in user information from the server', MessageSeverity.error, error);
          }
        });
    }


    changePassword() {
      this.isChangePassword = true;
    }


    unlockUser() {
      this.isSaving = true;
      this.alertService?.startLoadingMessage('Unblocking user...');


      this.accountService?.unblockUser(this.userEdit.id)
        .subscribe({
          next: (_: any) => {
            this.isSaving = false;
            this.userEdit.isLockedOut = false;
            this.alertService?.stopLoadingMessage();
            this.alertService?.showMessage('Success', 'User has been successfully unblocked', MessageSeverity.success);
          },
          error: (error: any) => {
            this.isSaving = false;
            this.alertService?.stopLoadingMessage();
            this.alertService?.showStickyMessage('Unblock Error', 'The below errors occurred whilst unblocking the user:', MessageSeverity.error, error);
            this.alertService?.showStickyMessage(error, '', MessageSeverity.error);
          }
        });
    }


    resetForm(replace = false) {
      this.isChangePassword = false;

      if (!replace) {
        this.form.reset();
      } else {
        this.formResetToggle = false;

        setTimeout(() => {
          this.formResetToggle = true;
        });
      }
    }


    newUser(allRoles: Role[]) {
      this.isGeneralEditor = true;
      this.isNewUser = true;

      this.allRoles = [...allRoles];
      this.user = this.userEdit = new UserEdit();
      this.userEdit.isEnabled = true;
      this.edit();

      return this.userEdit;
    }

    editUser(user: User, allRoles: Role[]) {
      if (user) {
        this.isGeneralEditor = true;
        this.isNewUser = false;

        this.setRoles(user, allRoles);
        this.user = new User();
        this.userEdit = new UserEdit();
        Object.assign(this.user, user);
        Object.assign(this.userEdit, user);
        this.edit();

        return this.userEdit;
      } else {
        return this.newUser(allRoles);
      }
    }


    displayUser(user: User, allRoles?: Role[]) {

      this.user = new User();
      Object.assign(this.user, user);
      this.deletePasswordFromUser(this.user);
      this.setRoles(user, allRoles);

      this.isEditMode = false;
    }



    private setRoles(user: User, allRoles?: Role[]) {

      this.allRoles = allRoles ? [...allRoles] : [];

      if (user.roles) {
        for (const ur of user.roles) {
          if (!this.allRoles.some(r => r.name === ur)) {
            this.allRoles.unshift(new Role(ur));
          }
        }
      }
    }



    get canViewAllRoles() {
      return this.accountService?.userHasPermission(Permission.viewRolesPermission);
    }

    get canAssignRoles() {
      return this.accountService?.userHasPermission(Permission.assignRolesPermission);
    }
    get canViewUsers() {
        return this.accountService.userHasPermission(Permission.viewUsersPermission);
      }

      get canViewRoles() {
        return this.accountService.userHasPermission(Permission.viewRolesPermission);
      }
}