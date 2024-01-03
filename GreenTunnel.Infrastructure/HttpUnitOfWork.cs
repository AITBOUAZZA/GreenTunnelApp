


using GreenTunnel.Core;
using Microsoft.AspNetCore.Http;

namespace GreenTunnel.Infrastructure;

public class HttpUnitOfWork : UnitOfWork
{
    public HttpUnitOfWork(ApplicationDbContext context, IHttpContextAccessor httpAccessor) : base(context)
    {
        context.CurrentUserId = httpAccessor.HttpContext?.User.FindFirst(ClaimConstants.Subject)?.Value?.Trim();
    }
}