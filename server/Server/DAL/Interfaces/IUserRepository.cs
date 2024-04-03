using Models.Models;

namespace DAL.Interfaces
{
    // IUserRepository interface outlines the CRUD (Create, Read, Update, Delete) operations
    // that must be implemented for handling user-related data in the database asynchronously.
    public interface IUserRepository
    {
        Task AddAsync(User input);
        Task RemoveAsync(string username);
        Task<User> GetAsync(string username);
        Task<List<User>> GetAllAsync();
        Task UpdateAsync(User input);
    }
}
