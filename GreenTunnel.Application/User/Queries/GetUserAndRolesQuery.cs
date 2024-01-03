using GreenTunnel.Core.Entities;
using MediatR;

namespace GreenTunnel.Application.User.Queries;

public class GetUserAndRolesQuery : IRequest<(ApplicationUser User, string[] Roles)?>
{
    public string UserId { get; set; }
}