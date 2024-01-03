using AutoMapper;
using GreenTunnel.Application.User.Queries;
using GreenTunnel.Core.Entities;
using GreenTunnel.Core.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

namespace GreenTunnel.Application.User.Handlers;

public class GetUserAndRolesQueryHandler : IRequestHandler<GetUserAndRolesQuery, (ApplicationUser User, string[] Roles)?>
{
    private readonly IAuthorizationService _authorizationService;
    private readonly ILogger<GetUserAndRolesQueryHandler> _logger;
    private readonly IMapper _mapper;
    private readonly IAccountManager _accountManager;
    public GetUserAndRolesQueryHandler(IAuthorizationService authorizationService,
        IMapper mapper,
        ILogger<GetUserAndRolesQueryHandler> logger,
        IAccountManager accountManager)
    {
        _authorizationService = authorizationService;
        _logger = logger;
        _mapper = mapper;
        _accountManager = accountManager;
    }
    public async Task<(ApplicationUser User, string[] Roles)?> Handle(GetUserAndRolesQuery request, CancellationToken cancellationToken)
    {
        return await _accountManager.GetUserAndRolesAsync(request.UserId);
    }
}