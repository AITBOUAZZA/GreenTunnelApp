using GreenTunnel.Core.Entities;
using MediatR;

namespace GreenTunnel.Application.User.Commands.UpdateUser;

public class UpdateUserPasswordCommand : IRequest<(bool succeeded, string[] errors)>
{
    public ApplicationUser ApplicationUser { get; set; }
    public string CurrentPassword { get; set; }
    public string NewPassword { get; set; }

    public UpdateUserPasswordCommand(ApplicationUser appUser, string currentPassword, string newPassword)
    {
        ApplicationUser = appUser;
        CurrentPassword = currentPassword;
        NewPassword = newPassword;
    }
}