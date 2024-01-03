using AutoMapper;
using GreenTunnel.Application.User.Commands.UpdateUser;
using GreenTunnel.Core.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

namespace GreenTunnel.Application.User.Handlers.Commands;

public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, (bool succeeded, string[] errors)>
{
    private readonly IAuthorizationService _authorizationService;
    private readonly ILogger<UpdateUserCommandHandler> _logger;
    private readonly IMapper _mapper;
    private readonly IAccountManager _accountManager;
    public UpdateUserCommandHandler(IAuthorizationService authorizationService,
        IMapper mapper,
        ILogger<UpdateUserCommandHandler> logger,
        IAccountManager accountManager)
    {
        _authorizationService = authorizationService;
        _logger = logger;
        _mapper = mapper;
        _accountManager = accountManager;
    }
    public async Task<(bool succeeded, string[] errors)> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        return await _accountManager.UpdateUserAsync(request.ApplicationUser);
    }
}