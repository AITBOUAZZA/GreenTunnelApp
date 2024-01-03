export class VolRequest {
    model: {
        

        numVol: string;
        numPilote: number,
        numAvion: number,
        villeDep: string;
        villeArr: string;
        heureDep: string;
        heureArr: string;

    };

    constructor() {
        this.model = {
            numVol: '',
            numPilote: 0,
            numAvion: 0,
            villeDep: '',
            villeArr: '',
            heureDep: '',
            heureArr: '',
           
        };
    }
}
