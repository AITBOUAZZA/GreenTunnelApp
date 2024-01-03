
using AutoMapper;

using GreenTunnel.Application.Test.Queries;

using GreenTunnel.Core.Interfaces;
using GreenTunnel.Infrastructure.ViewModels.Response.Test;
using MediatR;

namespace GreenTunnel.Application.Test.Handler
{
    public class GetPiloteListQueryHandler : IRequestHandler<GetPiloteListQuery, List<GetPilotesListResponseModel>>
    {
        private readonly IPiloteRepository _piloteRepository;
        private readonly IMapper _mapper;

        public GetPiloteListQueryHandler(IPiloteRepository piloteRepository,
            IMapper mapper)

        {
            _piloteRepository = piloteRepository;
            _mapper = mapper;
        }
        public async Task<List<GetPilotesListResponseModel>> Handle(GetPiloteListQuery request, CancellationToken cancellationToken)
        {
            var pilotesList = await _piloteRepository.GetAllPilotes();

            try
            {
                var piloteViewModel = _mapper.Map<List<GetPilotesListResponseModel>>(pilotesList);

                return piloteViewModel;
            }catch(Exception ex) { }

            return null;
        }
    }
}
