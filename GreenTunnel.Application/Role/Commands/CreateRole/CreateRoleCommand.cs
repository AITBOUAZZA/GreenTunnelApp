using GreenTunnel.Core.Entities;
using GreenTunnel.Infrastructure.ViewModels;
using MediatR;

namespace GreenTunnel.Application.Role.Commands.CreateRole;

public class CreateRoleCommand : IRequest<(bool Succeeded, string[] Errors)>
{
    public ApplicationRole Role { get; set; }
    public RoleViewModel RoleView { get; set; }
    public CreateRoleCommand(ApplicationRole role, RoleViewModel roleView)
    {
        Role = role;
        RoleView = roleView;
    }
}