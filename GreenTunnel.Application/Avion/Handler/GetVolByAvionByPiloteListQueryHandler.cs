using AutoMapper;
using GreenTunnel.Application.Avion.Queries;
using GreenTunnel.Core.Interfaces;
using GreenTunnel.Infrastructure.Helpers;
using GreenTunnel.Infrastructure.Repositories;
using GreenTunnel.Infrastructure.ViewModels;
using GreenTunnel.Infrastructure.ViewModels.Response.Avion;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenTunnel.Application.Avion.Handler
{
    public class GetVolByAvionByPiloteListQueryHandler : IRequestHandler<GetVolByAvionByPiloteListQuery, List<GetVolByAvionByPiloteListReponseModel>>
    {
        private readonly IVolRepository _volRepository;
        private readonly IMapper _mapper;
        public GetVolByAvionByPiloteListQueryHandler(IVolRepository volRepository, IMapper mapper
       )

        {
            _volRepository = volRepository;
            _mapper = mapper;
        }

        public async Task<List<GetVolByAvionByPiloteListReponseModel>> Handle(GetVolByAvionByPiloteListQuery request, CancellationToken cancellationToken)
        {
            var avionList = await _volRepository.getVolsByAvionAndPilote(request.avionId, request.piloteId);

            try
            {
                var VolByPiloteByAvion = _mapper.Map<List<GetVolByAvionByPiloteListReponseModel>>(avionList);

                return VolByPiloteByAvion;
            }
            catch (Exception ex) { }

            return null;
        }

       
    }
}
