using GreenTunnel.Core.Entities;
using MediatR;

namespace GreenTunnel.Application.User.Queries;

public class CheckPasswordQuery : IRequest<bool>
{
    public ApplicationUser User { get; set; }
    public string CurrentPassword { get; set; }
}