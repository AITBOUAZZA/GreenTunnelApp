using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenTunnel.Infrastructure.ViewModels.Response.vol
{
    internal class GetVolListResponseModel
    {
        public string NumVol { get; set; }
        public int NumPilote { get; set; }
        public int NumAvion { get; set; }
        public string VilleDep { get; set; }
        public string VilleArr { get; set; }
        public string HeureDep { get; set; }
        public string HeureArr { get; set; }

    }
}



