
using GreenTunnel.Infrastructure.ViewModels.Response;
using GreenTunnel.Infrastructure.ViewModels;
using MediatR;
using GreenTunnel.Infrastructure.ViewModels.Response.Test;

namespace GreenTunnel.Application.Test.Commands.CreateTest
{
    public class CreatePiloteCommand : IRequest<CqrsResponseViewModel>
    {

        public CreatePiloteRequestViewModel Model { get; set; }


        public CreatePiloteCommand(CreatePiloteRequestViewModel model)
        {
            this.Model = model;
        }
    }
}
