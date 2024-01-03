export class ClientRequest {
    model: {
        id: number,
        name: string;
        description: string;
        employeId: number;
    };

    constructor() {
        this.model = {
            id: 0,
            name: '',
            description: '',
            employeId: 0
        };
    }
}
