using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenTunnel.Infrastructure.ViewModels.Category
{
    public class UpdateCategoryRequestViewModel : CreateICategoryRequestViewModel
    {
        public int Id { get; set; }
    }
}
