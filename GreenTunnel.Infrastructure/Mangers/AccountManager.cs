using GreenTunnel.Core;
using GreenTunnel.Core.Entities;
using GreenTunnel.Core.Helpers;
using GreenTunnel.Core.Interfaces;
using GreenTunnel.Infrastructure;
using GreenTunnel.Infrastructure.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System.Security.Claims;

namespace GreenTunnel.Infrastructure.Mangers;

public class AccountManager : IAccountManager
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<ApplicationRole> _roleManager;

    public AccountManager(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        RoleManager<ApplicationRole> roleManager,
        IHttpContextAccessor httpAccessor)
    {
        _context = context;
        _context.CurrentUserId = httpAccessor.HttpContext?.User.FindFirst(ClaimConstants.Subject)?.Value?.Trim();
        _userManager = userManager;
        _roleManager = roleManager;

    }

    public async Task<ApplicationUser> GetUserByIdAsync(string userId)
    {
        return await _userManager.FindByIdAsync(userId);
    }

    public async Task<ApplicationUser> GetUserByUserNameAsync(string userName)
    {
        return await _userManager.FindByNameAsync(userName);
    }

    public async Task<ApplicationUser> GetUserByEmailAsync(string email)
    {
        return await _userManager.FindByEmailAsync(email);
    }

    public async Task<IList<string>> GetUserRolesAsync(ApplicationUser user)
    {
        return await _userManager.GetRolesAsync(user);
    }

    public async Task<(ApplicationUser User, string[] Roles)?> GetUserAndRolesAsync(string userId)
    {
        var user = await _context.Users
            .Include(u => u.Roles)
            .Where(u => u.Id == userId)
            .SingleOrDefaultAsync();

        if (user == null)
            return null;

        var userRoleIds = user.Roles.Select(r => r.RoleId).ToList();

        var roles = await _context.Roles
            .Where(r => userRoleIds.Contains(r.Id))
            .Select(r => r.Name)
            .ToArrayAsync();

        return (user, roles);
    }
    private static Expression<Func<ApplicationUser, object>> GetSortProperty(string sortColumn)
    {
        return sortColumn?.ToLower() switch
        {
            "name" => factory => factory.FullName,
            _ => factory => factory.Id,
        };
    }
    private static Expression<Func<ApplicationRole, object>> GetRolesSortProperty(string sortColumn)
    {
        return sortColumn?.ToLower() switch
        {
            "name" => factory => factory.Name,
            _ => factory => factory.Id,
        };
    }
    public async Task<PagedList<(ApplicationUser User, string[] Roles)>> GetUsersAndRolesAsync(int page, int pageSize, string sortColumn, string sortOrder, string searchTerm)
    {
        IQueryable<ApplicationUser> factoriesQuery = _context.Users;
        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            factoriesQuery = factoriesQuery.Where(p => p.UserName.Contains(searchTerm));
        }

        if (sortOrder?.ToLower() == "desc")
        {
            factoriesQuery = factoriesQuery.OrderByDescending(GetSortProperty(sortColumn));
        }
        else
        {
            factoriesQuery = factoriesQuery.OrderBy(GetSortProperty(sortColumn));
        }

        var factories = factoriesQuery.Include(u => u.Roles)
            .AsSingleQuery()
            .OrderBy(r => r.CreatedDate);



        // Extract user role IDs
        var userRoleIds = factoriesQuery.SelectMany(u => u.Roles.Select(r => r.RoleId)).ToList();

        // Fetch roles based on user role IDs
        var roles = await _context.Roles
            .Where(r => userRoleIds.Contains(r.Id))
            .ToArrayAsync();

        var userRolesList = factoriesQuery
            .Select(u => new
            {
                User = u,
                RoleNames = _context.Roles
                    .Where(r => u.Roles.Any(ur => ur.RoleId == r.Id))
                    .Select(r => r.Name)
                    .ToArray()
            })
            .ToList()
            .Select(x => (x.User, x.RoleNames))
            .ToList();


        // Create a PagedList of (ApplicationUser, string[]) tuples
        var userRolesResult = await PagedList<(ApplicationUser User, string[] Roles)>.CreateAsync(userRolesList, page, pageSize);

        return userRolesResult;
    }


    public async Task<(bool Succeeded, string[] Errors)> CreateUserAsync(ApplicationUser user, IEnumerable<string> roles, string password)
    {
        var result = await _userManager.CreateAsync(user, password);
        if (!result.Succeeded)
            return (false, result.Errors.Select(e => e.Description).ToArray());

        user = await _userManager.FindByNameAsync(user.UserName);

        try
        {
            result = await _userManager.AddToRolesAsync(user, roles.Distinct());
        }
        catch
        {
            await DeleteUserAsync(user);
            throw;
        }

        if (!result.Succeeded)
        {
            await DeleteUserAsync(user);
            return (false, result.Errors.Select(e => e.Description).ToArray());
        }

        return (true, new string[] { });
    }

    public async Task<(bool Succeeded, string[] Errors)> UpdateUserAsync(ApplicationUser user)
    {
        return await UpdateUserAsync(user, null);
    }

    public async Task<(bool Succeeded, string[] Errors)> UpdateUserAsync(ApplicationUser user, IEnumerable<string> roles)
    {
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return (false, result.Errors.Select(e => e.Description).ToArray());

        if (roles != null)
        {
            var userRoles = await _userManager.GetRolesAsync(user);

            var rolesToRemove = userRoles.Except(roles).ToArray();
            var rolesToAdd = roles.Except(userRoles).Distinct().ToArray();

            if (rolesToRemove.Any())
            {
                result = await _userManager.RemoveFromRolesAsync(user, rolesToRemove);
                if (!result.Succeeded)
                    return (false, result.Errors.Select(e => e.Description).ToArray());
            }

            if (rolesToAdd.Any())
            {
                result = await _userManager.AddToRolesAsync(user, rolesToAdd);
                if (!result.Succeeded)
                    return (false, result.Errors.Select(e => e.Description).ToArray());
            }
        }

        return (true, new string[] { });
    }

    public async Task<(bool Succeeded, string[] Errors)> ResetPasswordAsync(ApplicationUser user, string newPassword)
    {
        var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);

        var result = await _userManager.ResetPasswordAsync(user, resetToken, newPassword);
        if (!result.Succeeded)
            return (false, result.Errors.Select(e => e.Description).ToArray());

        return (true, new string[] { });
    }

    public async Task<(bool Succeeded, string[] Errors)> UpdatePasswordAsync(ApplicationUser user, string currentPassword, string newPassword)
    {
        var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
        if (!result.Succeeded)
            return (false, result.Errors.Select(e => e.Description).ToArray());

        return (true, new string[] { });
    }

    public async Task<bool> CheckPasswordAsync(ApplicationUser user, string password)
    {
        if (!await _userManager.CheckPasswordAsync(user, password))
        {
            if (!_userManager.SupportsUserLockout)
                await _userManager.AccessFailedAsync(user);

            return false;
        }

        return true;
    }


    public async Task<(bool Succeeded, string[] Errors)> DeleteUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user != null)
            return await DeleteUserAsync(user);

        return (true, new string[] { });
    }

    public async Task<(bool Succeeded, string[] Errors)> DeleteUserAsync(ApplicationUser user)
    {
        var result = await _userManager.DeleteAsync(user);
        return (result.Succeeded, result.Errors.Select(e => e.Description).ToArray());
    }

    public async Task<ApplicationRole> GetRoleByIdAsync(string roleId)
    {
        return await _roleManager.FindByIdAsync(roleId);
    }

    public async Task<ApplicationRole> GetRoleByNameAsync(string roleName)
    {
        return await _roleManager.FindByNameAsync(roleName);
    }

    public async Task<ApplicationRole> GetRoleLoadRelatedAsync(string roleName)
    {
        var role = await _context.Roles
            .Include(r => r.Claims)
            .Include(r => r.Users)
            .AsSingleQuery()
            .Where(r => r.Name == roleName)
            .SingleOrDefaultAsync();

        return role;
    }

    public async Task<PagedList<ApplicationRole>> GetRolesLoadRelatedAsync(string sortColumn, string sortOrder, string searchTerm, int page, int pageSize)
    {
        //IQueryable<ApplicationRole> rolesQuery = _context.Roles
        //    .Include(r => r.Claims)
        //    .Include(r => r.Users)
        //    .AsSingleQuery()
        //    .OrderBy(r => r.Name);

        //if (page != -1)
        //    rolesQuery = rolesQuery.Skip((page - 1) * pageSize);

        //if (pageSize != -1)
        //    rolesQuery = rolesQuery.Take(pageSize);

        //var roles = await rolesQuery.ToListAsync();

        //return roles;

        IQueryable<ApplicationRole> rolesQuery = _context.Roles;
        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            rolesQuery = rolesQuery.Where(p => p.Name.Contains(searchTerm));
        }

        if (sortOrder?.ToLower() == "desc")
        {
            rolesQuery = rolesQuery.OrderByDescending(GetRolesSortProperty(sortColumn));
        }
        else
        {
            rolesQuery = rolesQuery.OrderBy(GetRolesSortProperty(sortColumn));
        }

        var factories = rolesQuery
            .Include(r => r.Claims)
            .Include(r => r.Users)
            .AsSingleQuery()
            .OrderBy(r => r.Name);

        // Create a PagedList of (ApplicationUser, string[]) tuples
        var userRolesResult = await PagedList<ApplicationRole>.CreateAsync(factories, page, pageSize);

        return userRolesResult;
    }

    public async Task<(bool Succeeded, string[] Errors)> CreateRoleAsync(ApplicationRole role, IEnumerable<string> claims)
    {
        claims ??= new string[] { };

        var invalidClaims = claims.Where(c => ApplicationPermissions.GetPermissionByValue(c) == null).ToArray();
        if (invalidClaims.Any())
            return (false, new[] { $"The following claim types are invalid: {string.Join(", ", invalidClaims)}" });

        var result = await _roleManager.CreateAsync(role);
        if (!result.Succeeded)
            return (false, result.Errors.Select(e => e.Description).ToArray());

        role = await _roleManager.FindByNameAsync(role.Name);

        foreach (var claim in claims.Distinct())
        {
            result = await _roleManager.AddClaimAsync(role, new Claim(ClaimConstants.Permission, ApplicationPermissions.GetPermissionByValue(claim)));

            if (!result.Succeeded)
            {
                await DeleteRoleAsync(role);
                return (false, result.Errors.Select(e => e.Description).ToArray());
            }
        }

        return (true, new string[] { });
    }

    public async Task<(bool Succeeded, string[] Errors)> UpdateRoleAsync(ApplicationRole role, IEnumerable<string> claims)
    {
        if (claims != null)
        {
            var invalidClaims = claims.Where(c => ApplicationPermissions.GetPermissionByValue(c) == null).ToArray();
            if (invalidClaims.Any())
                return (false, new[] { $"The following claim types are invalid: {string.Join(", ", invalidClaims)}" });
        }

        var result = await _roleManager.UpdateAsync(role);
        if (!result.Succeeded)
            return (false, result.Errors.Select(e => e.Description).ToArray());

        if (claims != null)
        {
            var roleClaims = (await _roleManager.GetClaimsAsync(role)).Where(c => c.Type == ClaimConstants.Permission);
            var roleClaimValues = roleClaims.Select(c => c.Value).ToArray();

            var claimsToRemove = roleClaimValues.Except(claims).ToArray();
            var claimsToAdd = claims.Except(roleClaimValues).Distinct().ToArray();

            if (claimsToRemove.Any())
            {
                foreach (var claim in claimsToRemove)
                {
                    result = await _roleManager.RemoveClaimAsync(role, roleClaims.Where(c => c.Value == claim).FirstOrDefault());
                    if (!result.Succeeded)
                        return (false, result.Errors.Select(e => e.Description).ToArray());
                }
            }

            if (claimsToAdd.Any())
            {
                foreach (var claim in claimsToAdd)
                {
                    result = await _roleManager.AddClaimAsync(role, new Claim(ClaimConstants.Permission, ApplicationPermissions.GetPermissionByValue(claim)));
                    if (!result.Succeeded)
                        return (false, result.Errors.Select(e => e.Description).ToArray());
                }
            }
        }

        return (true, new string[] { });
    }

    public async Task<bool> TestCanDeleteRoleAsync(string roleId)
    {
        return !await _context.UserRoles.Where(r => r.RoleId == roleId).AnyAsync();
    }

    public async Task<(bool Succeeded, string[] Errors)> DeleteRoleAsync(string roleName)
    {
        var role = await _roleManager.FindByNameAsync(roleName);

        if (role != null)
            return await DeleteRoleAsync(role);

        return (true, new string[] { });
    }

    public async Task<(bool Succeeded, string[] Errors)> DeleteRoleAsync(ApplicationRole role)
    {
        var result = await _roleManager.DeleteAsync(role);
        return (result.Succeeded, result.Errors.Select(e => e.Description).ToArray());
    }
}