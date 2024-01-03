using AutoMapper;
using GreenTunnel.Application.Role.Commands.DeleteRole;
using GreenTunnel.Core.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

namespace GreenTunnel.Application.Role.Handler.Commands;

public class DeleteRoleCommandHandler : IRequestHandler<DeleteRoleCommand, (bool Succeeded, string[] Errors)>
{
    private readonly IAuthorizationService _authorizationService;
    private readonly ILogger<DeleteRoleCommandHandler> _logger;
    private readonly IMapper _mapper;
    private readonly IAccountManager _accountManager;
    public DeleteRoleCommandHandler(IAuthorizationService authorizationService,
        IMapper mapper,
        ILogger<DeleteRoleCommandHandler> logger,
        IAccountManager accountManager)
    {
        _authorizationService = authorizationService;
        _logger = logger;
        _mapper = mapper;
        _accountManager = accountManager;
    }
    public async Task<(bool Succeeded, string[] Errors)> Handle(DeleteRoleCommand request, CancellationToken cancellationToken)
    {
        return await _accountManager.DeleteRoleAsync(request.Role);
    }
}