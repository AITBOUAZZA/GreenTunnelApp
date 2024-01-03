using GreenTunnel.Core.Entities;
using GreenTunnel.Core.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GreenTunnel.Core.Interfaces;

public interface IClientRepository : IRepository<Client>
{
    Task<Client> GetByIdAsync(int id);
    Task<Client> GetByIdDetailsAsync(int id);

    Task<Client> AddAsync(Client client);
    Task<List<Client>> GetAllClients();
    Task<PagedList<Client>> GetClientsAsync(string? sortColumn, string? sortOrder, string? searchTerm, int? employeid, int page, int pageSize);

}


