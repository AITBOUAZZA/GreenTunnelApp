using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenTunnel.Infrastructure.ViewModels.Description
{
    public class UpdateDescriptionRequestViewModel: CreateDescriptionRequestViewModel
    {
        public int Id { get; set; }
    }
}
