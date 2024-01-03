using AutoMapper;


using GreenTunnel.Application.Test.Queries;
using GreenTunnel.Core.Helpers;
using GreenTunnel.Core.Interfaces;
using GreenTunnel.Infrastructure.Helpers;
using GreenTunnel.Infrastructure.ViewModels;

using MediatR;




namespace GreenTunnel.Application.Test.Handler
{
    public class GetAllPiloteQueryHandler : IRequestHandler<GetAllPiloteQuery, PagedList<PiloteViewModel>>
    {
        private readonly IPiloteRepository _piloteRepository;
        private readonly IMapper _mapper;
        //private readonly IWorkplaceRepository _workplaceRepository;

        public GetAllPiloteQueryHandler(
            IPiloteRepository piloteRepository,
              IMapper mapper)
            //IWorkplaceRepository workplaceRepository)
        {
            _piloteRepository = piloteRepository;
            _mapper = mapper;
         //_workplaceRepository = workplaceRepository;
        }
        public async Task<PagedList<PiloteViewModel>> Handle(GetAllPiloteQuery request, CancellationToken cancellationToken)
        {
            var pilotesList = await _piloteRepository.GetPilotesAsync(request.SortColumn, request.SortOrder, request.SearchTerm, request.PageNumber, request.PageSize);

            var piloteViewModels = _mapper.Map<List<PiloteViewModel>>(pilotesList.Items);

            var pagedList = new PagedList<PiloteViewModel>(
                piloteViewModels,
                request.PageNumber,
                request.PageSize,
                pilotesList.TotalCount);
            return pagedList;


        }
    }
}
