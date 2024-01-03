using AutoMapper;
using GreenTunnel.Application.User.Commands.DeleteUser;
using GreenTunnel.Core.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

namespace GreenTunnel.Application.User.Handlers.Commands;

public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, (bool Succeeded, string[] Errors)>
{
    private readonly IAuthorizationService _authorizationService;
    private readonly ILogger<DeleteUserCommandHandler> _logger;
    private readonly IMapper _mapper;
    private readonly IAccountManager _accountManager;

    public DeleteUserCommandHandler(IAuthorizationService authorizationService,
        IMapper mapper,
        ILogger<DeleteUserCommandHandler> logger,
        IAccountManager accountManager)
    {
        _authorizationService = authorizationService;
        _logger = logger;
        _mapper = mapper;
        _accountManager = accountManager;
    }
    public async Task<(bool Succeeded, string[] Errors)> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        return await _accountManager.DeleteUserAsync(request.User);
    }
}