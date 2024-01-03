using GreenTunnel.Core.Entities;
using MediatR;

namespace GreenTunnel.Application.Role.Queries;

public class GetRoleByIdQuery : IRequest<ApplicationRole>
{
    public string RoleId { get; set; }
}