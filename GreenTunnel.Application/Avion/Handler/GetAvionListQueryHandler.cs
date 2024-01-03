using AutoMapper;
using GreenTunnel.Application.Avion.Queries;
using GreenTunnel.Application.Test.Queries;
using GreenTunnel.Core.Interfaces;
using GreenTunnel.Infrastructure.Repositories;
using GreenTunnel.Infrastructure.ViewModels;
using GreenTunnel.Infrastructure.ViewModels.Response.Avion;
using GreenTunnel.Infrastructure.ViewModels.Response.Test;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenTunnel.Application.Avion.Handler
{
    public class GetAvionListQueryHandler : IRequestHandler<GetAvionListQuery, List<GetAvionListReponseModel>>

    {
        private readonly IAvionRepository _avionRepository;
        private readonly IMapper _mapper;
        public GetAvionListQueryHandler(IAvionRepository avionRepository,
          IMapper mapper)

        {
            _avionRepository = avionRepository;
            _mapper = mapper;
        }

        public async Task<List<GetAvionListReponseModel>> Handle(GetAvionListQuery request, CancellationToken cancellationToken)
        {
            var avionList = await _avionRepository.GetAllAvions();

            try
            {
                var avionViewModel = _mapper.Map<List<GetAvionListReponseModel>>(avionList);

                return avionViewModel;
            }
            catch (Exception ex) { }

            return null;
        }
    }
}
