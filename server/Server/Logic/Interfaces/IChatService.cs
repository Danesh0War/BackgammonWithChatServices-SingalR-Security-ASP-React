using Models.Models;

namespace Logic.Interfaces
{
    // IChatService interface declares methods that must be implemented to provide
    // the core functionalities of chat operations within the application. Must be implemented in assync way. 
    public interface IChatService
    {
        Task CreateChatAsync(Chat chat);

        Task<Chat> GetChatAsync(string sender, string reciver);

        Task SendMessageAsync(Chat chat, Message message);

        Task UpdateChatAsync(Chat chat);
    }
}
