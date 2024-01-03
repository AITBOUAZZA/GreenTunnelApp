import { Component, HostListener, OnInit } from '@angular/core';
import { ToggleService } from './toggle.service';
import { DatePipe } from '@angular/common';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { AuthService } from 'src/app/services/auth.service';
import { AccountService } from 'src/app/services/account.service';
import { AlertCommand, AlertDialog, AlertService, DialogType, MessageSeverity } from 'src/app/services/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppTranslationService } from 'src/app/services/app-translation.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { Router } from '@angular/router';
import { AppTitleService } from 'src/app/services/app-title.service';
import { ToastaService, ToastaConfig, ToastOptions, ToastData } from 'ngx-toasta';
import { SampleService } from 'src/app/services/apiService/sample.service';
import { LoginComponent } from '../../authentication/login/login.component';
import { environment } from 'src/environments/environment';
import { Permission } from 'src/app/models/permission.model';
import { ToastrService } from 'ngx-toastr';
const alertify: any = require('src/assets/scripts/alertify.js');

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    isSticky: boolean = false;
    @HostListener('window:scroll', ['$event'])
    checkScroll() {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (scrollPosition >= 50) {
            this.isSticky = true;
        } else {
            this.isSticky = false;
        }
    }

    isToggled = false;
    title = 'Tagus - Material Design Angular Admin Dashboard Template';

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
    constructor(
        private toggleService: ToggleService,
        private datePipe: DatePipe,
        public themeService: CustomizerSettingsService,
         private toastaService: ToastaService,
         private toastaConfig: ToastaConfig,
        private accountService: AccountService,
        private alertService: AlertService,
        private modalService: NgbModal,
        private appTitleService: AppTitleService,
        private authService: AuthService,
        private translationService: AppTranslationService,
        public configurations: ConfigurationService,
        public router: Router,
        private sampleService: SampleService,
        private toastrService: ToastrService,
    ) {
        this.toggleService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }
    ngOnInit(): void {
        this.isUserLoggedIn = this.authService.isLoggedIn;
        if(!this.isUserLoggedIn){
           // this.router.navigate(['/authentication/login']);
        }
        // Extra sec to display preboot loaded information
        setTimeout(() => (this.isAppLoaded = true), 1000);

        setTimeout(() => {
          if (this.isUserLoggedIn) {

             if (!this.authService.isSessionExpired)
            this.toastrService.success(
              this.gT('app.alerts.WelcomeBack', { username: this.userName }),
              this.gT('app.alerts.Login')
            );
           else
             this.toastrService.warning(this.gT("app.alerts.SessionExpired"), this.gT("app.alerts.SessionExpiredLoginAgain"));
          }
        }, 2000);

        this.alertService
          .getDialogEvent()
          .subscribe((alert) => this.showDialog(alert));
        this.alertService
          .getMessageEvent()
          .subscribe((message) => this.showToast(message));

        this.authService.reLoginDelegate = () => this.openLoginModal();

        this.authService.getLoginStatusEvent().subscribe((isLoggedIn) => {
          this.isUserLoggedIn = isLoggedIn;
    if(this.isUserLoggedIn){
       // this.router.navigate(['/authentication/login']);
    }


          setTimeout(() => {
            if (!this.isUserLoggedIn) {
              this.toastrService.warning(
                this.gT('app.alerts.SessionEnded'),
                ''
              );
              // Redirect to the login page
          //   this.router.navigate(['/authentication/login']);
            }
          }, 500);
        });
      }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    toggle() {
        this.toggleService.toggle();
    }

    toggleSidebarTheme() {
        this.themeService.toggleSidebarTheme();
    }

    toggleHideSidebarTheme() {
        this.themeService.toggleHideSidebarTheme();
    }

    toggleCardBorderTheme() {
        this.themeService.toggleCardBorderTheme();
    }
    isDark() {
        return this.themeService.isDark();
    }
    toggleHeaderTheme() {
        this.themeService.toggleHeaderTheme();
    }

    toggleCardBorderRadiusTheme() {
        this.themeService.toggleCardBorderRadiusTheme();
    }

    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

    currentDate: Date = new Date();
    formattedDate: any = this.datePipe.transform(this.currentDate, 'dd MMMM yyyy');

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
          this.toastrService.warning(

            this.gT('app.alerts.SessionExpiredLoginAgain'),
            this.gT('app.alerts.SessionExpired')
                     );
        });

        modalRef.hidden.subscribe(() => {
          this.alertService.resetStickyMessage();
          this.loginControl.reset();

          if (this.authService.isSessionExpired) {
            this.toastrService.warning(
              this.gT('app.alerts.SessionExpiredLoginToRenewSession'),
              this.gT('app.alerts.SessionExpired'),
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
        // Redirect to the login page
         this.router.navigate(['/authentication/login']);
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
