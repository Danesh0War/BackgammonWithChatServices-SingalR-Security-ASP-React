using DAL.Database;
using DAL.Interfaces;
using Models.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace DAL.Repositories
{
    // The ChatRepository class provides the implementation for IChatRepository.
    // It interacts with the MongoDB database to perform CRUD operations on 'Chat' documents.

    public class ChatRepository : IChatRepository
    {
        // _collection holds a reference to the MongoDB collection for Chats.
        private readonly IMongoCollection<Chat> _collection;

        public ChatRepository(MongoDBConnector db, string collectionName)
        {
            // If db parameter is null, throw an ArgumentNullException to signal improper usage.
            if (db == null) throw new ArgumentNullException(nameof(db));
            // Assign the Chat collection from the database to the _collection field.
            _collection = db.Database.GetCollection<Chat>(collectionName);
        }

        // AddAsync method inserts a new Chat document into the collection.
        public async Task AddAsync(Chat chat)
        {
            try
            {
                await _collection.InsertOneAsync(chat);
            }
            catch (Exception ex)
            {
                // If an exception occurs during insert, it's caught and an InvalidOperationException is thrown
                // with additional context provided in the message.
                throw new InvalidOperationException("Could not add the chat.", ex);
            }
        }

        // GetAsync method retrieves a single Chat document from the collection based on the ChatId.
        public async Task<Chat> GetAsync(Chat chat)
        {
            try
            {
                // Define a filter for the ChatId matching the provided chat object's ChatId.
                var filter = Builders<Chat>.Filter.Eq("ChatId", chat.ChatId);
                return await _collection.Find(filter).FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                // If an exception occurs during the retrieval, handle it and provide a descriptive message.
                throw new InvalidOperationException($"Could not retrieve the chat with ID: {chat.ChatId}.", ex);
            }
        }

        // GetAllAsync method retrieves all Chat documents from the collection.
        public async Task<List<Chat>> GetAllAsync()
        {
            try
            {
                // Return a list of all Chat documents in the collection.
                return await _collection.Find(new BsonDocument()).ToListAsync();
            }
            catch (Exception ex)
            {
                // If an exception occurs during retrieval, handle it and provide a descriptive message.
                throw new InvalidOperationException("Could not retrieve chats.", ex);
            }
        }

        // RemoveAsync method deletes a single Chat document from the collection based on the ChatId.
        public async Task RemoveAsync(Chat chat)
        {
            try
            {
                // Define a filter for the ChatId matching the provided chat object's ChatId.
                var filter = Builders<Chat>.Filter.Eq("ChatId", chat.ChatId);
                // Delete the single matching document.
                await _collection.DeleteOneAsync(filter);
            }
            catch (Exception ex)
            {
                // If an exception occurs during deletion, handle it and provide a descriptive message.
                throw new InvalidOperationException($"Could not remove the chat with ID: {chat.ChatId}.", ex);
            }
        }

        // UpdateAsync method updates an existing Chat document in the collection or inserts a new one if it doesn't exist.
        public async Task UpdateAsync(Chat input)
        {
            try
            {
                // Define a filter for the ChatId matching the input chat object's ChatId.
                var filter = Builders<Chat>.Filter.Eq(chat => chat.ChatId, input.ChatId);
                // Replace the single matching document with the provided input chat object,
                // or insert a new document if no match is found (upsert).
                await _collection.ReplaceOneAsync(filter, input, new ReplaceOptions { IsUpsert = true });
            }
            catch (Exception ex)
            {
                // If an exception occurs during update, handle it and provide a descriptive message.
                throw new InvalidOperationException($"Could not update the chat with ID: {input.ChatId}.", ex);
            }
        }
    }
}
