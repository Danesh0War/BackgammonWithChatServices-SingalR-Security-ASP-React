using MongoDB.Driver;

namespace DAL.Database
{
    //Db Config. Our app will depend on MongoDB. 
    //IMPORTANT!!! For teacher, you may keep with my mongo db (see appsettings) or change connection string to your own db
    //(You will be able to see how object are saved - within security measures like hashing and connectionID's)
    public class MongoDBConnector
    {
        public IMongoDatabase Database;

        public MongoDBConnector(string connectionString, string databaseName)
        {
            var settings = MongoClientSettings.FromConnectionString(connectionString);
            var client = new MongoClient(settings);
            Database = client.GetDatabase(databaseName);
        }
    }
}
