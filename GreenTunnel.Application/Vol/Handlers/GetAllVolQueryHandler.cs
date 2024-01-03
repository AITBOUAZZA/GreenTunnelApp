using AutoMapper;
using GreenTunnel.Application.Vol.Queries;
using GreenTunnel.Core.Helpers;
using GreenTunnel.Core.Interfaces;
using GreenTunnel.Infrastructure.Helpers;
using GreenTunnel.Infrastructure.ViewModels;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenTunnel.Application.Vol.Handlers;

public class GetAllVOlQueryHandler : IRequestHandler<GetAllVolQuery, PagedList<VolViewModel>>
{
    private readonly IVolRepository _volRepository;
    private readonly IMapper _mapper;
 

   

    public GetAllVOlQueryHandler(
        IVolRepository volRepository,
        IMapper mapper)
       
    {
        _volRepository = volRepository;
        _mapper = mapper;
     
    }
    public async Task<PagedList<VolViewModel>> Handle(GetAllVolQuery request, CancellationToken cancellationToken)
    {
        var volList = await _volRepository.GetVolsAsync(request.SortColumn, request.SortOrder, request.SearchTerm, request.VolId, request.PageNumber, request.PageSize);

        var volViewModels = _mapper.Map<List<VolViewModel>>(volList.Items);

        var pagedList = new PagedList<VolViewModel>(
            volViewModels,
            request.PageNumber,
            request.PageSize,
            volList.TotalCount);

        return pagedList;
    }

}