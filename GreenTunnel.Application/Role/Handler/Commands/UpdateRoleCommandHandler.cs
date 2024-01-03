using AutoMapper;
using GreenTunnel.Application.Role.Commands.UpdateRole;
using GreenTunnel.Core.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using System.Data;

namespace GreenTunnel.Application.Role.Handlers.Commands;

public class UpdateRoleCommandHandler : IRequestHandler<UpdateRoleCommand, (bool Succeeded, string[] Errors)>
{
    private readonly IAuthorizationService _authorizationService;
    private readonly ILogger<UpdateRoleCommandHandler> _logger;
    private readonly IMapper _mapper;
    private readonly IAccountManager _accountManager;
    public UpdateRoleCommandHandler(IAuthorizationService authorizationService,
        IMapper mapper,
        ILogger<UpdateRoleCommandHandler> logger,
        IAccountManager accountManager)
    {
        _authorizationService = authorizationService;
        _logger = logger;
        _mapper = mapper;
        _accountManager = accountManager;
    }
    public async Task<(bool Succeeded, string[] Errors)> Handle(UpdateRoleCommand request, CancellationToken cancellationToken)
    {
        return await _accountManager.UpdateRoleAsync(request.User, request.Role.Permissions.Select(p => p.Value).ToArray());
    }
}