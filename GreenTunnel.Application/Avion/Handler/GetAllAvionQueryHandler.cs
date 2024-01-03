using AutoMapper;
using GreenTunnel.Application.Avion.Queries;
using GreenTunnel.Application.Test.Queries;
using GreenTunnel.Core.Helpers;
using GreenTunnel.Core.Interfaces;
using GreenTunnel.Infrastructure.Helpers;
using GreenTunnel.Infrastructure.Repositories;
using GreenTunnel.Infrastructure.ViewModels;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace GreenTunnel.Application.Avion.Handler
{
    public class GetAllAvionQueryHandler : IRequestHandler<GetAllAvionQuery, PagedList<AvionViewModel>>
    {
        private readonly IAvionRepository _avionRepository;
        private readonly IMapper _mapper;
        //private readonly IWorkplaceRepository _workplaceRepository;

        public GetAllAvionQueryHandler(
            IAvionRepository avionRepository,
              IMapper mapper)
            //IWorkplaceRepository workplaceRepository)
        {
            _avionRepository = avionRepository;
            _mapper = mapper;
            //_workplaceRepository = workplaceRepository;
        }
        public async Task<PagedList<AvionViewModel>> Handle(GetAllAvionQuery request, CancellationToken cancellationToken)
        {
            var avionList = await _avionRepository.GetAvionsAsync(request.SortColumn, request.SortOrder, request.SearchTerm, request.PageNumber, request.PageSize);

            var avionViewModels = _mapper.Map<List<AvionViewModel>>(avionList.Items);

            var pagedList = new PagedList<AvionViewModel>(
                avionViewModels,
                request.PageNumber,
                request.PageSize,
                avionList.TotalCount);
            return pagedList;


        }

      
    }
}
