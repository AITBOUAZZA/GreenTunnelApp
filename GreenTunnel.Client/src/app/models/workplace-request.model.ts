export class WorkplaceRequest {
    model: {
      id:number,
      name: string;
      description: string;
      factoryId:number;
    };
  
    constructor() {
      this.model = {
        id:0,
        name: '',
        description: '',
        factoryId:0
      };
    }
  }
  