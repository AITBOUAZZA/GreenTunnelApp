using GreenTunnel.Core.Entities;
using GreenTunnel.Core.Helpers;
using GreenTunnel.Core.Interfaces;
using GreenTunnel.Infrastructure.Helpers;
using MailKit.Search;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace GreenTunnel.Infrastructure.Repositories
{

    
    public class VolRepository : Repository<Vol>, IVolRepository
    {
        public VolRepository(ApplicationDbContext context) : base(context)
        { }
        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;

        public async Task<Vol> AddAsync(Vol vol)
        {
            _appContext.Vols.Add(vol);
            await _appContext.SaveChangesAsync();
            return vol;
        }

        public async Task<List<Vol>> GetAllVols()
        {
            IQueryable<Vol> vols = _appContext.Vols
                .AsSingleQuery();

            var volList = await _appContext.Vols.ToListAsync();
            return volList;
        }

        public async Task<Vol> GetByIdAsync(int id)
        {
            return await _appContext.Vols.FindAsync(id);
        }


        public async Task<PagedList<Vol>> GetVolsAsync(string sortColumn, string sortOrder, string searchTerm, int? volId, int page, int pageSize)
        {
            IQueryable<Vol> volQuery = _appContext.Vols;
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                volQuery = volQuery.Where(p => p.NumVol.Contains(searchTerm));
            }

            if (sortOrder?.ToLower() == "desc")
            {
                volQuery = volQuery.OrderByDescending(GetSortProperty(sortColumn));
            }
            else
            {
                volQuery = volQuery.OrderBy(GetSortProperty(sortColumn));
            }

            var Vols = volQuery //.Include(r => r.piloteType )//.Include( p=> p.Product)
               .AsSingleQuery();
            // .OrderBy(r => r.CreatedDate);


            var volListResponsesQuery = Vols;
            var volResult = await PagedList<Vol>.CreateAsync(volListResponsesQuery, page, pageSize);

            return volResult;

            

        }

        public async Task<List<Vol>> getVolsByAvionAndPilote(string avionId, string piloteId)
        {
            IQueryable<Vol> volsList = _appContext.Vols;
      

            if (!string.IsNullOrWhiteSpace(avionId))
            {
                volsList = volsList.Where(p => p.NumAvion.ToString() == avionId);
            }

            if (!string.IsNullOrWhiteSpace(piloteId))
            {
                volsList = volsList.Where(p => p.NumPilote.ToString() == piloteId);
            }

         

            var VolQuery = await volsList.ToListAsync();
            return VolQuery;
        }

        private static Expression<Func<Vol, object>> GetSortProperty(string sortColumn)
        {
            return sortColumn?.ToLower() switch
            {
                "name" => Vol => Vol.NumVol,
                _ => Vol => Vol.NumVol,
            };
        }

        public Task<Vol> GetByIdDetailsAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}
