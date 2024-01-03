using GreenTunnel.Core.Entities;
using GreenTunnel.Core.Helpers;

namespace GreenTunnel.Core.Interfaces
{
    public interface IPiloteRepository : IRepository<Pilote>
    {

        Task<Pilote> AddAsync(Pilote pilote);

        Task<List<Pilote>> GetAllPilotes();

        Task<Pilote> GetByIdAsync(int id);
        Task<Pilote> GetByIdDetailsAsync(int id);
    //    Task GetByIdDetailsAsync(object testId);
        Task<PagedList<Pilote>> GetPilotesAsync(string? sortColumn, string? sortOrder, string? searchTerm, int page, int pageSize);

    }
}
