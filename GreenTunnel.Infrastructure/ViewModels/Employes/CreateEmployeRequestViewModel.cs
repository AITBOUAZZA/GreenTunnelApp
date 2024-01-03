using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenTunnel.Infrastructure.ViewModels.Employes;

public class CreateEmployeRequestViewModel
{

    [Required]
    public string Name { get; set; }
    public string Description { get; set; }
    public string Address { get; set; }
    public string Logo { get; set; }
    public string Phone { get; set; }
    public string Mobile { get; set; }
    public string Email { get; set; }
    public string Support { get; set; }
    public string UserId { get; set; }
    public string CreatedBy { get; set; }
    public List<int> ClientIds { get; set; }
    public CreateEmployeRequestViewModel()
    {
        ClientIds = new List<int>();
    }
}
