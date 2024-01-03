using GreenTunnel.Core.Entities;
using MediatR;

namespace GreenTunnel.Application.Role.Queries;

public class GetRoleLoadRelatedQuery : IRequest<ApplicationRole>
{
    public string RoleName { get; set; }
}