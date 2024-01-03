 

import { Permission } from './permission.model';


export class Role {

    constructor(name?: string | any, description?: string | any, permissions?: Permission[] | any) {

        this.name = name;
        this.description = description;
        this.permissions = permissions;
    }

    public id: string;
    public name: string;
    public description: string;
    public usersCount: number;
    public permissions: Permission[];
}
