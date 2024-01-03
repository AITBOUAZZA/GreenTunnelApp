
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenTunnel.Infrastructure.ViewModels.Response.Employe
{
    public class EmployeViewModel
    {

        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }
        public string Mobile { get; set; }
        public string Phone { get; set; }
        public string Support { get; set; }
        public List<ClientViewModel> Clients { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public string CreatedBy { get; set; }

    }

    public class ClientViewModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public int EmployeId { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string Description { get; set; }

        public string UpdatedBy { get; set; }
        public string CreatedBy { get; set; }
        public string EmployeName { get; set; }
      
    }
}
