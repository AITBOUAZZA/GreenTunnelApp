using GreenTunnel.Core.Entities;
using MediatR;

namespace GreenTunnel.Application.User.Commands.ResetPassword;

public class ResetPasswordCommands : IRequest<(bool Succeeded, string[] Errors)>
{
    public ApplicationUser User { get; set; }
    public string NewPassword { get; set; }
}