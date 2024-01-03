using System.Linq.Expressions;

namespace GreenTunnel.Core.Interfaces;

public interface IRepository<TEntity> where TEntity : class
{
    void Add(TEntity entity);
    void AddRange(IEnumerable<TEntity> entities);

    void Update(TEntity entity);
    void UpdateRange(IEnumerable<TEntity> entities);

    void Remove(TEntity entity);
    void RemoveRange(IEnumerable<TEntity> entities);

    int Count();

    IEnumerable<TEntity> Find(Expression<Func<TEntity, bool>> predicate);
    Task<TEntity> GetSingleOrDefaultAsync(Expression<Func<TEntity, bool>> predicate);
    Task<bool> GetFirsOrDefaultAsync(Expression<Func<TEntity, bool>> predicate);
    TEntity Get(int id);
    IEnumerable<TEntity> GetAll();
}