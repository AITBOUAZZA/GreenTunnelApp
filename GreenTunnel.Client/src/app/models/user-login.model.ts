 

export class UserLogin {
    constructor(userName?: string | any, password?: string | any, rememberMe?: boolean | any) {
        this.userName = userName;
        this.password = password;
        this.rememberMe = rememberMe;
    }

    userName: string;
    password: string;
    rememberMe: boolean;
}
