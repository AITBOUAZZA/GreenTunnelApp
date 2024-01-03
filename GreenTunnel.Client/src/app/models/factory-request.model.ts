export class FactoryRequest {
    model: {
      id:number,
      name: string;
      description: string;
      address: string;
      logo: string;
      phone: string;
      mobile: string;
      email: string;
      support: string;
    };
  
    constructor() {
      this.model = {
        id:0,
        name: '',
        description: '',
        address: '',
        logo: '',
        phone: '',
        mobile: '',
        email: '',
        support: ''
      };
    }
  }
