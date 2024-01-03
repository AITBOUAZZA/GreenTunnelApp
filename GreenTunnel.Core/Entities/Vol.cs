using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenTunnel.Core.Entities
{
    public class Vol 
    {
        [Key]
        public string NumVol { get; set; }

        [ForeignKey("Pilote")]
        public int NumPilote { get; set; }


        
        [ForeignKey("Avion")]
       
        public int NumAvion { get; set; }
        public string VilleDep { get; set; }
        public string VilleArr { get; set; }
        public string HeureDep { get; set; }
        public string HeureArr { get; set; }


        public Pilote Pilote { get; set; }
        public Avion Avion { get; set; }
     
    }
}
