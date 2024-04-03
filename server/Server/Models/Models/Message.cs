using MongoDB.Bson.Serialization.Attributes;

namespace Models.Models
{
    // Represents a message sent between users within a chat.
    public class Message
    {
        [BsonId] // MongoDB document identifier.
        public Guid MessageId { get; set; } // Unique identifier for the message.

        public string Sender { get; set; } // Username of the message's sender.

        public string Reciver { get; set; } // Username of the message's recipient.

        public string Date { get; set; } // Timestamp of when the message was sent.

        public string Text { get; set; } // Content of the message.
    }
}
