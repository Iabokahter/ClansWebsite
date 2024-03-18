using Microsoft.AspNetCore.Mvc;

namespace Clans.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly MongoDbService _mongoDbService;

    private readonly ILogger<UserController> _logger;

    public UserController(ILogger<UserController> logger)
    {
        _logger = logger;
    }
    [HttpGet]
    public IEnumerable<User> Get()
    {
        return Enumerable.Range(1, 5).Select(index => new User("asdasd")).ToArray();    }

    [HttpPost("saveEditText")] // Ensure correct route
    public async Task<IActionResult> SaveEditText([FromBody] string text)
    {

        var collection = _mongoDbService.GetCollection<User>("default");
        var document = new User(text);
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
    }



}

