using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenTunnel.Core.Entities
{
    public class Pilote 
    {
        [Key]
        public int NumPilote { get; set; }
        public string NomPilote { get; set; }
        public string Adresse { get; set; }
    }
}
