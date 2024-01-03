import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { UserLogin } from 'src/app/models/user-login.model';
import { AlertService, DialogType, MessageSeverity } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { Utilities } from 'src/app/services/utilities';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent  implements OnInit, OnDestroy{
  @ViewChild('f', { static: false }) loginForm: NgForm; // Reference the form using ViewChild

    hide = true;
    userLogin = new UserLogin();
    isLoading = false;
    formResetToggle = true;
    modalClosedCallback: () => void;
    loginStatusSubscription: any;
  
    @Input()
    isModal = false;
  inProgress: boolean;
    constructor(
      private toastr: ToastrService,
        public themeService: CustomizerSettingsService,
        private alertService: AlertService,
         private authService: AuthService,
          private configurations: ConfigurationService
    ) {}
    ngOnInit() {

      this.userLogin.rememberMe = this.authService.rememberMe;
  
      if (this.getShouldRedirect()) {
        this.authService.redirectLoginUser();
      } else {
        this.loginStatusSubscription = this.authService.getLoginStatusEvent().subscribe(_ => {
          if (this.getShouldRedirect()) {
            this.authService.redirectLoginUser();
          }
        });
      }
    }
    toggleTheme() {
        this.themeService.toggleTheme();
    }

    toggleCardBorderTheme() {
        this.themeService.toggleCardBorderTheme();
    }

    toggleCardBorderRadiusTheme() {
        this.themeService.toggleCardBorderRadiusTheme();
    }

    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }
    ngOnDestroy() {
        if (this.loginStatusSubscription) {
          this.loginStatusSubscription.unsubscribe();
        }
      }
    
    
      getShouldRedirect() {
        return !this.isModal && this.authService.isLoggedIn && !this.authService.isSessionExpired;
      }
    
    
      showErrorAlert(caption: string, message: string) {
        this.alertService.showMessage(caption, message, MessageSeverity.error);
      }
    
      closeModal() {
        if (this.modalClosedCallback) {
          this.modalClosedCallback();
        }
      }
    
    
      login() {
        this.isLoading = true;
        debugger
        if (this.loginForm.valid) {
          if (this.inProgress) {
            return;
          }
          this.inProgress = true;
        this.toastr.success('', 'Attempting login...');

        this.authService.loginWithPassword(this.userLogin.userName, this.userLogin.password, this.userLogin.rememberMe)
          .subscribe({
            next: user => {
              setTimeout(() => {
                this.alertService.stopLoadingMessage();
                this.isLoading = false;
                this.inProgress = false;

                this.reset();
    
                if (!this.isModal) {
                  this.toastr.success(`Welcome ${user.userName}!`,'Login');

                } else {
                  this.toastr.success(`Session for ${user.userName} restored!`,'Login');
                  setTimeout(() => {
                    this.toastr.success('Please try your last operation again','Session Restored');
                  }, 500);
    
                  this.closeModal();
                }
              }, 500);
            },
            error: error => {
    
              this.alertService.stopLoadingMessage();
    
              if (Utilities.checkNoNetwork(error)) {
                this.alertService.showStickyMessage(Utilities.noNetworkMessageCaption, Utilities.noNetworkMessageDetail, MessageSeverity.error, error);
                this.offerAlternateHost();
              } else {
                const errorMessage = Utilities.getHttpResponseMessage(error);
    
                if (errorMessage) {
                  this.toastr.error(this.mapLoginErrorMessage(errorMessage),'Unable to login');

                } else {
                  this.toastr.error('An error occurred whilst logging in, please try again later.\nError: ' + Utilities.getResponseBody(error),'Unable to login');
                }
              }
    
              setTimeout(() => {
                this.isLoading = false;
                this.inProgress = false;

              }, 500);
            }
          });
        }else{
          this.isLoading = false;
          this.inProgress = false;
        }
      }
    
    
      offerAlternateHost() {
        if (Utilities.checkIsLocalHost(location.origin) && Utilities.checkIsLocalHost(this.configurations.baseUrl)) {
          this.alertService.showDialog('Dear Developer!\nIt appears your backend Web API service is not running...\n' +
            'Would you want to temporarily switch to the online Demo API below?(Or specify another)',
            DialogType.prompt,
            (value: string) => {
              this.configurations.baseUrl = value;
              this.toastr.error('The target Web API has been changed to: ' + value,'API Changed!');
            },
            null,
            null,
            null,
            this.configurations.fallbackBaseUrl);
        }
      }
    
    
      mapLoginErrorMessage(error: string) {
        if (error === 'invalid_username_or_password') {
          return 'Invalid username or password';
        }
    
        if (error === 'invalid_grant') {
          return 'This account has been disabled';
        }
    
        return error;
      }
    
    
      reset() {
        this.formResetToggle = false;
    
        setTimeout(() => {
          this.formResetToggle = true;
        });
      }
}