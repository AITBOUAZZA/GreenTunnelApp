import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';
import { FullCalendarModule } from '@fullcalendar/angular';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { NgxEditorModule } from 'ngx-editor';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MatCardModule } from '@angular/material/card';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgApexchartsModule } from "ng-apexcharts";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgChartsModule } from 'ng2-charts';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { QuillModule } from 'ngx-quill';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ColorPickerModule } from 'ngx-color-picker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from './components/common/sidebar/sidebar.component';
import { FooterComponent } from './components/common/footer/footer.component';
import { HeaderComponent } from './components/common/header/header.component';
import { AnalyticsCustomersComponent } from './components/pages/analytics-customers/analytics-customers.component';
import { AnalyticsReportsComponent } from './components/pages/analytics-reports/analytics-reports.component';
import { AcAudienceOverviewComponent } from './components/pages/analytics-customers/ac-audience-overview/ac-audience-overview.component';
import { AcStatusComponent } from './components/pages/analytics-customers/ac-status/ac-status.component';
import { ArRevenueReportComponent } from './components/pages/analytics-reports/ar-revenue-report/ar-revenue-report.component';
import { ArAverageReportComponent } from './components/pages/analytics-reports/ar-average-report/ar-average-report.component';
import { ArSessionsComponent } from './components/pages/analytics-reports/ar-sessions/ar-sessions.component';
import { ArBrowserUsedTrafficReportsComponent } from './components/pages/analytics-reports/ar-browser-used-traffic-reports/ar-browser-used-traffic-reports.component';

