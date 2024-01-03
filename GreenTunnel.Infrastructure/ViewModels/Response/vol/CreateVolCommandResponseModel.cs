using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenTunnel.Infrastructure.ViewModels.Response.vol;

public class CreateVolCommandResponseModel : CqrsResponseViewModel
{
    public string  numvolId { get; set; }
}
