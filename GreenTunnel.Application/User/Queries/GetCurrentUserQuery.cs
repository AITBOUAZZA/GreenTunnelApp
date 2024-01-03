using GreenTunnel.Infrastructure.ViewModels;
using MediatR;
using System.Security.Claims;

namespace GreenTunnel.Application.User.Queries;

public class GetCurrentUserQuery : IRequest<UserViewModel>
{
    public string Id { get; set; }
    public ClaimsPrincipal User { get; set; }
}