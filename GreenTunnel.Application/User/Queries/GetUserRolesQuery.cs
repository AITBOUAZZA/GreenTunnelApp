using GreenTunnel.Core.Entities;
using MediatR;

namespace GreenTunnel.Application.User.Queries;

public class GetUserRolesQuery : IRequest<IList<string>>
{
    public ApplicationUser ApplicationUser { get; set; }
}