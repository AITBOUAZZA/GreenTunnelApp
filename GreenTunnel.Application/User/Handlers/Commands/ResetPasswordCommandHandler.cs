using AutoMapper;
using GreenTunnel.Application.User.Commands.ResetPassword;
using GreenTunnel.Core.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

namespace GreenTunnel.Application.User.Handlers.Commands;

internal class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommands, (bool Succeeded, string[] Errors)>
{
    private readonly IAuthorizationService _authorizationService;
    private readonly ILogger<ResetPasswordCommandHandler> _logger;
    private readonly IMapper _mapper;
    private readonly IAccountManager _accountManager;

    public ResetPasswordCommandHandler(IAuthorizationService authorizationService,
        IMapper mapper,
        ILogger<ResetPasswordCommandHandler> logger,
        IAccountManager accountManager)
    {
        _authorizationService = authorizationService;
        _logger = logger;
        _mapper = mapper;
        _accountManager = accountManager;
    }
    public async Task<(bool Succeeded, string[] Errors)> Handle(ResetPasswordCommands request, CancellationToken cancellationToken)
    {
        return await _accountManager.ResetPasswordAsync(request.User, request.NewPassword);
    }
}