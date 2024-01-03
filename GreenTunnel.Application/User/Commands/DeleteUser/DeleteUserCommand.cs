using GreenTunnel.Core.Entities;
using MediatR;

namespace GreenTunnel.Application.User.Commands.DeleteUser;

public class DeleteUserCommand : IRequest<(bool Succeeded, string[] Errors)>
{
    public ApplicationUser User { get; set; }
}