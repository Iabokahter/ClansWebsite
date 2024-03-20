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
    [HttpGet("GetPlayersCount")] 
    public async Task<IActionResult> GetPlayersCount()
    {
        Dictionary<string, int> clansPlayersCount = new Dictionary<string, int>();
        var collection = _mongoDbService.GetCollection<User>("default");
        foreach (var user in collection.AsQueryable())
        {
            if(!user.InClan)
                continue;
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
    [HttpGet("GetClanPoints")] 
    public async Task<IActionResult> GetClanPoints()
    {
        Dictionary<string, int> ClanPoints = new Dictionary<string, int>();
        var collection = _mongoDbService.GetCollection<User>("default");
        foreach (var user in collection.AsQueryable())
        {
            
            if (user.ClanName != null)
            {
                if (ClanPoints.ContainsKey(user.ClanName ?? ""))
                {
                    ClanPoints[user.ClanName] += user.ClanPoints;
                }
                else
                {
                    ClanPoints[user.ClanName] = user.ClanPoints;
                }
            }
        }
        
        return Ok(ClanPoints);
    }
    
    [HttpPost("saveEditText")] 
    public async Task<IActionResult> SaveEditText([FromBody] JsonElement body)
    {

        var collection = _mongoDbService.GetCollection<User>("default");
        
        var sessionId = Guid.NewGuid().ToString();

        if (collection.AsQueryable().Any(user => user.Text == body.GetProperty("text").GetString()))
        {
            await collection.UpdateOneAsync(user => user.Text == body.GetProperty("text").GetString()
                , Builders<User>.Update.Set(user => user.sessionID, sessionId));
            var userObj = await collection.FindAsync(user => user.Text == body.GetProperty("text").GetString());
            return Ok($"{(userObj.Single().InClan ? "User exist" : "User created")}/{sessionId}");

        }
        else
        {        
            var document = new User
                {Id = ObjectId.GenerateNewId(), Text = body.GetProperty("text").GetString(),sessionID = sessionId,ClanName = ""}; 

            try
            {
                await collection.InsertOneAsync(document);
                return Ok($"User created/{document.sessionID}");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


    }

    [HttpPost("EnterClan")] 
    public async Task<IActionResult> EnterClan([FromBody] JsonElement body)
    {
        var collection = _mongoDbService.GetCollection<User>("default");
        if (await collection.CountDocumentsAsync(user => user.ClanName == body.GetProperty("text").GetString() && user.InClan) < 10)
        {

            var update = Builders<User>.Update
                .Set(user => user.ClanName, body.GetProperty("text").GetString()).Set(user => user.InClan, true);
            await collection.UpdateManyAsync(user => user.Text == body.GetProperty("username").GetString(), update
            );

            return Ok();
        }

        return BadRequest();

    }
    
    [HttpPost("LeaveClan")] 
    public async Task<IActionResult> LeaveClan([FromBody] JsonElement body)
    {

        var collection = _mongoDbService.GetCollection<User>("default");
        await collection.UpdateOneAsync(user => user.Text ==  body.GetProperty("username").GetString(),
            Builders<User>.Update
                .Set(user  => user.InClan, false));
        
        return Ok();

    }
    
    [HttpPost("AddRemovePoints")] 
    public async Task<IActionResult> AddRemovePoints([FromBody] JsonElement body)
    {

        var collection = _mongoDbService.GetCollection<User>("default");
        await collection.UpdateOneAsync(user => user.Text == body.GetProperty("username").GetString(),
            Builders<User>.Update.Inc
                (user => user.ClanPoints, body.GetProperty("Diff").GetInt32()));
        return Ok();

    }
    [HttpPost("SetPoints")] 
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

    [HttpPost("GetMyClanName")]
    public async Task<ActionResult> GetMyClanName([FromBody] JsonElement body)
    {
        
        var collection = _mongoDbService.GetCollection<User>("default");
        var UserObj  = await collection.AsQueryable()
            .FirstAsync(user => user.Text == body.GetProperty("username").GetString());
        return   Ok(UserObj.ClanName);
    } 
    [HttpPost("GetActiveSession")]
    public async Task<ActionResult> GetActiveSession([FromBody]  JsonElement body)
    {
        var collection = _mongoDbService.GetCollection<User>("default");
        var userObj = await collection.FindAsync(user => user.Text == body.GetProperty("username").GetString());
        return Ok(userObj.First().sessionID);
        
    }
}