import { AutocompleteComponent } from './components/ui-kit/autocomplete/autocomplete.component';
import { DsAutocompleteComponent } from './components/ui-kit/autocomplete/ds-autocomplete/ds-autocomplete.component';
import { FilterAutocompleteComponent } from './components/ui-kit/autocomplete/filter-autocomplete/filter-autocomplete.component';
import { OgAutocompleteComponent } from './components/ui-kit/autocomplete/og-autocomplete/og-autocomplete.component';
import { AutocompleteOverviewComponent } from './components/ui-kit/autocomplete/autocomplete-overview/autocomplete-overview.component';
import { PiAutocompleteComponent } from './components/ui-kit/autocomplete/pi-autocomplete/pi-autocomplete.component';
import { SimpleAutocompleteComponent } from './components/ui-kit/autocomplete/simple-autocomplete/simple-autocomplete.component';
import { ChipsComponent } from './components/ui-kit/chips/chips.component';
import { ChipsAutocompleteComponent } from './components/ui-kit/chips/chips-autocomplete/chips-autocomplete.component';
import { ChipsDadComponent } from './components/ui-kit/chips/chips-dad/chips-dad.component';
import { ChipsWithFcComponent } from './components/ui-kit/chips/chips-with-fc/chips-with-fc.component';
import { ChipsWithInputComponent } from './components/ui-kit/chips/chips-with-input/chips-with-input.component';
import { StackedChipsComponent } from './components/ui-kit/chips/stacked-chips/stacked-chips.component';
import { FlaticonComponent } from './components/pages/icons/flaticon/flaticon.component';
import { RemixiconComponent } from './components/pages/icons/remixicon/remixicon.component';
import { MaterialSymbolsComponent } from './components/pages/icons/material-symbols/material-symbols.component';
import { MaterialIconsComponent } from './components/pages/icons/material-icons/material-icons.component';
import { WizardFormComponent } from './components/forms/wizard-form/wizard-form.component';
import { FileUploaderComponent } from './components/forms/file-uploader/file-uploader.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { PersonalInfoComponent } from './components/pages/profile/personal-info/personal-info.component';
import { ActivityTimelineComponent } from './components/pages/profile/activity-timeline/activity-timeline.component';
import { StatsComponent } from './components/pages/profile/stats/stats.component';
import { OverviewComponent } from './components/pages/profile/overview/overview.component';
import { TasksComponent } from './components/pages/profile/tasks/tasks.component';
import { AccountComponent } from './components/pages/account/account.component';
import { ConnectionsComponent } from './components/pages/connections/connections.component';
import { TimelineComponent } from './components/pages/timeline/timeline.component';
import { SearchComponent } from './components/pages/search/search.component';
import { DragDropComponent } from './components/ui-kit/drag-drop/drag-drop.component';
import { ConnectedSortingDdComponent } from './components/ui-kit/drag-drop/connected-sorting-dd/connected-sorting-dd.component';
import { NotFoundComponent } from './components/common/not-found/not-found.component';
import { InternalErrorComponent } from './components/common/internal-error/internal-error.component';
import { ResetPasswordComponent } from './components/authentication/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/authentication/forgot-password/forgot-password.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { RegisterComponent } from './components/authentication/register/register.component';
import { SigninSignupComponent } from './components/authentication/signin-signup/signin-signup.component';
import { LogoutComponent } from './components/authentication/logout/logout.component';
import { ConfirmMailComponent } from './components/authentication/confirm-mail/confirm-mail.component';
import { LockScreenComponent } from './components/authentication/lock-screen/lock-screen.component';
import { CustomizerSettingsComponent } from './components/customizer-settings/customizer-settings.component';
import { ToastaModule } from 'ngx-toasta';
import { AlertService } from './services/alert.service';
import { ConfigurationService } from './services/configuration.service';
import { AppTitleService } from './services/app-title.service';
import { AppTranslationService, TranslateLanguageLoader } from './services/app-translation.service';
import { NotificationService } from './services/notification.service';
import { NotificationEndpoint } from './services/notification-endpoint.service';
import { AccountService } from './services/account.service';
import { AccountEndpoint } from './services/account-endpoint.service';
import { LocalStoreManager } from './services/local-store-manager.service';
import { OidcHelperService } from './services/oidc-helper.service';
import { ThemeManager } from './services/theme-manager';
import { OAuthModule } from 'angular-oauth2-oidc';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { UserInfoComponent } from './components/settings/user/user-info/user-info.component';
import { UsersManagementComponent } from './components/settings/user/user-mangement/app-users-management/users-management.component';
import { UserPreferencesComponent } from './components/settings/user/user-mangement/user-preferences/user-preferences.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { BootstrapTabDirective } from './directives/bootstrap-tab.directive';
import { RolesManagementComponent } from './components/settings/roles/roles-mangement/roles-management/roles-management.component';
import { RoleEditorComponent } from './components/settings/roles/role-editor/role-editor/role-editor.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { GroupByPipe } from './pipes/group-by.pipe';
import { SearchBoxComponent } from './components/settings/search-box/search-box/search-box.component';
import { EqualValidator } from './directives/equal-validator.directive';
import { ToastrModule } from 'ngx-toastr';
import { DeleteUserComponent } from './components/settings/user/delete-user/delete-user.component';
import { DeleteRoleComponent } from './components/settings/roles/delete-role/delete-role.component';
import { PKanbanBoardComponent } from './components/projects/p-kanban-board/p-kanban-board.component';

import { TestTypeService } from './services/testTypeServices/testType.service';
import { TestTypeEndpointService } from './services/testTypeServices/testType-endpoint.service';

import { PiloteListComponent } from './components/views/test-list/pilote-list.component';
import { VolPiloteComponent } from './components/views/vol-pilote/vol-pilote.component';
import { ClientService } from './services/Client/client.service';
import { ClientEndpointService } from './services/Client/client-endpoint.service';
import { PiloteService } from './services/piloteServices/pilote.service';
import { PiloteEndpointService } from './services/piloteServices/pilote-endpoint.service';
import { AddEditAvionComponent } from './components/views/add-edit-avion/add-edit-avion.component';
import { VolListComponent } from './components/views/vol-list/vol-list.component';
import { VolService } from './services/vol.service';
import { VolEndpointService } from './services/vol-endpoint.service';
import { AddEditVolComponent } from './components/views/add-edit-vol/add-edit-vol.component';





