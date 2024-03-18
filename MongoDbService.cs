using MongoDB.Driver;

public class MongoDbService
{
    private readonly IMongoClient _client;
    private readonly IMongoDatabase _database;

    public MongoDbService()
    {
        var connectionString = "mongodb://localhost:27017"; // Replace with your connection string
        _client = new MongoClient(connectionString);
        _database = _client.GetDatabase("Users"); 
    }

    public IMongoCollection<DocumentType> GetCollection<DocumentType>(string UserData)
    {
        return _database.GetCollection<DocumentType>(UserData);
    }
}