using DAL.Interfaces;
using Logic.Interfaces;
using Models.Models;

namespace Logic.Services
{
    // The UserService class implements the IUserService interface to provide
    // concrete implementations for user-related operations.
    public class UserService : IUserService
    {
        private readonly IUserRepository _repo; // Dependency injection of the IUserRepository interface.

        // Constructor for UserService with dependency injection for IUserRepository.
        public UserService(IUserRepository repo)
        {
            _repo = repo ?? throw new ArgumentNullException(nameof(repo)); // Ensure repo is not null.
        }

        // Asynchronously retrieves a list of all users.
        public async Task<List<User>> GetUsersAsync()
        {
            var collection = await _repo.GetAllAsync(); // Retrieves all users from the repository.
            return collection ?? new List<User>(); // Return an empty list if null is returned.
        }

        // Registers a new user if the username does not already exist.
        public async Task<bool> RegisterAsync(string username, string password)
        {
            if (await IsExistAsync(username))
                return false; // Username already exists, cannot register.

            // Password validation logic
            if (!IsValidPassword(password))
            {
                throw new ArgumentException("Password does not meet complexity requirements.");
            }

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(password); // Hash the password for storage.

            await _repo.AddAsync(new User { Username = username, Password = hashedPassword }); // Add the new user.
            return true;
        }

        // Validates password complexity
        private bool IsValidPassword(string password)
        {
            return
                password.Length >= 8 &&
                password.Any(char.IsUpper) &&
                password.Any(char.IsLower) &&
                password.Any(char.IsDigit) &&
                password.Any(ch => !char.IsLetterOrDigit(ch));
        }

        // Handles the login process for a user.
        public async Task<User> LoginAsync(string connection, string username, string password)
        {
            var user = await IsExistAsync(username, password); // Checks if user exists and password matches.
            return user ? await _repo.GetAsync(username) : null; // Retrieve user if credentials are correct, otherwise return null.
        }

        // Private helper method to check if a user exists with an optional password check.
        private async Task<bool> IsExistAsync(string username, string password = null)
        {
            var userInDb = await _repo.GetAsync(username); // Retrieve user by username.
            if (userInDb == null) return false; // User does not exist.

            return password == null || BCrypt.Net.BCrypt.Verify(password, userInDb.Password); // Verify password if provided.
        }

        // Clears connection IDs for all users, used for resetting connections.
        public async Task ClearConnectionsAsync()
        {
            var users = await _repo.GetAllAsync(); // Retrieve all users.
            foreach (var user in users)
            {
                if (user.ConnectionId != default) // If a connection ID is set,
                {
                    user.ConnectionId = default; // Clear the connection ID.
                    await _repo.UpdateAsync(user); // Update the user in the repository.
                }
            }
        }

        // Updates a user's information in the repository.
        public async Task UpdateUserAsync(User user)
        {
            if (user != null) // Ensure the user object is not null.
                await _repo.UpdateAsync(user); // Update the user in the repository.
        }
    }
}
