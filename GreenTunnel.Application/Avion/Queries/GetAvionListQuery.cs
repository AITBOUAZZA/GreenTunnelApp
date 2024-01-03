using GreenTunnel.Infrastructure.ViewModels.Response.Avion;
using GreenTunnel.Infrastructure.ViewModels.Response.Test;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenTunnel.Application.Avion.Queries
{
    public class GetAvionListQuery : IRequest<List<GetAvionListReponseModel>>
    {
    }
}
