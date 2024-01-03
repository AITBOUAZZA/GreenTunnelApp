using GreenTunnel.Infrastructure.ViewModels.Response.Test;
using GreenTunnel.Infrastructure.ViewModels.Response;
using MediatR;

namespace GreenTunnel.Application.Test.Commands.UpdateTest
{
    public class UpdatePiloteCommand : IRequest<CqrsResponseViewModel>
    {
        public UpdatePiloteRequestViewModel Model { get; set; }
    }
}
