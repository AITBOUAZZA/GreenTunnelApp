using AutoMapper;
using GreenTunnel.Application.Role.Queries;
using GreenTunnel.Core.Helpers;
using GreenTunnel.Core.Interfaces;
using GreenTunnel.Infrastructure.Helpers;
using GreenTunnel.Infrastructure.ViewModels;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

namespace GreenTunnel.Application.Role.Handlers;

public class GetRolesLoadRelatedQueryHandler : IRequestHandler<GetRolesLoadRelatedQuery, PagedList<RoleViewModel>>
{
    private readonly IAuthorizationService _authorizationService;
    private readonly ILogger<GetRolesLoadRelatedQueryHandler> _logger;
    private readonly IMapper _mapper;
    private readonly IAccountManager _accountManager;
    public GetRolesLoadRelatedQueryHandler(IAuthorizationService authorizationService,
        IMapper mapper,
        ILogger<GetRolesLoadRelatedQueryHandler> logger,
        IAccountManager accountManager)
    {
        _authorizationService = authorizationService;
        _logger = logger;
        _mapper = mapper;
        _accountManager = accountManager;
    }
    public async Task<PagedList<RoleViewModel>> Handle(GetRolesLoadRelatedQuery request, CancellationToken cancellationToken)
    {
        var rolesList = await _accountManager.GetRolesLoadRelatedAsync(request.SortColumn, request.SortOrder, request.SearchTerm, request.Page, request.PageSize);
        var factoryViewModels = _mapper.Map<List<RoleViewModel>>(rolesList.Items);

        var pagedList = new PagedList<RoleViewModel>(
            factoryViewModels,
            request.Page,
            request.PageSize,
            rolesList.TotalCount);

        return pagedList;
    }
}