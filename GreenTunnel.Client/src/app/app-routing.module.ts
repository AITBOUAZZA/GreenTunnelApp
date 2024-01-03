import { Injectable, NgModule } from '@angular/core';
import { DefaultUrlSerializer, RouterModule, Routes, UrlSerializer, UrlTree } from '@angular/router';
import { InternalErrorComponent } from './components/common/internal-error/internal-error.component';
import { NotFoundComponent } from './components/common/not-found/not-found.component';
import { FileUploaderComponent } from './components/forms/file-uploader/file-uploader.component';
import { WizardFormComponent } from './components/forms/wizard-form/wizard-form.component';
import { AccountComponent } from './components/pages/account/account.component';
import { AnalyticsCustomersComponent } from './components/pages/analytics-customers/analytics-customers.component';
import { AnalyticsReportsComponent } from './components/pages/analytics-reports/analytics-reports.component';
import { ConnectionsComponent } from './components/pages/connections/connections.component';
import { FlaticonComponent } from './components/pages/icons/flaticon/flaticon.component';
import { MaterialIconsComponent } from './components/pages/icons/material-icons/material-icons.component';
import { MaterialSymbolsComponent } from './components/pages/icons/material-symbols/material-symbols.component';
import { RemixiconComponent } from './components/pages/icons/remixicon/remixicon.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { SearchComponent } from './components/pages/search/search.component';
import { TimelineComponent } from './components/pages/timeline/timeline.component';
import { PKanbanBoardComponent } from './components/projects/p-kanban-board/p-kanban-board.component';
import { AutocompleteComponent } from './components/ui-kit/autocomplete/autocomplete.component';
import { ChipsComponent } from './components/ui-kit/chips/chips.component';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth-guard.service';
import { Utilities } from './services/utilities';
import { UserInfoComponent } from './components/settings/user/user-info/user-info.component';
import { RolesManagementComponent } from './components/settings/roles/roles-mangement/roles-management/roles-management.component';
import { UsersManagementComponent } from './components/settings/user/user-mangement/app-users-management/users-management.component';
import { LockScreenComponent } from './components/authentication/lock-screen/lock-screen.component';
import { ConfirmMailComponent } from './components/authentication/confirm-mail/confirm-mail.component';
import { LogoutComponent } from './components/authentication/logout/logout.component';
import { SigninSignupComponent } from './components/authentication/signin-signup/signin-signup.component';
import { RegisterComponent } from './components/authentication/register/register.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { ResetPasswordComponent } from './components/authentication/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/authentication/forgot-password/forgot-password.component';
import { EcommerceComponent } from './components/dashboard/ecommerce/ecommerce.component';
import { VolPiloteComponent } from './components/views/vol-pilote/vol-pilote.component';
import { PiloteListComponent } from './components/views/test-list/pilote-list.component';
import { VolListComponent } from './components/views/vol-list/vol-list.component';
import { AddEditVolComponent } from './components/views/add-edit-vol/add-edit-vol.component';




@Injectable()
export class LowerCaseUrlSerializer extends DefaultUrlSerializer {
    override parse(url: string): UrlTree {
    const possibleSeparators = /[?;#]/;
    const indexOfSeparator = url.search(possibleSeparators);
    let processedUrl: string;

    if (indexOfSeparator > -1) {
      const separator = url.charAt(indexOfSeparator);
      const urlParts = Utilities.splitInTwo(url, separator);
      urlParts.firstPart = urlParts.firstPart.toLowerCase();

      processedUrl = urlParts.firstPart + separator + urlParts.secondPart;
    } else {
      processedUrl = url.toLowerCase();
    }

    return super.parse(processedUrl);
  }
}
const routes: Routes = [
    {path: '', component: EcommerceComponent},
    {path: 'projects/kanban-board', component: PKanbanBoardComponent},
    {path: 'analytics/customers', component: AnalyticsCustomersComponent},
    {path: 'analytics/reports', component: AnalyticsReportsComponent},
    {path: 'ui-kit/autocomplete', component: AutocompleteComponent},
    {path: 'ui-kit/chips', component: ChipsComponent},
    {path: 'icons/flaticon', component: FlaticonComponent},
    {path: 'icons/remixicon', component: RemixiconComponent},
    {path: 'icons/material-symbols', component: MaterialSymbolsComponent},
    {path: 'icons/material', component: MaterialIconsComponent},
    {path: 'forms/file-uploader', component: FileUploaderComponent},
    {path: 'profile', component: UserInfoComponent,canActivate: [AuthGuard],data: { title: 'Profile' }},
    {path: 'user-mangement', component: UsersManagementComponent,canActivate: [AuthGuard],data: { title: 'Users' }},
    {path: 'role-mangement', component: RolesManagementComponent,canActivate: [AuthGuard],data: { title: 'Roles' }},
    {path: 'account', component: AccountComponent,canActivate: [AuthGuard], data: { title: 'Account' }},
    {path: 'connections', component: ConnectionsComponent},
    {path: 'timeline', component: TimelineComponent},
    {path: 'search', component: SearchComponent},
    {path: 'error-500', component: InternalErrorComponent},
    {path: 'authentication/forgot-password', component: ForgotPasswordComponent},
    {path: 'authentication/reset-password', component: ResetPasswordComponent},
    {path: 'authentication/login', component: LoginComponent},
    {path: 'authentication/register', component: RegisterComponent},
    {path: 'authentication/signin-signup', component: SigninSignupComponent},
    {path: 'authentication/logout', component: LogoutComponent},
    {path: 'authentication/confirm-mail', component: ConfirmMailComponent},
    {path: 'authentication/lock-screen', component: LockScreenComponent},   
    { path: 'volpilote', component: VolPiloteComponent, canActivate: [AuthGuard], data: { title: 'Vol Pilote' } },
    
    { path: 'add-edit-vol', component: AddEditVolComponent, canActivate: [AuthGuard], data: { title: 'Add Edit Vol' } },
    { path: 'pilotes', component: PiloteListComponent, canActivate: [AuthGuard], data: { title: 'View Pilotes' } },

    { path: 'vols', component: VolListComponent, canActivate: [AuthGuard], data: { title: 'vols' } },

    

    {path: '**', component: NotFoundComponent} // This line will remain down from the whole pages component list
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
    exports: [RouterModule],
    providers: [
        AuthService,
        AuthGuard,
        { provide: UrlSerializer, useClass: LowerCaseUrlSerializer }
]
})
export class AppRoutingModule { }
