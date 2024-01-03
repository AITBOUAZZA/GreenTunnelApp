using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenTunnel.Core.Entities;

public class Client : AuditableEntity
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public virtual ICollection<Client> Clients { get; set; }
    public int EmployeId { get; set; }
    [ForeignKey("EmployeId")]
    public virtual Employe Employe { get; set; }
    public string UserId { get; set; }
    public Client()
    {
        Clients = new List<Client>();
    }
}
