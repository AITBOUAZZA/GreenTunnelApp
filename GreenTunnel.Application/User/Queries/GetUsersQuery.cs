using GreenTunnel.Core.Helpers;
using GreenTunnel.Infrastructure.Helpers;
using GreenTunnel.Infrastructure.ViewModels;
using MediatR;

namespace GreenTunnel.Application.User.Queries;

public class GetUsersQuery : IRequest<PagedList<UserViewModel>>
{
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public string? SearchTerm { get; set; }
    public string? SortColumn { get; set; }
    public string? SortOrder { get; set; }
}