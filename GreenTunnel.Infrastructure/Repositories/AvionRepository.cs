using GreenTunnel.Core.Entities;
using GreenTunnel.Core.Helpers;
using GreenTunnel.Core.Interfaces;
using GreenTunnel.Infrastructure.Helpers;
using GreenTunnel.Infrastructure.ViewModels.Response.Avion;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace GreenTunnel.Infrastructure.Repositories
{
    public class AvionRepository : Repository<Avion>, IAvionRepository
    {
        public AvionRepository(ApplicationDbContext context) : base(context)
        { }
        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;
        public async Task<Avion> AddAsync(Avion avion)
        {
            _appContext.Avions.Add(avion);
            await _appContext.SaveChangesAsync();
            return avion;
        }

        public async Task<List<Avion>> GetAllAvions()
        {
            IQueryable<Avion> avions = _appContext.Avions
                .AsSingleQuery();

            var avionsList = await _appContext.Avions.ToListAsync();
            return avionsList;
        }
        public async Task<Avion> GetByIdAsync(int id)
        {
            return await _appContext.Avions.FindAsync(id);
        }

        public async Task<PagedList<Avion>> GetAvionsAsync(string sortColumn, string sortOrder, string searchTerm, int page, int pageSize)
        {
            IQueryable<Avion> avionQuery = _appContext.Avions;
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                avionQuery = avionQuery.Where(p => p.NomAvion.Contains(searchTerm));
            }

            if (sortOrder?.ToLower() == "desc")
            {
                avionQuery = avionQuery.OrderByDescending(GetSortProperty(sortColumn));
            }
            else
            {
                avionQuery = avionQuery.OrderBy(GetSortProperty(sortColumn));
            }

            var avions = avionQuery //.Include(r => r.piloteType )//.Include( p=> p.Product)
               .AsSingleQuery();
            // .OrderBy(r => r.CreatedDate);
            

            var avionListResponsesQuery = avions;
            var pilotesResult = await PagedList<Avion>.CreateAsync(avionListResponsesQuery, page, pageSize);

            return pilotesResult;
        }

        public async Task<Avion> GetByIdDetailsAsync(int id)
        {
            return await _appContext.Avions
                //.Include(w => w.TestType)
                .FirstOrDefaultAsync(w => w.NumAvion == id);
        }
        private static Expression<Func<Avion, object>> GetSortProperty(string sortColumn)
        {
            return sortColumn?.ToLower() switch
            {
                "name" => avion => avion.NomAvion,
                _ => avion => avion.NumAvion,
            };
        }

    }
}
