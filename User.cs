using MongoDB.Bson;

namespace Clans;

public class User
{
    public ObjectId Id { get; set; } // For MongoDB
    public string? Text { get; set; }
    public string? ClanName { get; set; }
    public bool InClan { get; set; } = false;
    public int ClanPoints { get; set; } = 0;


}