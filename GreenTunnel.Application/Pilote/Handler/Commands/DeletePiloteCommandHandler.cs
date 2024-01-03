
using GreenTunnel.Application.Test.Commands.DeleteTest;
using GreenTunnel.Core.Interfaces;
using GreenTunnel.Infrastructure.ViewModels.Response;

using MediatR;

namespace GreenTunnel.Application.Test.Handler.Commands
{
    public class DeletePiloteCommandHandler : IRequestHandler<DeletePiloteCommand, CqrsResponseViewModel>
    {

        private readonly IPiloteRepository _piloteRepository;


        public DeletePiloteCommandHandler(IPiloteRepository piloteRepository)
        {
            _piloteRepository = piloteRepository;

        }

        public async Task<CqrsResponseViewModel> Handle(DeletePiloteCommand request, CancellationToken cancellationToken)
        {
            var pilote = await _piloteRepository.GetSingleOrDefaultAsync(f => f.NumPilote == request.NumPilote);

            if (pilote == null)
            {
                return null;
            }

            _piloteRepository.Remove(pilote);

            return new CqrsResponseViewModel(); // Return an appropriate response
        }
    }
}
