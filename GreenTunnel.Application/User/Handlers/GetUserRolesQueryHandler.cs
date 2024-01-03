using AutoMapper;
using GreenTunnel.Application.User.Queries;
using GreenTunnel.Core.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

namespace GreenTunnel.Application.User.Handlers;

public class GetUserRolesQueryHandler : IRequestHandler<GetUserRolesQuery, IList<string>>
{
    private readonly IAuthorizationService _authorizationService;
    private readonly ILogger<GetUserRolesQueryHandler> _logger;
    private readonly IMapper _mapper;
    private readonly IAccountManager _accountManager;

    public GetUserRolesQueryHandler(IAuthorizationService authorizationService,
        IMapper mapper,
        ILogger<GetUserRolesQueryHandler> logger,
        IAccountManager accountManager)
    {
        _authorizationService = authorizationService;
        _logger = logger;
        _mapper = mapper;
        _accountManager = accountManager;
    }
    public async Task<IList<string>> Handle(GetUserRolesQuery request, CancellationToken cancellationToken)
    {
        return await _accountManager.GetUserRolesAsync(request.ApplicationUser);
    }
}