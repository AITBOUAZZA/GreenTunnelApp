using GreenTunnel.Core.Entities;
using GreenTunnel.Core.Interfaces;
using GreenTunnel.Infrastructure.Authorization;
using GreenTunnel.Infrastructure.Helpers;
using GreenTunnel.Infrastructure.IdentityServer.Configurations;
using GreenTunnel.Infrastructure.Repositories;
using IdentityModel;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System.Reflection;
using GreenTunnel.Core.Interfaces.Uow;
using GreenTunnel.Infrastructure.Mangers;
using GreenTunnel.Core;

namespace GreenTunnel.Infrastructure.DependencyRegistrar;

public static class DependencyRegistrar
{
    public static IServiceCollection RegisterDepencyService(this IServiceCollection services, WebApplicationBuilder builder)
    {

        builder.Services.AddLogging();
        AddServices(builder);
        return services;
    }
    private static void AddServices(this WebApplicationBuilder builder)
    {
        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ??
                               throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

        var authServerUrl = builder.Configuration["AuthServerUrl"].TrimEnd('/');

        var migrationsAssembly = typeof(ApplicationDbContext).GetTypeInfo().Assembly.GetName().Name;

        builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(connectionString, b => b.MigrationsAssembly(migrationsAssembly)));

        // add identity
        builder.Services.AddIdentity<ApplicationUser, ApplicationRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        // Configure Identity options and password complexity here
        builder.Services.Configure<IdentityOptions>(options =>
        {
            // User settings
            options.User.RequireUniqueEmail = true;

            //// Password settings
            //options.Password.RequireDigit = true;
            //options.Password.RequiredLength = 8;
            //options.Password.RequireNonAlphanumeric = false;
            //options.Password.RequireUppercase = true;
            //options.Password.RequireLowercase = false;

            //// Lockout settings
            //options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
            //options.Lockout.MaxFailedAccessAttempts = 10;
        });

        // Adds IdentityServer.
        builder.Services.AddIdentityServer(o =>
            {
                o.IssuerUri = authServerUrl;
            })
            .AddInMemoryPersistedGrants()
            // To configure IdentityServer to use EntityFramework (EF) as the storage mechanism
            // see https://www.ebenmonney.com/configure-identityserver-to-use-entityframework-for-storage
            .AddInMemoryIdentityResources(IdentityServerConfig.GetIdentityResources())
            .AddInMemoryApiScopes(IdentityServerConfig.GetApiScopes())
            .AddInMemoryApiResources(IdentityServerConfig.GetApiResources())
            .AddInMemoryClients(IdentityServerConfig.GetClients())
            .AddAspNetIdentity<ApplicationUser>()
            .AddProfileService<ProfileService>();

        builder.Services.AddAuthentication(o =>
            {
                o.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.Authority = authServerUrl; // base-address of your identityserver
                options.TokenValidationParameters.ValidateAudience = false;
                options.TokenValidationParameters.ValidTypes = new[] { "at+jwt" };
                options.MapInboundClaims = false;
                options.TokenValidationParameters.NameClaimType = JwtClaimTypes.Name;
                options.TokenValidationParameters.RoleClaimType = JwtClaimTypes.Role;
            });

        builder.Services.AddAuthorization(options =>
        {
            options.AddPolicy(Policies.ViewAllUsersPolicy, policy => policy.RequireClaim(ClaimConstants.Permission, ApplicationPermissions.ViewUsers));
            options.AddPolicy(Policies.ManageAllUsersPolicy, policy => policy.RequireClaim(ClaimConstants.Permission, ApplicationPermissions.ManageUsers));

            options.AddPolicy(Policies.ViewAllRolesPolicy, policy => policy.RequireClaim(ClaimConstants.Permission, ApplicationPermissions.ViewRoles));
            options.AddPolicy(Policies.ViewRoleByRoleNamePolicy, policy => policy.Requirements.Add(new ViewRoleAuthorizationRequirement()));
            options.AddPolicy(Policies.ManageAllRolesPolicy, policy => policy.RequireClaim(ClaimConstants.Permission, ApplicationPermissions.ManageRoles));

            options.AddPolicy(Policies.AssignAllowedRolesPolicy, policy => policy.Requirements.Add(new AssignRolesAuthorizationRequirement()));
        });

        // Add cors
        builder.Services.AddCors();

        builder.Services.AddControllersWithViews();

        builder.Services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = IdentityServerConfig.ApiFriendlyName, Version = "v1" });
            c.OperationFilter<AuthorizeCheckOperationFilter>();
            c.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
            {
                Type = SecuritySchemeType.OAuth2,
                Flows = new OpenApiOAuthFlows
                {
                    Password = new OpenApiOAuthFlow
                    {
                        TokenUrl = new Uri("/connect/token", UriKind.Relative),
                        Scopes = new Dictionary<string, string>
                        {
                            { IdentityServerConfig.ApiName, IdentityServerConfig.ApiFriendlyName }
                        }
                    }
                }
            });
        });

        //builder.Services.AddAutoMapper(typeof(Program));
        builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());


        // Configurations
        builder.Services.Configure<AppSettings>(builder.Configuration);

        // Business Services
        builder.Services.AddScoped<IEmailSender, EmailSender>();

            // Repositories
            builder.Services.AddScoped<IUnitOfWork, HttpUnitOfWork>();
            builder.Services.AddScoped<IAccountManager, AccountManager>();
        builder.Services.AddScoped<IClientRepository, ClientRepository>();
       
            builder.Services.AddScoped<IAuditableEntity, AuditableEntity>();
            builder.Services.AddScoped<IPiloteRepository, PiloteRepository>();
        builder.Services.AddScoped<IVolRepository, VolRepository>();
        builder.Services.AddScoped<IAvionRepository, AvionRepository>();


        // Auth Handlers
        builder.Services.AddSingleton<IAuthorizationHandler, ViewUserAuthorizationHandler>();
        builder.Services.AddSingleton<IAuthorizationHandler, ManageUserAuthorizationHandler>();
        builder.Services.AddSingleton<IAuthorizationHandler, ViewRoleAuthorizationHandler>();
        builder.Services.AddSingleton<IAuthorizationHandler, AssignRolesAuthorizationHandler>();

        // DB Creation and Seeding
        builder.Services.AddTransient<IDatabaseInitializer, DatabaseInitializer>();

        //File Logger
        builder.Logging.AddFile(builder.Configuration.GetSection("Logging"));

        //Email Templates
        EmailTemplates.Initialize(builder.Environment);
    }
}