using GreenTunnel.Core.Entities;
using GreenTunnel.Core.Helpers;
using GreenTunnel.Core.Interfaces;
using GreenTunnel.Infrastructure.Helpers;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace GreenTunnel.Infrastructure.Repositories;

public class ClientRepository : Repository<Client>, IClientRepository
{
    private ApplicationDbContext _appContext;

    public ClientRepository(ApplicationDbContext context) : base(context)
    {
        _appContext = context;
    }

    public async Task<Client> GetByIdAsync(int id)
    {
        return await _appContext.Clients.FindAsync(id);
    }

    public async Task<Client> GetByIdDetailsAsync(int id)
    {
        return await _appContext.Clients
            .Include(w => w.Clients)
            .FirstOrDefaultAsync(w => w.Id == id);
    }

    public async Task<Client> AddAsync(Client client)
    {
        _appContext.Clients.Add(client);
        await _appContext.SaveChangesAsync();
        return client;
    }

    public async Task<List<Client>> GetAllClients()
    {
        IQueryable<Client> clients = _appContext.Clients
            .AsSingleQuery()
            .OrderBy(r => r.CreatedDate);
        var clientsList = await clients.ToListAsync();

        return clientsList;
    }
    public async Task<PagedList<Client>> GetClientsAsync(string? sortColumn, string? sortOrder, string? searchTerm, int? employid, int page, int pageSize)
    {
        IQueryable<Client> clientsQuery = _appContext.Clients;

        if (employid > 0)
        {
            clientsQuery = _appContext.Clients.Where(m => m.EmployeId == employid)
                .Include(r => r.Clients)
                .AsSingleQuery()
                .OrderBy(r => r.CreatedDate);
        }
        else
        {
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                clientsQuery = clientsQuery.Where(p => p.Name.Contains(searchTerm));
            }

            if (sortOrder?.ToLower() == "desc")
            {
                clientsQuery = clientsQuery.OrderByDescending(GetSortProperty(sortColumn));
            }
            else
            {
                clientsQuery = clientsQuery.OrderBy(GetSortProperty(sortColumn));
            }
            clientsQuery = clientsQuery.Include(r => r.Clients).Include(m => m.Employe)
                .AsSingleQuery()
                .OrderBy(r => r.CreatedDate);
        }





        var clientListResponsesQuery = clientsQuery;
        var clientResult = await PagedList<Client>.CreateAsync(clientListResponsesQuery, page, pageSize);

        return clientResult;
    }


    private static Expression<Func<Client, object>> GetSortProperty(string sortColumn)
    {
        return sortColumn?.ToLower() switch
        {
            "name" => Client => Client.Name,
            _ => Client => Client.Id,
        };
    }

    Task<PagedList<Client>> IClientRepository.GetClientsAsync(string sortColumn, string sortOrder, string searchTerm, int? employeid, int page, int pageSize)
    {
        throw new NotImplementedException();
    }
}
