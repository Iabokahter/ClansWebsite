using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

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
        var collection = _mongoDbService.GetCollection<User>("default");
        var document = new User { Text = "adsasd" };
        string ErrMsg = "";
        collection.InsertOneAsync(document).ContinueWith(task =>
        {
            if (!task.IsCompleted)
            {
                ErrMsg = task.Exception?.Message;
            }
        });

        return Enumerable.Range(1, 5).Select(index => new User { Text = "adsasd" }).ToArray();

    }
    [HttpGet("GetPlayersCount")] // Ensure correct route
    public async Task<IActionResult> GetPlayersCount()
    {
        Dictionary<string, int> clansPlayersCount = new Dictionary<string, int>();
        var collection = _mongoDbService.GetCollection<User>("default");
        foreach (var user in collection.AsQueryable())
        {
            if (clansPlayersCount.ContainsKey(user.ClanName ?? "Clan A"))
            {
                clansPlayersCount[user.ClanName ?? "Clan A"] += 1;
            }
            else
            {
                clansPlayersCount[user.ClanName ?? "Clan A"] = 1;
            }
        }
        
        return Ok(clansPlayersCount);
    }
    [HttpPost("saveEditText")] // Ensure correct route
    public async Task<IActionResult> SaveEditText([FromBody] JsonElement body)
    {

        var collection = _mongoDbService.GetCollection<User>("default");

        if (collection.AsQueryable().Any(user => user.Text == body.GetProperty("text").GetString()))
        {
            return Ok("User exist");

        }
        else
        {        
            var document = new User { Text = body.GetProperty("text").GetString() }; // Use the received text

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



}

