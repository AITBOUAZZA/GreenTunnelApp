using GreenTunnel.Core.Helpers;
using GreenTunnel.Infrastructure.Helpers;
using GreenTunnel.Infrastructure.ViewModels;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenTunnel.Application.Avion.Queries
{
    public class GetAllAvionQuery : IRequest<PagedList<AvionViewModel>>
    {
        //public int PageSize { get; internal set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public string? SearchTerm { get; set; }
        public string? SortColumn { get; set; }
        public string? SortOrder { get; set; }
    }
}
