
using GreenTunnel.Application.Test.Commands.CreateTest;
using GreenTunnel.Core.Interfaces;
using GreenTunnel.Infrastructure.Repositories;
using GreenTunnel.Infrastructure.ViewModels.Response;
using GreenTunnel.Infrastructure.ViewModels.Response.Test;

using MediatR;

namespace GreenTunnel.Application.Test.Handler.Commands
{
    public class CreateTestTypeCommandHandler : IRequestHandler<CreatePiloteCommand, CqrsResponseViewModel>
    {

        private readonly IPiloteRepository _piloteRepository;
       
      

        public CreateTestTypeCommandHandler(IPiloteRepository piloteRepository)
        {
            _piloteRepository = piloteRepository;
           
          
        }


        public async Task<CqrsResponseViewModel> Handle(CreatePiloteCommand request, CancellationToken cancellationToken)
        {
            var PiloteModel = new GreenTunnel.Core.Entities.Pilote
            {
                Adresse = request.Model.Adresse,
               NomPilote = request.Model.NomPilote

            };


            var piloteResult = await _piloteRepository.AddAsync(PiloteModel);
            return new CreatePiloteCommandResponseModel
            {
                NumPilote = PiloteModel.NumPilote
            };
        }
    }
}