@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        SidebarComponent,
        FooterComponent,
        HeaderComponent,
        PKanbanBoardComponent,
        AnalyticsCustomersComponent,
        AnalyticsReportsComponent,
        AcAudienceOverviewComponent,
        AcStatusComponent,
        ArRevenueReportComponent,
        ArAverageReportComponent,
        ArSessionsComponent,
        ArBrowserUsedTrafficReportsComponent,
        AutocompleteComponent,
        DsAutocompleteComponent,
        FilterAutocompleteComponent,
        OgAutocompleteComponent,
        AutocompleteOverviewComponent,
        PiAutocompleteComponent,
        SimpleAutocompleteComponent,
        ChipsComponent,
        ChipsAutocompleteComponent,
        ChipsDadComponent,
        ChipsWithFcComponent,
        ChipsWithInputComponent,
        StackedChipsComponent,
        FlaticonComponent,
        RemixiconComponent,
        MaterialSymbolsComponent,
        MaterialIconsComponent,
        WizardFormComponent,
        FileUploaderComponent,
        ProfileComponent,
        PersonalInfoComponent,
        ActivityTimelineComponent,
        StatsComponent,
        OverviewComponent,
        TasksComponent,
        AccountComponent,
        ConnectionsComponent,
        TimelineComponent,
        SearchComponent,
        DragDropComponent,
        ConnectedSortingDdComponent,
        NotFoundComponent,
        InternalErrorComponent,
        ResetPasswordComponent,
        ForgotPasswordComponent,
        LoginComponent,
        RegisterComponent,
        SigninSignupComponent,
        LogoutComponent,
        ConfirmMailComponent,
        LockScreenComponent,
        CustomizerSettingsComponent,
        UserInfoComponent,
        UsersManagementComponent,
        UserPreferencesComponent,
        BootstrapTabDirective,
        RolesManagementComponent,
        RoleEditorComponent,
        GroupByPipe,
        SearchBoxComponent,
        EqualValidator,
        DeleteUserComponent,
        DeleteRoleComponent,
        VolPiloteComponent,
        PiloteListComponent,
        AddEditAvionComponent,
        VolListComponent,
        AddEditVolComponent
       
        
        

    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MatMenuModule,
        MatCardModule,
        MatTableModule,
        MatPaginatorModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        NgApexchartsModule,
        MatProgressBarModule,
        MatButtonModule,
        MatAutocompleteModule,
        MatBadgeModule,
        MatBottomSheetModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        MatChipsModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatSliderModule,
        MatSnackBarModule,
        MatSortModule,
        MatStepperModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,
        NgScrollbarModule,
        FormsModule,
        FullCalendarModule,
        MatNativeDateModule ,
        ReactiveFormsModule,
        CarouselModule,
        NgxEditorModule,
        DragDropModule,
        HttpClientModule,
        CdkAccordionModule,
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts')
        }),
        TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateLanguageLoader
            }
          }),
        NgChartsModule,
        NgxMatTimepickerModule,
        QuillModule.forRoot(),
        NgxDropzoneModule,
        ColorPickerModule,
        ToastaModule.forRoot(),
        NgSelectModule,
        NgxDatatableModule,
        OAuthModule.forRoot(),
        ToastrModule.forRoot({
            timeOut: 10000,
            positionClass: 'toast-bottom-right',
            preventDuplicates: true,
          }),
    ],
    providers: [
        DatePipe,
        AlertService,
        ThemeManager,
        ConfigurationService,
        AppTitleService,
        AppTranslationService,
        NotificationService,
        NotificationEndpoint,
        AccountService,
        AccountEndpoint,
        LocalStoreManager,
        OidcHelperService,
        TestTypeService,
        TestTypeEndpointService,
        ClientService,
        ClientEndpointService,
        PiloteService,
        PiloteEndpointService,
        VolService,
        VolEndpointService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
