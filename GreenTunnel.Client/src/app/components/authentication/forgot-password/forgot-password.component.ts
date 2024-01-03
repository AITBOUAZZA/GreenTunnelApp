import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { Component } from '@angular/core';
import { ForgotPassword } from 'src/app/models/forgot-password.model';
import { AccountService } from 'src/app/services/account.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Utilities } from 'src/app/services/utilities';
import { AlertService, DialogType, MessageSeverity } from 'src/app/services/alert.service';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationService } from 'src/app/services/configuration.service';
@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
    forgotPasswordForm: FormGroup
    successMessage: string;
    errorMessage: string;
    showSuccess: boolean;
    showError: boolean;
    isLoading: boolean;
    constructor(
        public themeService: CustomizerSettingsService,
        private accountService: AccountService,
        private toastrService: ToastrService,
        private alertService: AlertService,
        private configurations: ConfigurationService
    ) { }
    ngOnInit(): void {
        this.forgotPasswordForm = new FormGroup({
            email: new FormControl("", [Validators.required])
        })
    }
    public validateControl = (controlName: string) => {
        return this.forgotPasswordForm.get(controlName).invalid && this.forgotPasswordForm.get(controlName).touched
    }
    public hasError = (controlName: string, errorName: string) => {
        return this.forgotPasswordForm.get(controlName).hasError(errorName)
    }
    public forgotPassword = (forgotPasswordFormValue) => {
        this.showError = this.showSuccess = false;
        const forgotPass = { ...forgotPasswordFormValue };
        const forgotPassDto: ForgotPassword = {
            email: forgotPass.email,
            clientUri: 'http://localhost:4200/authentication/reset-password'
        }
        this.accountService.forgotPassword(forgotPassDto)
            .subscribe({
                next: (_) => {
                    this.showSuccess = true;
                    this.successMessage = 'The link has been sent, please check your email to reset your password.'
                },
                error: error => {


                    if (Utilities.checkNoNetwork(error)) {
                        this.alertService.showStickyMessage(Utilities.noNetworkMessageCaption, Utilities.noNetworkMessageDetail, MessageSeverity.error, error);
                        this.offerAlternateHost();
                    } else {
                        const errorMessage = Utilities.getHttpResponseMessage(error);

                        if (errorMessage) {
                            this.toastrService.error('Unable to send reset password email.', this.mapLoginErrorMessage(errorMessage));

                        } else {
                            this.toastrService.error('Unable to send reset password email.', 'An error occurred whilst logging in, please try again later.\nError: ' + Utilities.getResponseBody(error));
                        }
                    }

                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500);
                }
                // error: (err: any) => {
                //     this.showError = true;
                //     this.errorMessage = err.;
                // }
            })
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
    offerAlternateHost() {
        if (Utilities.checkIsLocalHost(location.origin) && Utilities.checkIsLocalHost(this.configurations.baseUrl)) {
            this.alertService.showDialog('Dear Developer!\nIt appears your backend Web API service is not running...\n' +
                'Would you want to temporarily switch to the online Demo API below?(Or specify another)',
                DialogType.prompt,
                (value: string) => {
                    this.configurations.baseUrl = value;
                    this.toastrService.error('API Changed!', 'The target Web API has been changed to: ' + value);
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
}