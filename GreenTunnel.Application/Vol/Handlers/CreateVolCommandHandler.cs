using GreenTunnel.Application.Vol.Commands;
using GreenTunnel.Core.Entities;
using GreenTunnel.Core.Interfaces;
using GreenTunnel.Infrastructure.Repositories;
using GreenTunnel.Infrastructure.ViewModels.Response;
using GreenTunnel.Infrastructure.ViewModels.Response.vol;

using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenTunnel.Application.Vol.Handlers;

public class CreateVolCommandHandler : IRequestHandler<CreateVolCommand, CqrsResponseViewModel>
{

    private readonly IVolRepository _volRepository;
  

    public CreateVolCommandHandler(
        IVolRepository volRepository)
      
    {
        _volRepository = volRepository;
        
    }

    public async Task<CqrsResponseViewModel> Handle(CreateVolCommand request, CancellationToken cancellationToken)
    {

        var VolModel = new Core.Entities.Vol()
        {
            NumVol = request.Model.NumVol,
            NumPilote = request.Model.NumPilote,
            NumAvion = request.Model.NumAvion,
            VilleDep = request.Model.VilleDep,
            VilleArr = request.Model.VilleArr,
            HeureDep = request.Model.HeureDep,
             HeureArr = request.Model.HeureArr,


};

         var volResult = await _volRepository.AddAsync(VolModel);
        return new CreateVolCommandResponseModel
        {
            numvolId = volResult.NumVol
        };

 


      
    }


}
