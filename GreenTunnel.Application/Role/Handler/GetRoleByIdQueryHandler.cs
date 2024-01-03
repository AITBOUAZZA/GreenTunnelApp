using AutoMapper;
using GreenTunnel.Application.Role.Queries;
using GreenTunnel.Core.Entities;
using GreenTunnel.Core.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

namespace GreenTunnel.Application.Role.Handlers;

public class GetRoleByIdQueryHandler : IRequestHandler<GetRoleByIdQuery, ApplicationRole>
{
    private readonly IAuthorizationService _authorizationService;
    private readonly ILogger<GetRoleByIdQueryHandler> _logger;
    private readonly IMapper _mapper;
    private readonly IAccountManager _accountManager;
    public GetRoleByIdQueryHandler(IAuthorizationService authorizationService,
        IMapper mapper,
        ILogger<GetRoleByIdQueryHandler> logger,
        IAccountManager accountManager)
    {
        _authorizationService = authorizationService;
        _logger = logger;
        _mapper = mapper;
        _accountManager = accountManager;
    }

    public async Task<ApplicationRole> Handle(GetRoleByIdQuery request, CancellationToken cancellationToken)
    {
        return await _accountManager.GetRoleByIdAsync(request.RoleId);
    }
}