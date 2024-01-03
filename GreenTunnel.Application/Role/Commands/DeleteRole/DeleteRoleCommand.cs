using GreenTunnel.Core.Entities;
using MediatR;

namespace GreenTunnel.Application.Role.Commands.DeleteRole;

public class DeleteRoleCommand : IRequest<(bool Succeeded, string[] Errors)>
{
    public ApplicationRole Role { get; set; }
}