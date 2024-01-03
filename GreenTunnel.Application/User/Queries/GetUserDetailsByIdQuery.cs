using GreenTunnel.Core.Entities;
using MediatR;

namespace GreenTunnel.Application.User.Queries;

public class GetUserDetailsByIdQuery : IRequest<ApplicationUser>
{
    public string Id { get; set; }
}