using GreenTunnel.Core.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenTunnel.Infrastructure.ViewModels.Description
{
    public class CreateDescriptionRequestViewModel
    {
        public string Name { get; set; }
        public int Order { get; set; }
        public int CategoryId { get; set; }
        public int InputTypeId { get; set; }
    }
}
