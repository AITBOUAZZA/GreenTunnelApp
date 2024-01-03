using GreenTunnel.Core.Entities;
using MediatR;

namespace GreenTunnel.Application.User.Commands.UpdateUser;

public class UpdateUserCommand : IRequest<(bool Succeeded, string[] Errors)>
{
    public ApplicationUser ApplicationUser { get; set; }
    public IEnumerable<string> Roles { get; set; }

    public UpdateUserCommand(ApplicationUser appUser, IEnumerable<string> roles)
    {
        ApplicationUser = appUser;
        Roles = roles;
    }
}