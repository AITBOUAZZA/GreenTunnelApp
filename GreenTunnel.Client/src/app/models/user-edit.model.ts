 

import { User } from './user.model';

export class UserEdit extends User {
    constructor(currentPassword?: string| any, newPassword?: string | any, confirmPassword?: string | any) {
        super();

        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
        this.confirmPassword = confirmPassword;
    }

    public currentPassword: string;
    public newPassword: string;
    public confirmPassword: string;
}
