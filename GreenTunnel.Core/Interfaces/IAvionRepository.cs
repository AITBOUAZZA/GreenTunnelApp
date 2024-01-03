using GreenTunnel.Core.Entities;
using GreenTunnel.Core.Helpers;
using GreenTunnel.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenTunnel.Core.Interfaces
{

    public interface IAvionRepository : IRepository<Avion>
    {
        Task<Avion> AddAsync(Avion avion);

        Task<List<Avion>> GetAllAvions();

        Task<Avion> GetByIdAsync(int id);
        Task<Avion> GetByIdDetailsAsync(int id);
        //    Task GetByIdDetailsAsync(object testId);
        Task<PagedList<Avion>> GetAvionsAsync(string? sortColumn, string? sortOrder, string? searchTerm, int page, int pageSize);
    }
}


