using Microsoft.AspNetCore.Mvc;

namespace Clans.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly MongoDbService _mongoDbService = new MongoDbService();

    private readonly ILogger<UserController> _logger;

    public UserController(ILogger<UserController> logger)
    {
        _logger = logger;
    }
    [HttpGet]
    public IEnumerable<User> Get()
    {
        var collection = _mongoDbService.GetCollection<User>("Default");
        var document = new User { Text = "adsasd"};
        string ErrMsg = "";
        collection.InsertOneAsync(document).ContinueWith(task =>
        {
            if (!task.IsCompleted)
            {
                ErrMsg = task.Exception?.Message;
            }
        });
        
        return Enumerable.Range(1, 5).Select(index => new User { Text = "adsasd"}).ToArray();
        
    }

    [HttpPost("saveEditText")] // Ensure correct route
    public async Task<IActionResult> SaveEditText([FromBody] string text)
    {
        var collection = _mongoDbService.GetCollection<User>("default");
        var document = new User { Text = text }; // Use the received text

        try
        {
            await collection.InsertOneAsync(document);
            return Ok("User created");  
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }



}

