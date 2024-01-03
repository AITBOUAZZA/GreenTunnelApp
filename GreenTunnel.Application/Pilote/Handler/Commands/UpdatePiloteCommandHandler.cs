
using GreenTunnel.Application.Test.Commands.UpdateTest;
using GreenTunnel.Core.Interfaces;
using GreenTunnel.Infrastructure.ViewModels.Response;

using MediatR;

namespace GreenTunnel.Application.Test.Handler.Commands
{
    public class UpdatePiloteCommandHandler : IRequestHandler<UpdatePiloteCommand, CqrsResponseViewModel>
    {


        private readonly IPiloteRepository _piloteRepository;
       

        public UpdatePiloteCommandHandler(IPiloteRepository testRepository)
        {
            _piloteRepository = testRepository;
           

        }

        public async Task<CqrsResponseViewModel> Handle(UpdatePiloteCommand request, CancellationToken cancellationToken)
        {
            var pilote = await _piloteRepository.GetSingleOrDefaultAsync(f => f.NumPilote == request.Model.NumPilote);

            if (pilote == null)
            {
                return null;
            }

            pilote.NomPilote = request.Model.NomPilote;
            pilote.Adresse = request.Model.Adresse;





            _piloteRepository.Update(pilote);

            return new CqrsResponseViewModel(); // Return an appropriate response
        }
    }
}
