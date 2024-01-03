using AutoMapper;
using GreenTunnel.Application.User.Queries;
using GreenTunnel.Core.Helpers;
using GreenTunnel.Core.Interfaces;
using GreenTunnel.Infrastructure.Helpers;
using GreenTunnel.Infrastructure.ViewModels;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

namespace GreenTunnel.Application.User.Handlers;

public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, PagedList<UserViewModel>>
{

    private readonly IAuthorizationService _authorizationService;
    private readonly ILogger<GetUsersQueryHandler> _logger;
    private readonly IMapper _mapper;
    private readonly IAccountManager _accountManager;

    public GetUsersQueryHandler(IAuthorizationService authorizationService,
        IMapper mapper,
        ILogger<GetUsersQueryHandler> logger,
        IAccountManager accountManager)
    {
        _authorizationService = authorizationService;
        _logger = logger;
        _mapper = mapper;
        _accountManager = accountManager;
    }
    public async Task<PagedList<UserViewModel>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        var usersAndRoles = await _accountManager.GetUsersAndRolesAsync(request.PageNumber, request.PageSize, request.SortColumn, request.SortOrder, request.SearchTerm);
        //var factoryViewModels = _mapper.Map<List<UserViewModel>>(usersAndRoles.Items);

        var usersVM = new List<UserViewModel>();

        foreach (var item in usersAndRoles.Items)
        {
            var userVM = _mapper.Map<UserViewModel>(item.User);
            userVM.Roles = item.Roles;

            usersVM.Add(userVM);
        }
        var pagedList = new PagedList<UserViewModel>(
            usersVM,
            request.PageNumber,
            request.PageSize,
            usersAndRoles.TotalCount);

        return pagedList;

    }
}