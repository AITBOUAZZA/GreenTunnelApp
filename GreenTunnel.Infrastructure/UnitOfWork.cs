using GreenTunnel.Core.Interfaces;
using GreenTunnel.Core.Interfaces.Uow;
using GreenTunnel.Infrastructure.Repositories;

namespace GreenTunnel.Infrastructure;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
   // private IFactoryRepository _factories;
   // private IWorkSpaceRepository _workspaces;
    //private IWorkplaceRepository _workplaces;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
    }

  

  

    public int SaveChanges()
    {
        return _context.SaveChanges();
    }
}