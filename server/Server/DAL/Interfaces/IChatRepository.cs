using Models.Models;

namespace DAL.Interfaces
{
    // IChatRepository interface outlines the CRUD (Create, Read, Update, Delete) operations
    // that must be implemented for handling chat-related data in the database asynchronously.
    public interface IChatRepository
    {
        Task AddAsync(Chat input);
        Task RemoveAsync(Chat chat);
        Task<Chat> GetAsync(Chat chat);
        Task<List<Chat>> GetAllAsync();
        Task UpdateAsync(Chat chat);
    }
}
