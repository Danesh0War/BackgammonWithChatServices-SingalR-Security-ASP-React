using DAL.Interfaces;
using Logic.Interfaces;
using Models.Models;

namespace Logic.Services
{
    // The ChatService class implements the IChatService interface and provides
    // concrete implementations for chat-related operations.
    public class ChatService : IChatService
    {
        private readonly IChatRepository _repo; // Reference to the chat repository

        // Constructor dependency injection to instantiate the ChatService with a specific IChatRepository implementation.
        public ChatService(IChatRepository repo)
        {
            _repo = repo;
        }

        // CreateChatAsync method is responsible for adding a new chat to the database.
        public async Task CreateChatAsync(Chat chat)
        {
            await _repo.AddAsync(chat);
        }

        // GetChatAsync method retrieves a chat between two users. If the chat doesn't exist, it creates a new chat.
        public async Task<Chat> GetChatAsync(string sender, string receiver)
        {
            var chats = await _repo.GetAllAsync();
            var chat = chats.FirstOrDefault(x =>
                            x.Users.Contains(sender) && x.Users.Contains(receiver));

            // If chat doesn't exist, create a new one.
            if (chat == null)
            {
                chat = new Chat
                {
                    Users = new string[] { sender, receiver },
                    Messages = new List<Message>()
                };
                await CreateChatAsync(chat); // Create the chat asynchronously.
            }

            return chat;
        }

        // SendMessageAsync method adds a message to an existing chat and updates the chat in the database.
        public async Task SendMessageAsync(Chat chat, Message message)
        {
            var fetchedChat = await _repo.GetAsync(chat); // Fetch the chat based on provided criteria.
            if (fetchedChat != null)
            {
                fetchedChat.Messages.Add(message); // Add the message to the chat.
                await _repo.UpdateAsync(fetchedChat); // Update the chat in the database.
            }
        }

        // UpdateChatAsync method updates an existing chat in the database.
        public async Task UpdateChatAsync(Chat chat)
        {
            if (chat != default) // Ensure the chat object is not null.
            {
                await _repo.UpdateAsync(chat); // Update the chat asynchronously.
            }
        }
    }
}
