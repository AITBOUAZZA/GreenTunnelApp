using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenTunnel.Core.Entities
{
    public class Avion 
    {
        [Key]
        public int NumAvion { get; set; }
        public string NomAvion { get; set; }


        [EnumDataType(typeof(CapaciteEnum))]

        public int Capacite { get; set; }

        [Required(ErrorMessage = "La localisation est obligatoire.")]
        [StringLength(20, ErrorMessage = "La longueur maximale de la localisation est de 20 caractères.")]
        public string Localisation { get; set; } = "Paris";

        public bool IsValidCapacite(int value)
        {
            var validValues = new int[] { 140, 180, 200, 250, 300, 320, 360, 380, 450, 460 };
            return validValues.Contains(value);
        }
    }

    public enum CapaciteEnum
    {
        C140 = 140,
        C180 = 180,
        C200 = 200,
        C250 = 250,
        C300 = 300,
        C320 = 320,
        C360 = 360,
        C380 = 380,
        C450 = 450,
        C460 = 460
    }
}
