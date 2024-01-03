using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenTunnel.Infrastructure.ViewModels.Response.Test
{
    public class CreatePiloteCommandResponseModel : CqrsResponseViewModel
    {
        public int NumPilote { get; set; }
    }
}
