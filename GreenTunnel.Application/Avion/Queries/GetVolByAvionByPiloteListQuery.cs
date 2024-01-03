using GreenTunnel.Infrastructure.ViewModels.Response.Avion;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenTunnel.Application.Avion.Queries
{
    public class GetVolByAvionByPiloteListQuery : IRequest<List<GetVolByAvionByPiloteListReponseModel>>
    {
        public string? avionId { get; set; }
        public string? piloteId { get; set; }
    }
}
