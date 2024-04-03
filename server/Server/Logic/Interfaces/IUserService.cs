using Models.Models;

namespace Logic.Interfaces
{
    // IUserService interface outlines the operations that must be supported for managing user
    // information and authentication within the application. Must be implemented in assync way. 
    public interface IUserService
    {
        Task<User> LoginAsync(string connection, string username, string password);
        Task<bool> RegisterAsync(string username, string password);
        Task<List<User>> GetUsersAsync();
        Task ClearConnectionsAsync();
        Task UpdateUserAsync(User user);
    }
}
