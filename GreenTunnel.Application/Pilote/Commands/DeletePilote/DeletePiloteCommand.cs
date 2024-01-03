
using GreenTunnel.Infrastructure.ViewModels.Response;
using MediatR;

namespace GreenTunnel.Application.Test.Commands.DeleteTest
{
    public class DeletePiloteCommand : IRequest<CqrsResponseViewModel>
    {
        public int NumPilote { get; set; }
    }
}
