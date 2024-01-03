import { Component, OnInit } from '@angular/core';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { ToastrService } from 'ngx-toastr';
import { AlertService, DialogType, MessageSeverity } from 'src/app/services/alert.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { ResetPasswordDto } from 'src/app/models/reset-password.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Utilities } from 'src/app/services/utilities';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

    hide = true;
    resetPasswordForm: FormGroup;
    showSuccess: boolean;
    showError: boolean;
    errorMessage: string;
    private token: string;
    private email: string;
    isLoading: boolean;
    constructor(
        public themeService: CustomizerSettingsService,
        private route: ActivatedRoute,
        private accountService: AccountService,
        private toastr: ToastrService,
        private alertService: AlertService,
        private configurations: ConfigurationService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.resetPasswordForm = new FormGroup({
            password: new FormControl('', [Validators.required]),
            confirm: new FormControl('')
        });

        // this.resetPasswordForm.get('confirm').setValidators([Validators.required,
        // CustomValidators.validateConfirmPassword(this.resetPasswordForm.get('password'))]);

        this.token = this.route.snapshot.queryParams['token'];
        this.email = this.route.snapshot.queryParams['email'];
        // Clear query parameters from the route
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {},
            queryParamsHandling: 'merge',
        });
    }
    public validateControl = (controlName: string) => {
        return this.resetPasswordForm.get(controlName).invalid && this.resetPasswordForm.get(controlName).touched
    }

    public hasError = (controlName: string, errorName: string) => {
        return this.resetPasswordForm.get(controlName).hasError(errorName)
    }

    public resetPassword = (resetPasswordFormValue) => {
        this.showError = this.showSuccess = false;
        const resetPass = { ...resetPasswordFormValue };

        const resetPassDto: ResetPasswordDto = {
            password: resetPass.password,
            confirmPassword: resetPass.confirm,
            token: this.token,
            email: this.email
        }

        this.accountService.resetPassword(resetPassDto)
            .subscribe({
                next: (_) => this.showSuccess = true,
                error: error => {


                    if (Utilities.checkNoNetwork(error)) {
                        this.alertService.showStickyMessage(Utilities.noNetworkMessageCaption, Utilities.noNetworkMessageDetail, MessageSeverity.error, error);
                        this.offerAlternateHost();
                    } else {
                        const errorMessage = Utilities.getHttpResponseMessage(error);
                        if (errorMessage) {
                            
                            this.showError = true;
                            this.errorMessage = errorMessage;
                            this.toastr.error('Unable to send reset password email.', this.mapLoginErrorMessage(errorMessage));

                        } else {
                            this.toastr.error('Unable to send reset password email.', 'An error occurred whilst logging in, please try again later.\nError: ' + Utilities.getResponseBody(error));
                        }
                    }

                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500);
                }
                // error: (err: HttpErrorResponse) => {
                //   this.showError = true;
                //   this.errorMessage = err.message;
                // }
            })
    }
    offerAlternateHost() {
        if (Utilities.checkIsLocalHost(location.origin) && Utilities.checkIsLocalHost(this.configurations.baseUrl)) {
            this.alertService.showDialog('Dear Developer!\nIt appears your backend Web API service is not running...\n' +
                'Would you want to temporarily switch to the online Demo API below?(Or specify another)',
                DialogType.prompt,
                (value: string) => {
                    this.configurations.baseUrl = value;
                    this.toastr.error('API Changed!', 'The target Web API has been changed to: ' + value);
                },
                null,
                null,
                null,
                this.configurations.fallbackBaseUrl);
        }
    }
    mapLoginErrorMessage(error: any) {
        if (error === 'invalid_username_or_password') {
            return 'Invalid username or password';
        }

        if (error === 'invalid_grant') {
            return 'This account has been disabled';
        }
        if (error === 'ConfirmPassword') {
            return 'Invalid Confirm Password';
        }

        return error;
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

}