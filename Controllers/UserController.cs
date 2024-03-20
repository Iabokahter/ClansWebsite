using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
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
            if (user.ClanName != null)
            {
                if (clansPlayersCount.ContainsKey(user.ClanName ?? ""))
                {
                    clansPlayersCount[user.ClanName] += 1;
                }
                else
                {
                    clansPlayersCount[user.ClanName] = 1;
                }
            }
        }
        
        return Ok(clansPlayersCount);
    }

    private static ObjectId myId; 
    
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
            myId = ObjectId.GenerateNewId();
            var document = new User {Id = myId, Text = body.GetProperty("text").GetString() }; // Use the received text

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

    [HttpPost("EnterClan")] // Ensure correct route
    public async Task<IActionResult> EnterClan([FromBody] JsonElement body)
    {
        var update = Builders<User>.Update
            .Set(user => user.ClanName, body.GetProperty("text").GetString()).Set(user =>user.InClan , true );
        var collection = _mongoDbService.GetCollection<User>("default");
        await collection.UpdateManyAsync(user => user.Id == myId,update
            );
        
        return Ok();

    }
    
    [HttpPost("LeaveClan")] // Ensure correct route
    public async Task<IActionResult> LeaveClan([FromBody] JsonElement body)
    {

        var collection = _mongoDbService.GetCollection<User>("default");
        await collection.UpdateOneAsync(user => user.Text ==  body.GetProperty("username").GetString(),
            Builders<User>.Update
                .Set(user  => user.InClan, false));
        
        return Ok();

    }
    
    [HttpPost("AddRemovePoints")] // Ensure correct route
    public async Task<IActionResult> AddRemovePoints([FromBody] JsonElement body)
    {

        var collection = _mongoDbService.GetCollection<User>("default");
        await collection.UpdateOneAsync(user => user.Text == body.GetProperty("username").GetString(),
            Builders<User>.Update.Inc
                (user => user.ClanPoints, body.GetProperty("Diff").GetInt32()));
        return Ok();

    }
    [HttpPost("SetPoints")] // Ensure correct route
    public async Task<IActionResult> SetPoints([FromBody] JsonElement body)
    {

        var collection = _mongoDbService.GetCollection<User>("default");
        await collection.UpdateOneAsync(user => user.Text == body.GetProperty("username").GetString(),
            Builders<User>.Update.Set
                (user => user.ClanPoints, body.GetProperty("Diff").GetInt32()));
        return Ok();

    }
    
    [HttpPost("GetClanMembers")]
    public async Task<ActionResult<IEnumerable<User>>> GetClanMembers([FromBody] JsonElement body)
    {        
        var collection = _mongoDbService.GetCollection<User>("default");
        var ClanName = collection.AsQueryable().First(user => user.Text == body.GetProperty("username").GetString())
            .ClanName;
        var players = await collection.Find(user   => user.ClanName ==ClanName).ToListAsync();
        Dictionary<string, int> list = new Dictionary<string, int>();
        foreach (var player in players)
        {
            list.Add(  player.Text  + (player.InClan ? "" : " Left the clan"),player.ClanPoints);
        }
        return Ok(players);
    }

}

