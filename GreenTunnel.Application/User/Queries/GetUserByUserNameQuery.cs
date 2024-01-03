using GreenTunnel.Infrastructure.ViewModels;
using MediatR;
using System.Security.Claims;

namespace GreenTunnel.Application.User.Queries;

public class GetUserByUserNameQuery : IRequest<UserViewModel>
{
    public string UserName { get; set; }
    public ClaimsPrincipal User { get; set; }
}