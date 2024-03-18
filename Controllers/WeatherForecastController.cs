using Microsoft.AspNetCore.Mvc;

namespace Clans.Controllers;

[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private readonly ILogger<WeatherForecastController> _logger;

    public WeatherForecastController(ILogger<WeatherForecastController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public IEnumerable<WeatherForecast> Get()
    {
        return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        {
            Date = DateTime.Now.AddDays(index),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        })
        .ToArray();
    }
    private readonly MongoDbService _mongoDbService = new MongoDbService();

    [HttpPost("WriteToDatabase")] // Ensure correct route
    public async Task<IActionResult> WriteToDatabase([FromBody] string text)
    {
        var collection = _mongoDbService.GetCollection<User>("default"); 
        var document = new User (text);
        string ErrMsg = "";
        await collection.InsertOneAsync(document).ContinueWith(task =>
        {
            if (!task.IsCompleted)
            {
                ErrMsg = task.Exception?.Message;
            }
        });
        if (ErrMsg.Equals(""))
        {
            return new OkObjectResult("User created");
        }
        else
        {
            return new BadRequestObjectResult(ErrMsg);
        }
        // 1. Save 'text' to MongoDB 
        // 2. Return an appropriate response (e.g., OkResult())
    }
}
