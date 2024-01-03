using AutoMapper;
using GreenTunnel.Application.User.Queries;
using GreenTunnel.Core.Interfaces;
using GreenTunnel.Infrastructure.Authorization;
using GreenTunnel.Infrastructure.ViewModels;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace GreenTunnel.Application.User.Handlers;

public class GetCurrentUserQueryHandler : IRequestHandler<GetCurrentUserQuery, UserViewModel>
{
    private readonly IAuthorizationService _authorizationService;
    private readonly ILogger<GetCurrentUserQueryHandler> _logger;
    private readonly IMapper _mapper;
    private readonly IAccountManager _accountManager;

    public GetCurrentUserQueryHandler(IAuthorizationService authorizationService,
        IMapper mapper,
        ILogger<GetCurrentUserQueryHandler> logger,
        IAccountManager accountManager)
    {
        _authorizationService = authorizationService;
        _logger = logger;
        _mapper = mapper;
        _accountManager = accountManager;
    }
    public async Task<UserViewModel> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        return await GetUserById(request.Id, request.User);

    }
    private async Task<UserViewModel> GetUserById(string id, ClaimsPrincipal user)
    {

        if (!(await _authorizationService.AuthorizeAsync(user, id, AccountManagementOperations.Read)).Succeeded)
            return null;

        var userVM = await GetUserViewModelHelper(id);

        if (userVM != null)
            return userVM;
        else
            return userVM;
    }
    private async Task<UserViewModel> GetUserViewModelHelper(string userId)
    {
        var userAndRoles = await _accountManager.GetUserAndRolesAsync(userId);
        if (userAndRoles == null)
            return null;

        var userVM = _mapper.Map<UserViewModel>(userAndRoles.Value.User);
        userVM.Roles = userAndRoles.Value.Roles;

        return userVM;
    }
}