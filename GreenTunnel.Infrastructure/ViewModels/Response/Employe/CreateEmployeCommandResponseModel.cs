using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenTunnel.Infrastructure.ViewModels.Response.Employe;

public class CreateEmployeCommandResponseModel : CqrsResponseViewModel
{
    public int EmployeId { get; set; }
}
