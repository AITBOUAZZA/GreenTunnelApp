

using MediatR;

namespace GreenTunnel.Application.Test.Queries
{
    public class GetDuplicatePiloteQuery : IRequest<bool>
    
    {
        public string Name { get; set; }
        public int TestId { get; set; }
    }
}
