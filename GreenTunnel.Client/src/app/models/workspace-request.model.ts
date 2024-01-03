export class WorkspaceRequest {
    model: {
      id:number,
      name: string;
      description: string;
      workplaceId:number;
      order:number;
    };
  
    constructor() {
      this.model = {
        id:0,
        name: '',
        description: '',
        workplaceId:0,
        order:0
      };
    }
  }
  