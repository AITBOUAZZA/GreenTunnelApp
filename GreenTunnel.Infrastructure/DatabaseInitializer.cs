using GreenTunnel.Core;
using GreenTunnel.Core.Entities;
using GreenTunnel.Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace GreenTunnel.Infrastructure;

public interface IDatabaseInitializer
{
    Task SeedAsync();
}

public class DatabaseInitializer : IDatabaseInitializer
{
    private readonly ApplicationDbContext _context;
    private readonly IAccountManager _accountManager;
    private readonly ILogger _logger;

    public DatabaseInitializer(ApplicationDbContext context, IAccountManager accountManager, ILogger<DatabaseInitializer> logger)
    {
        _accountManager = accountManager;
        _context = context;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        await _context.Database.MigrateAsync().ConfigureAwait(false);
        await SeedDefaultUsersAsync();
        await SeedDemoDataAsync();
    }

    private async Task SeedDefaultUsersAsync()
    {
        if (!await _context.Users.AnyAsync())
        {
            _logger.LogInformation("accounts");

            const string adminRoleName = "administrator";
            const string userRoleName = "user";

            await EnsureRoleAsync(adminRoleName, "Default administrator", ApplicationPermissions.GetAllPermissionValues());
            await EnsureRoleAsync(userRoleName, "Default user", new string[] { });
       
            await CreateUserAsync("admin", "Greentunnel123#", "Administrator", "admin@greentunnel.com", "000-0000", new string[] { adminRoleName });
            await CreateUserAsync("user", "Greentunnel123#", "User", "user@greentunnel.com", "000-0002", new string[] { userRoleName });

            _logger.LogInformation("Inbuilt account generation completed");
        }
    }

    private async Task EnsureRoleAsync(string roleName, string description, string[] claims)
    {
        if ((await _accountManager.GetRoleByNameAsync(roleName)) == null)
        {
            _logger.LogInformation($"Generating default role: {roleName}");

            var applicationRole = new ApplicationRole(roleName, description);

            var result = await _accountManager.CreateRoleAsync(applicationRole, claims);

            if (!result.Succeeded)
                throw new Exception($"Seeding \"{description}\" role failed. Errors: {string.Join(Environment.NewLine, result.Errors)}");
        }
    }

    private async Task<ApplicationUser> CreateUserAsync(string userName, string password, string fullName, string email, string phoneNumber, string[] roles)
    {
        _logger.LogInformation($"Generating default user: {userName}");

        var applicationUser = new ApplicationUser
        {
            UserName = userName,
            FullName = fullName,
            Email = email,
            PhoneNumber = phoneNumber,
            EmailConfirmed = true,
            IsEnabled = true
        };

        var result = await _accountManager.CreateUserAsync(applicationUser, roles, password);

        if (!result.Succeeded)
            throw new Exception($"Seeding \"{userName}\" user failed. Errors: {string.Join(Environment.NewLine, result.Errors)}");

        return applicationUser;
    }

    private async Task SeedDemoDataAsync()
    {
    }
}