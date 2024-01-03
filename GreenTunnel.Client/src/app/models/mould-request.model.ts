export class MouldRequest {
    model: {
        id: number;
        name: string;
        type: string;
        WorkspaceId: number;
        UserId: string;
    };

    constructor() {
      this.model = {
        id:0,
        name: '',
        type:'',
        WorkspaceId:1,
        UserId:'4f5cb57a-f38a-432e-a4b1-1203d6d5719a'
      };
    }
  }
