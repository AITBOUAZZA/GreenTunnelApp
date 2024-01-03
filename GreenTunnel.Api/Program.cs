using GreenTunnel.Application;
using GreenTunnel.Infrastructure;
using GreenTunnel.Infrastructure.DependencyRegistrar;
using GreenTunnel.Infrastructure.Helpers;
using GreenTunnel.Infrastructure.IdentityServer.Configurations;
using Microsoft.IdentityModel.Logging;

namespace GreenTunnel.Api;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.Services.RegisterDepencyService(builder);// Add services to the container.
        builder.Services.AddApplicationServices();

        //builder.Services.AddMediatR(cfg => //Register Commands and Queries handler
        //{
        //    cfg.RegisterServicesFromAssemblies(typeof(Program).Assembly, typeof(GetCurrentUserQueryHandler).Assembly);
        //    cfg.RegisterServicesFromAssemblies(typeof(Program).Assembly, typeof(CreateFactoryCommandHandler).Assembly);

        //    // builder.Services.AddScoped(typeof(IPipelineBehavior<,>), typeof(UnitOfWorkBehaviour<,>));
        //});
        var app = builder.Build();
        ConfigureRequestPipeline(app); // Configure the HTTP request pipeline.

        SeedDatabase(app); //Seed initial database

        app.Run();
    }


    private static void ConfigureRequestPipeline(WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
            IdentityModelEventSource.ShowPII = true;
        }
        else
        {
            app.UseExceptionHandler("/Error");
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseHsts();
        }

        app.UseHttpsRedirection();
        app.UseStaticFiles();
        app.UseRouting();
        app.UseCors(builder => builder
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod());

        app.UseIdentityServer();
        app.UseAuthorization();

        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.DocumentTitle = "Swagger UI - GreenTunnel";
            c.SwaggerEndpoint("/swagger/v1/swagger.json", $"{IdentityServerConfig.ApiFriendlyName} V1");
            c.OAuthClientId(IdentityServerConfig.SwaggerClientID);
            c.OAuthClientSecret("no_password"); //Leaving it blank doesn't work
        });

        app.MapControllerRoute(
            name: "default",
            pattern: "{controller}/{action=Index}/{id?}");

        app.Map("api/{**slug}", context =>
        {
            context.Response.StatusCode = StatusCodes.Status404NotFound;
            return Task.CompletedTask;
        });

        app.MapFallbackToFile("index.html");
    }

    private static void SeedDatabase(WebApplication app)
    {
        using (var scope = app.Services.CreateScope())
        {
            var services = scope.ServiceProvider;

            try
            {
                var databaseInitializer = services.GetRequiredService<IDatabaseInitializer>();
                databaseInitializer.SeedAsync().Wait();
            }
            catch (Exception ex)
            {
                var logger = services.GetRequiredService<ILogger<Program>>();
                logger.LogCritical(LoggingEvents.INIT_DATABASE, ex, LoggingEvents.INIT_DATABASE.Name);

                throw new Exception(LoggingEvents.INIT_DATABASE.Name, ex);
            }
        }
    }
}