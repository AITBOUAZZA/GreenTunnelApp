using Microsoft.EntityFrameworkCore;

namespace GreenTunnel.Core.Helpers;

public class PagedList<T>
{
    public PagedList(List<T> items, int page, int pageSize, int totalCount)
    {
        Items = items;
        Page = page;
        PageSize = pageSize;
        TotalCount = totalCount;
    }
    public List<T> Items { get; }
    public int Page { get; }
    public int PageSize { get; }
    public int TotalCount { get; }
    public bool HasNextPage => Page * PageSize < TotalCount;
    public bool HasPreviousPage => PageSize > 1;

    public static async Task<PagedList<T>> CreateAsync(IQueryable<T> query, int page, int pageSize)
    {
        var totalCount = query.Count(); // Synchronous Count operation
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(); // Asynchronous ToList operation

        return new PagedList<T>(items, page, pageSize, totalCount);
    }
    public static async Task<PagedList<T>> CreateAsync(IEnumerable<T> query, int page, int pageSize)
    {
        var totalCount = query.Count(); // Synchronous Count operation
        var items = query.Skip((page - 1) * pageSize).Take(pageSize).ToList(); // Asynchronous ToList operation

        return new PagedList<T>(items, page, pageSize, totalCount);
    }

}