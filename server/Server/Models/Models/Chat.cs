using MongoDB.Bson.Serialization.Attributes;

namespace Models.Models
{
    // Represents a chat session between two or more users.
    public class Chat
    {
        [BsonId] // MongoDB document identifier.
        public Guid ChatId { get; set; } // Unique identifier for the chat session.

        public string[] Users { get; set; } // Usernames of the participants in the chat.

        public List<Message> Messages { get; set; } // Collection of messages exchanged in the chat.
    }
}
