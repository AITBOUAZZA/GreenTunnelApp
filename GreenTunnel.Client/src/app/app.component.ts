import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CustomizerSettingsService } from '../app/components/customizer-settings/customizer-settings.service';
import { ToggleService } from '../app/components/common/header/toggle.service';
import { AccountService } from './services/account.service';
import { SampleService } from './services/apiService/sample.service';
import { NotificationService } from './services/notification.service';
import { AppTitleService } from './services/app-title.service';
import { AuthService } from './services/auth.service';
import { AppTranslationService } from './services/app-translation.service';
import { ConfigurationService } from './services/configuration.service';
import { AlertCommand, AlertDialog, AlertService, DialogType, MessageSeverity } from './services/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './components/authentication/login/login.component';
import { environment } from 'src/environments/environment';
import { ToastaService, ToastaConfig, ToastOptions, ToastData } from 'ngx-toasta';
import { Permission } from './models/permission.model';
const alertify: any = require('../assets/scripts/alertify.js');

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    title = 'Tagus - Material Design Angular Admin Dashboard Template';
    
    isToggled = false;
    isAppLoaded: boolean;
    isUserLoggedIn: boolean;
    newNotificationCount = 0;
    appTitle = 'AirLine';
  
    stickyToasties: number[] = [];
  
    dataLoadingConsecutiveFailures = 0;
    notificationsLoadingSubscription: any;
  
    loginControl: LoginComponent;
  
    gT = (key: string | Array<string>, interpolateParams?: object) =>
      this.translationService.getTranslation(key, interpolateParams);
    client_env_name: string = environment.env_name;
    server_name: string = "";
    get notificationsTitle() {
      if (this.newNotificationCount) {
        return `${this.gT('app.Notifications')} (${
          this.newNotificationCount
        } ${this.gT('app.New')})`;
      } else {
        return this.gT('app.Notifications');
      }
    }
    constructor(
        private toggleService: ToggleService,
        public themeService: CustomizerSettingsService,
         private toastaService: ToastaService,
         private toastaConfig: ToastaConfig,
        private accountService: AccountService,
        private alertService: AlertService,
        private modalService: NgbModal,
        private notificationService: NotificationService,
        private appTitleService: AppTitleService,
        private authService: AuthService,
        private translationService: AppTranslationService,
        public configurations: ConfigurationService,
        public router: Router,
        private sampleService: SampleService

    ) {
        this.toggleService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    toggleRightSidebarTheme() {
        this.themeService.toggleRightSidebarTheme();
    }

    toggleHideSidebarTheme() {
        this.themeService.toggleHideSidebarTheme();
    }

    toggleCardBorderTheme() {
        this.themeService.toggleCardBorderTheme();
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    toggleCardBorderRadiusTheme() {
        this.themeService.toggleCardBorderRadiusTheme();
    }

    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }
    getSampleService() {
        this.sampleService.getAppSettings().subscribe(
          (value: string) => {
            this.server_name = value;
            console.log('client_env:' + this.client_env_name);
            console.log('server_env:' + this.server_name);
          },
          (err: any) => console.error('error', err)
        );
      }
    
      ngOnDestroy() {
        this.unsubscribeNotifications();
      }
    
      private unsubscribeNotifications() {
        if (this.notificationsLoadingSubscription) {
          this.notificationsLoadingSubscription.unsubscribe();
        }
      }
    
      initNotificationsLoading() {
        this.notificationsLoadingSubscription = this.notificationService
          .getNewNotificationsPeriodically()
          .subscribe({
            next: (notifications:any) => {
              this.dataLoadingConsecutiveFailures = 0;
              this.newNotificationCount = notifications.filter(
                (n:any) => !n.isRead
              ).length;
            },
            error: (error) => {
              this.alertService.logError(error);
    
              if (this.dataLoadingConsecutiveFailures++ < 20) {
                setTimeout(() => this.initNotificationsLoading(), 5000);
              } else {
                this.alertService.showStickyMessage(
                  this.gT('app.alerts.LoadingError'),
                  this.gT('app.alerts.LoadingNewNotificationsFailed'),
                  MessageSeverity.error
                );
              }
            },
          });
      }
    
      markNotificationsAsRead() {
        const recentNotifications = this.notificationService.recentNotifications;
    
        if (recentNotifications.length) {
          this.notificationService
            .readUnreadNotification(
              recentNotifications.map((n) => n.id),
              true
            )
            .subscribe({
              next: (_) => {
                for (const n of recentNotifications) {
                  n.isRead = true;
                }
    
                this.newNotificationCount = recentNotifications.filter(
                  (n) => !n.isRead
                ).length;
              },
              error: (error) => {
                this.alertService.logError(error);
                this.alertService.showMessage(
                  this.gT('app.alerts.NotificationError'),
                  this.gT('app.alerts.MarkingReadNotificationsFailed'),
                  MessageSeverity.error
                );
              },
            });
        }
      }
    
      openLoginModal() {
        const modalRef = this.modalService.open(LoginComponent, {
          windowClass: 'login-control',
          modalDialogClass: 'h-75 d-flex flex-column justify-content-center my-0',
          size: 'lg',
          backdrop: 'static',
        });
    
        this.loginControl = modalRef.componentInstance as LoginComponent;
        this.loginControl.isModal = true;
    
        this.loginControl.modalClosedCallback = () => modalRef.close();
    
        modalRef.shown.subscribe(() => {
          this.alertService.showStickyMessage(
            this.gT('app.alerts.SessionExpired'),
            this.gT('app.alerts.SessionExpiredLoginAgain'),
            MessageSeverity.info
          );
        });
    
        modalRef.hidden.subscribe(() => {
          this.alertService.resetStickyMessage();
          this.loginControl.reset();
    
          if (this.authService.isSessionExpired) {
            this.alertService.showStickyMessage(
              this.gT('app.alerts.SessionExpired'),
              this.gT('app.alerts.SessionExpiredLoginToRenewSession'),
              MessageSeverity.warn
            );
          }
        });
      }
    
      showDialog(dialog: AlertDialog) {
        alertify.set({
          labels: {
            ok: dialog.okLabel || this.gT('app.alerts.OK'),
            cancel: dialog.cancelLabel || this.gT('app.alerts.Cancel'),
          },
        });
    
        switch (dialog.type) {
          case DialogType.alert:
            alertify.alert(dialog.message);
    
            break;
          case DialogType.confirm:
            alertify.confirm(dialog.message, (e:any) => {
              if (e) {
                dialog.okCallback();
              } else {
                if (dialog.cancelCallback) {
                  dialog.cancelCallback();
                }
              }
            });
    
            break;
          case DialogType.prompt:
            alertify.prompt(
              dialog.message,
              (e:any, val:any) => {
                if (e) {
                  dialog.okCallback(val);
                } else {
                  if (dialog.cancelCallback) {
                    dialog.cancelCallback();
                  }
                }
              },
              dialog.defaultValue
            );
    
            break;
        }
      }
    
      showToast(alert: AlertCommand) {
        if (alert.operation === 'clear') {
          for (const id of this.stickyToasties.slice(0)) {
            this.toastaService.clear(id);
          }
    
          return;
        }
    
        const toastOptions: ToastOptions = {
          title: alert?.message?.summary,
          msg: alert?.message?.detail,
        };
    
        if (alert.operation === 'add_sticky') {
          toastOptions.timeout = 0;
    
          toastOptions.onAdd = (toast: ToastData) => {
            this.stickyToasties.push(toast.id);
          };
    
          toastOptions.onRemove = (toast: ToastData) => {
            const index = this.stickyToasties.indexOf(toast.id, 0);
    
            if (index > -1) {
              this.stickyToasties.splice(index, 1);
            }
    
            if (alert.onRemove) {
              alert.onRemove();
            }
    
            toast.onAdd = undefined;
            toast.onRemove = undefined;
          };
        } else {
          toastOptions.timeout = 4000;
        }
    
        switch (alert?.message?.severity) {
          case MessageSeverity.default:
            this.toastaService.default(toastOptions);
            break;
          case MessageSeverity.info:
            this.toastaService.info(toastOptions);
            break;
          case MessageSeverity.success:
            this.toastaService.success(toastOptions);
            break;
          case MessageSeverity.error:
            this.toastaService.error(toastOptions);
            break;
          case MessageSeverity.warn:
            this.toastaService.warning(toastOptions);
            break;
          case MessageSeverity.wait:
            this.toastaService.wait(toastOptions);
            break;
        }
      }
    
      logout() {
        this.authService.logout();
        this.authService.redirectLogoutUser();
      }
    
      getYear() {
        return new Date().getUTCFullYear();
      }
    
      get userName(): string {
        return this.authService.currentUser
          ? this.authService.currentUser.userName
          : '';
      }
    
      get fullName(): string {
        return this.authService.currentUser
          ? this.authService.currentUser.fullName
          : '';
      }
    
      get canViewCustomers() {
        return this.accountService.userHasPermission(
          Permission.viewUsersPermission
        ); // eg. viewCustomersPermission
      }
    
      get canViewProducts() {
        return this.accountService.userHasPermission(
          Permission.viewUsersPermission
        ); // eg. viewProductsPermission
      }
    
      get canViewOrders() {
        return true; // eg. viewOrdersPermission
      }
}