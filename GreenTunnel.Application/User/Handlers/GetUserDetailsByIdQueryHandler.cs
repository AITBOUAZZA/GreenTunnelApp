using AutoMapper;
using GreenTunnel.Application.User.Queries;
using GreenTunnel.Core.Entities;
using GreenTunnel.Core.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

namespace GreenTunnel.Application.User.Handlers;

public class GetUserDetailsByIdQueryHandler : IRequestHandler<GetUserDetailsByIdQuery, ApplicationUser>
{
    private readonly IAuthorizationService _authorizationService;
    private readonly ILogger<GetUserDetailsByIdQueryHandler> _logger;
    private readonly IMapper _mapper;
    private readonly IAccountManager _accountManager;

    public GetUserDetailsByIdQueryHandler(IAuthorizationService authorizationService,
        IMapper mapper,
        ILogger<GetUserDetailsByIdQueryHandler> logger,
        IAccountManager accountManager)
    {
        _authorizationService = authorizationService;
        _logger = logger;
        _mapper = mapper;
        _accountManager = accountManager;
    }
    public async Task<ApplicationUser> Handle(GetUserDetailsByIdQuery request, CancellationToken cancellationToken)
    {
        return await _accountManager.GetUserByIdAsync(request.Id);
    }
}