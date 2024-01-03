using GreenTunnel.Core.Helpers;
using GreenTunnel.Infrastructure.Helpers;
using GreenTunnel.Infrastructure.ViewModels;
using MediatR;

namespace GreenTunnel.Application.Role.Queries;

public class GetRolesLoadRelatedQuery : IRequest<PagedList<RoleViewModel>>
{
    public int Page { get; set; }
    public int PageSize { get; set; }
    public string? SearchTerm { get; set; }
    public string? SortColumn { get; set; }
    public string? SortOrder { get; set; }
}