using GreenTunnel.Core.Entities;
using GreenTunnel.Core.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace GreenTunnel.Core.Interfaces
{
    public interface IVolRepository : IRepository<Vol>
    {
    
        Task<Vol> AddAsync(Vol vol);

        Task<List<Vol>> GetAllVols();

        Task<Vol> GetByIdAsync(int id);
        Task<Vol> GetByIdDetailsAsync(int id);
        Task<List<Vol>> getVolsByAvionAndPilote(string avionId, string piloteId);
        Task<PagedList<Vol>> GetVolsAsync(string? sortColumn, string? sortOrder, string? searchTerm, int? volId, int page, int pageSize);
    }
}
