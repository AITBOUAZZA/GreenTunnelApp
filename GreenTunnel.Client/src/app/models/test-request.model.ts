export class TestRequest {
    model: {
        id: number;
        name: string;
        descrition: string; 
        tesTypeId: number;
        complianceId?: number;
        productId?: number;
    };
  
    constructor() {
      this.model = {
        id:0,
        name: '', 
        descrition: '',
        tesTypeId:0,
        complianceId:0,
        productId:0
      };
    }
  }
  