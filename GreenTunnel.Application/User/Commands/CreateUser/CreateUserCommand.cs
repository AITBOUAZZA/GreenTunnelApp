using GreenTunnel.Core.Entities;
using MediatR;


namespace GreenTunnel.Application.User.Commands.CreateUser;

public class CreateUserCommand : IRequest<(bool Succeeded, string[] Errors)>
{
    public ApplicationUser User { get; set; }
    public IEnumerable<string> Roles { get; set; }
    public string NewPassword { get; set; }
}