using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using GreenTunnel.Infrastructure.ViewModels;

using MediatR;

namespace GreenTunnel.Application.Test.Queries
{
    public class GetPiloteQuery : IRequest<PiloteViewModel>
    {
        public int NumPilote { get; set; }
    }
}
