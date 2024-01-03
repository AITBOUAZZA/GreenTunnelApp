using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenTunnel.Infrastructure.ViewModels.InputType
{
    public class UpdateInputTypeRequestViewModel: CreateInputTypeRequestViewModel
    {
        public int Id { get; set; }
    }
}
