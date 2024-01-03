using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using AutoMapper;

using GreenTunnel.Application.Test.Queries;
using GreenTunnel.Core.Interfaces;
using GreenTunnel.Infrastructure.Repositories;

using MediatR;

namespace GreenTunnel.Application.Test.Handler.Commands
{

    public class GetDuplicatePiloteQueryHandler : IRequestHandler<GetDuplicatePiloteQuery, bool>
    {
            private readonly IPiloteRepository _testRepository;
        private readonly IMapper _mapper;

        public GetDuplicatePiloteQueryHandler(IPiloteRepository testRepository)

        {
            _testRepository = testRepository;
        }
        public async Task<bool> Handle(GetDuplicatePiloteQuery request, CancellationToken cancellationToken)
        {
            //// Check for duplicate Factory with the same name but a different ID
            //var existingTest = await _testRepository.GetSingleOrDefaultAsync(f => f.Name.Contains(request.Name) && f.Id == request.TestId);
            //if (request.TestId > 0)
            //{
            //    if (existingTest != null)
            //    {
            //        // A duplicate Factory was found with a different ID, return false
            //        return false;
            //    }
            //    else
            //    {
            //        existingTest = await _testRepository.GetSingleOrDefaultAsync(f => f.Name.Equals(request.Name) && f.Id != request.TestId);
            //        if (existingTest != null)
            //        {
            //            // A duplicate Factory was found with a different ID, return false
            //            return true;
            //        }
            //    }
            //}
            //else
            //{
            //    existingTest = await _testRepository.GetSingleOrDefaultAsync(f => f.Name.Equals(request.Name) && f.Id != request.TestId);
            //    if (existingTest != null)
            //    {
            //        // A duplicate Factory was found with a different ID, return false
            //        return true;
            //    }
            //}
            return true;
        }
    }
}
