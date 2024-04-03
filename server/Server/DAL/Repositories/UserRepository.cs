using DAL.Database;
using DAL.Interfaces;
using Models.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace DAL.Repositories
{
    // The UserRepository class provides the implementation for IUserRepository.
    // It interacts with the MongoDB database to perform CRUD operations on 'User' documents.
    public class UserRepository : IUserRepository
    {
        // _collection holds a reference to the MongoDB collection for Users.
        private readonly IMongoCollection<User> _collection;

        public UserRepository(MongoDBConnector db, string collectionName)
        {
            // If db parameter is null, throw an ArgumentNullException to signal improper usage.
            if (db == null) throw new ArgumentNullException(nameof(db));
            // Assign the User collection from the database to the _collection field.
            _collection = db.Database.GetCollection<User>(collectionName);
        }

        // AddAsync method inserts a new User document into the collection.
        public async Task AddAsync(User input)
        {
            try
            {
                await _collection.InsertOneAsync(input);
            }
            catch (Exception ex)
            {
                // If an exception occurs during insert, it's caught and an InvalidOperationException is thrown
                // with additional context provided in the message.
                throw new InvalidOperationException("Could not add the user.", ex);
            }
        }

        // GetAsync method retrieves a single User document from the collection based on the username.
        public async Task<User> GetAsync(string username)
        {
            try
            {
                // Define a filter for the Username matching the provided username string.
                var filter = Builders<User>.Filter.Eq(user => user.Username, username);
                // Return the first matching document or null if no match is found.
                return await _collection.Find(filter).FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                // If an exception occurs during the retrieval, handle it and provide a descriptive message.
                throw new InvalidOperationException($"Could not retrieve the user with username: {username}.", ex);
            }
        }

        // GetAllAsync method retrieves all User documents from the collection.
        public async Task<List<User>> GetAllAsync()
        {
            try
            {
                // Return a list of all User documents in the collection.
                return await _collection.Find(new BsonDocument()).ToListAsync();
            }
            catch (Exception ex)
            {
                // If an exception occurs during retrieval, handle it and provide a descriptive message.
                throw new InvalidOperationException("Could not retrieve users.", ex);
            }
        }

        // RemoveAsync method deletes a single User document from the collection based on the username.
        public async Task RemoveAsync(string username)
        {
            try
            {
                // Define a filter for the Username matching the provided username string.
                var filter = Builders<User>.Filter.Eq(user => user.Username, username);
                // Delete the single matching document.
                await _collection.DeleteOneAsync(filter);
            }
            catch (Exception ex)
            {
                // If an exception occurs during deletion, handle it and provide a descriptive message.
                throw new InvalidOperationException($"Could not remove the user with username: {username}.", ex);
            }
        }

        // UpdateAsync method updates an existing User document in the collection or inserts a new one if it doesn't exist.
        public async Task UpdateAsync(User input)
        {
            try
            {
                // Define a filter for the Username matching the input user object's Username.
                var filter = Builders<User>.Filter.Eq(user => user.Username, input.Username);
                // Replace the single matching document with the provided input user object,
                // or insert a new document if no match is found (upsert).
                await _collection.ReplaceOneAsync(filter, input, new ReplaceOptions { IsUpsert = true });
            }
            catch (Exception ex)
            {
                // If an exception occurs during update, handle it and provide a descriptive message.
                throw new InvalidOperationException($"Could not update the user with username: {input.Username}.", ex);
            }
        }
    }
}
