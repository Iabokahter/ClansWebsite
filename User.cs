using MongoDB.Bson;

namespace Clans;

public class User
{
    public ObjectId Id { get; set; } // For MongoDB
    public string Text { get; set; } 

    
}