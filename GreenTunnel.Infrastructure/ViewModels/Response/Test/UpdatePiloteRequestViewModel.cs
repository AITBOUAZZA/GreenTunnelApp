using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenTunnel.Infrastructure.ViewModels.Response.Test
{
    public class UpdatePiloteRequestViewModel
    {

        public int NumPilote { get; set; }
        [Required]
        public string NomPilote { get; set; }

        public string Adresse { get; set; }
    }
}
