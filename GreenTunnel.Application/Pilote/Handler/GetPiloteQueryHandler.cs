using AutoMapper;

using GreenTunnel.Application.Test.Queries;
using GreenTunnel.Core.Interfaces;
using GreenTunnel.Infrastructure.ViewModels;

using MediatR;

namespace GreenTunnel.Application.Test.Handler
{
    public class GetPiloteQueryHandler : IRequestHandler<GetPiloteQuery,PiloteViewModel >
    {
        private readonly IPiloteRepository _piloteRepository;
        private readonly IMapper _mapper;


        public GetPiloteQueryHandler(IPiloteRepository piloteRepository,
    IMapper mapper)

        {
            _piloteRepository = piloteRepository;
            _mapper = mapper;
        }
        public async Task<PiloteViewModel> Handle(GetPiloteQuery request, CancellationToken cancellationToken)
        {
            var pilote = await _piloteRepository.GetByIdDetailsAsync(request.NumPilote);
            if (pilote == null) { return null; }
            var piloteViewModel = _mapper.Map<PiloteViewModel>(pilote);
            return piloteViewModel;   
        }
    }
}
