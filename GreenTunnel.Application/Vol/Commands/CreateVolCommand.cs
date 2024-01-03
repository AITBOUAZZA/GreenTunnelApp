using GreenTunnel.Infrastructure.ViewModels;
using GreenTunnel.Infrastructure.ViewModels.Response;

using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenTunnel.Application.Vol.Commands;

public class CreateVolCommand : IRequest<CqrsResponseViewModel>
{
    public CreateVolRequestViewModel Model { get; }

    public CreateVolCommand(CreateVolRequestViewModel model)
    {
        Model = model;
    }
}


