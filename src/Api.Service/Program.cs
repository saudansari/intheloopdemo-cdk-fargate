using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;

namespace Api.Service
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var host = new WebHostBuilder()
                .UseStartup<StartUp>()
                .UseKestrel()
                .Build();

            await host.RunAsync();
        }
    }
}
