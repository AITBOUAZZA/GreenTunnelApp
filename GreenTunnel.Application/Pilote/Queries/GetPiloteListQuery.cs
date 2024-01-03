using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using GreenTunnel.Infrastructure.Helpers;

using GreenTunnel.Infrastructure.ViewModels.Response.Test;

using MediatR;

namespace GreenTunnel.Application.Test.Queries
{
    public class GetPiloteListQuery : IRequest<List<GetPilotesListResponseModel>>
    {
    }
}
