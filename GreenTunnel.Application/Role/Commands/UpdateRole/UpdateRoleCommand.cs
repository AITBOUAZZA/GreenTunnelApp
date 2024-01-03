using GreenTunnel.Core.Entities;
using GreenTunnel.Infrastructure.ViewModels;
using MediatR;

namespace GreenTunnel.Application.Role.Commands.UpdateRole;

public class UpdateRoleCommand : IRequest<(bool Succeeded, string[] Errors)>
{
    public ApplicationRole User { get; set; }
    public RoleViewModel Role { get; set; }
    public UpdateRoleCommand(ApplicationRole user, RoleViewModel role)
    {
        User = user;
        Role = role;
    }

}