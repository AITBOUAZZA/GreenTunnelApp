using AutoMapper;
using GreenTunnel.Application.User.Commands.CreateUser;
using GreenTunnel.Core.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

namespace GreenTunnel.Application.User.Handlers.Commands;

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, (bool Succeeded, string[] Errors)>
{
    private readonly IAuthorizationService _authorizationService;
    private readonly ILogger<CreateUserCommandHandler> _logger;
    private readonly IMapper _mapper;
    private readonly IAccountManager _accountManager;

    public CreateUserCommandHandler(IAuthorizationService authorizationService,
        IMapper mapper,
        ILogger<CreateUserCommandHandler> logger,
        IAccountManager accountManager)
    {
        _authorizationService = authorizationService;
        _logger = logger;
        _mapper = mapper;
        _accountManager = accountManager;
    }
    public async Task<(bool Succeeded, string[] Errors)> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        return await _accountManager.CreateUserAsync(request.User, request.Roles, request.NewPassword);
    }
}