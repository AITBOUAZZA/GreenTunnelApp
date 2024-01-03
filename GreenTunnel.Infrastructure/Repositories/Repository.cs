using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using GreenTunnel.Core.Interfaces;

namespace GreenTunnel.Infrastructure.Repositories;

public class Repository<TEntity> : IRepository<TEntity> where TEntity : class
{
    protected readonly ApplicationDbContext _context;
    protected readonly DbSet<TEntity> _entities;

    public Repository(ApplicationDbContext context)
    {
        _context = context;
        _entities = context.Set<TEntity>();
    }

    public virtual void Add(TEntity entity)
    {
        _context.Add(entity);
        _context.SaveChanges();
    }

    public virtual void AddRange(IEnumerable<TEntity> entities)
    {
        _entities.AddRange(entities);
    }

    public virtual void Update(TEntity entity)
    {
        _context.Update(entity);
        _context.SaveChanges();
    }

    public virtual void UpdateRange(IEnumerable<TEntity> entities)
    {
        _entities.UpdateRange(entities);
    }

    public virtual void Remove(TEntity entity)
    {
        _context.Remove(entity);
        _context.SaveChanges();
    }

    public virtual void RemoveRange(IEnumerable<TEntity> entities)
    {
        _entities.RemoveRange(entities);
    }

    public virtual int Count()
    {
        return _entities.Count();
    }

    public virtual IEnumerable<TEntity> Find(Expression<Func<TEntity, bool>> predicate)
    {
        return _entities.Where(predicate);
    }

    public virtual Task<TEntity> GetSingleOrDefaultAsync(Expression<Func<TEntity, bool>> predicate)
    {
        return _entities.SingleOrDefaultAsync(predicate);
    }
    public virtual Task<bool> GetFirsOrDefaultAsync(Expression<Func<TEntity, bool>> predicate)
    {
        return _entities.AnyAsync(predicate);
    }

    public virtual TEntity Get(int id)
    {
        return _entities.Find(id);
    }

    public virtual IEnumerable<TEntity> GetAll()
    {
        return _entities.ToList();
    }
}