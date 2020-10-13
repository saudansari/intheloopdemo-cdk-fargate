using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Api.Service.Controller
{
    [ApiController]
    [Route("api/")]
    [EnableCors("CorsPolicy")]
    public class ServiceController : ControllerBase
    {
        private static int _count;
        private readonly ILogger<ServiceController> _logger;

        public ServiceController(ILogger<ServiceController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        [Route("ping")]
        public ObjectResult Ping(int? request)
        {
            var message = $"Pong {_count++} {request}";
            _logger.Log(LogLevel.Information,"Ping Endpoint Called:"+ message);
            return Ok(message);
        }
    }
}