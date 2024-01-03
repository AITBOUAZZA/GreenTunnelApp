

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

using static System.Net.Mime.MediaTypeNames;

namespace GreenTunnel.Infrastructure.Repositories
{
    public class PiloteRepository  : Repository<Pilote>, IPiloteRepository
    {
        public PiloteRepository(ApplicationDbContext context) : base(context)
        { }
        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;
        public async Task<Pilote> AddAsync(Pilote pilote)
        {
            _appContext.Pilotes.Add(pilote);
            await _appContext.SaveChangesAsync();
            return pilote;
        }

        public async Task<List<Pilote>> GetAllPilotes()
        {
            IQueryable<Pilote> Pilotes = _appContext.Pilotes
                .AsSingleQuery();
            
            var pilotesList = await _appContext.Pilotes.ToListAsync();
            return pilotesList;
        }

        public async Task<Pilote> GetByIdAsync(int id)
        {
            return await _appContext.Pilotes.FindAsync(id);
        }

        public async Task<PagedList<Pilote>> GetPilotesAsync(string sortColumn, string sortOrder, string searchTerm, int page, int pageSize)
        {
            IQueryable<Pilote> pilotesQuery = _appContext.Pilotes;
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                pilotesQuery = pilotesQuery.Where(p => p.NomPilote.Contains(searchTerm));
            }

            if (sortOrder?.ToLower() == "desc")
            {
                pilotesQuery = pilotesQuery.OrderByDescending(GetSortProperty(sortColumn));
            }
            else
            {
                pilotesQuery = pilotesQuery.OrderBy(GetSortProperty(sortColumn));
            }

            var pilotes = pilotesQuery //.Include(r => r.piloteType )//.Include( p=> p.Product)
               .AsSingleQuery();
              // .OrderBy(r => r.CreatedDate);


            var pilotesListResponsesQuery = pilotes;
            var pilotesResult = await PagedList<Pilote>.CreateAsync(pilotesListResponsesQuery, page, pageSize);

            return pilotesResult;
        }
        public async Task<Pilote> GetByIdDetailsAsync(int id)
        {
            return await _appContext.Pilotes
                //.Include(w => w.TestType)
                .FirstOrDefaultAsync(w => w.NumPilote == id);
        }
        private static Expression<Func<Pilote, object>> GetSortProperty(string sortColumn)
        {
            return sortColumn?.ToLower() switch
            {
                "name" => pilote => pilote.NomPilote,
                _ => pilote => pilote.NumPilote,
            };
        }
    }
}
