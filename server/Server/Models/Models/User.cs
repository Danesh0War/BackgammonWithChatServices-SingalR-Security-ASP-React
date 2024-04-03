using MongoDB.Bson.Serialization.Attributes;

namespace Models.Models
{
    // Represents a user in the application, including authentication and connection details.
    public class User
    {
        [BsonId] // Specifies the property to be used as the document's primary key in MongoDB.
        public Guid UserId { get; set; } // Unique identifier for the user.

        public string Username { get; set; } // User's chosen username. Must be unique.

        public string Password { get; set; } // User's password. Stored in hashed form for security.

        public string ConnectionId { get; set; } // Identifier for the user's current connection, useful for real-time communication.

        public string PlayWith { get; set; } // Username of the user's current opponent in a game.

        public Chat CurrentChat { get; set; } // Reference to the chat currently engaged in by the user.
    }
}
