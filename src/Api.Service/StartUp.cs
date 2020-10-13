using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Api.Service
{
    public class StartUp
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddLogging(x => x.AddConsole())
                .AddCors(x => x.AddPolicy("CorsPolicy",
                    builder => builder.AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials()
                    ))
                .AddMvc();

            services.AddHealthChecks();

        }

        public void Configure(IApplicationBuilder app)
        {
            app.UseCors("CorsPolicy")
                .UseMvc();

            app.UseHealthChecks("/healthcheck");
        }
    }
}