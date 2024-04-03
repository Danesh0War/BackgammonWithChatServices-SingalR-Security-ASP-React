using Logic.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Models.Models;

namespace Server.Hubs
{
    // MainHub manages the real-time functionalities of the backgammon chat application.

    public class MainHub : Hub
    {
        // Services for handling chat and user functionalities.
        private IChatService _chatService;
        private IUserService _userService;

        // Constructor injecting services for chat and user operations.
        public MainHub(IChatService chatService, IUserService userService)
        {
            _chatService = chatService;
            _userService = userService;
        }

        // Updates the board state for all clients in a chat group.
        public async Task UpdateBoard(Chat chat, string pieceId, string currentPlaceId, string nextPlaceId)
        {
            var lst = new string[] { pieceId, currentPlaceId, nextPlaceId };
            await Clients.Group(chat.ChatId.ToString()).SendAsync("UpdateBoard", lst);
        }

        // Rolls dice and sends the result to all clients in a chat group.
        public async Task RollDice(Chat chat)
        {
            var rnd = new Random();
            await Clients.Group(chat.ChatId.ToString()).SendAsync("GetDice", rnd.Next(1, 7), rnd.Next(1, 7));
        }

        // Notifies clients in a chat group to switch turns.
        public async Task NextTurn(Chat chat, string color)
        {
            var nextColor = color == "white" ? "black" : "white";
            await Clients.Group(chat.ChatId.ToString()).SendAsync("Turn", nextColor);
        }

        // Handles the end of a game session, notifying participants and updating states.
        public async Task EndGame(Chat chat, string color)
        {
            // If the chat parameter is null, there's nothing to process.
            if (chat == null) return;

            // Retrieve all users from the database.
            var users = await _userService.GetUsersAsync();
            // Identify the current user based on their connection ID.
            var currentUser = users.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            // If the current user isn't found, there's nothing further to do.
            if (currentUser == null) return;

            // Find the other user involved in the game by excluding the current user from the chat's users.
            var tmp = chat.Users.First(x => x != currentUser.Username);
            var otherUser = users.FirstOrDefault(x => x.Username == tmp);
            // If the other user isn't found, exit the method.
            if (otherUser == null) return;

            // Check if both users were playing with each other.
            if (currentUser.PlayWith != null && currentUser.PlayWith == otherUser.Username && otherUser.PlayWith == currentUser.Username)
            {
                // Determine the message based on the game outcome or if a user left the game.
                var message = color != null ? $"{currentUser.Username} won the game." : $"{currentUser.Username} left the game.";

                // Notify both users of the game's end through a message.
                await SendMessageAsync(currentUser.Username, chat, message, false);

                // Reset the 'PlayWith' property for both users since the game has ended.
                currentUser.PlayWith = null;
                otherUser.PlayWith = null;

                // Update both users in the database to reflect these changes.
                await _userService.UpdateUserAsync(currentUser);
                await _userService.UpdateUserAsync(otherUser);

                // Notify both users' clients that the game has ended.
                await Clients.Group(otherUser.Username).SendAsync("EndGame");
                await Clients.Group(currentUser.Username).SendAsync("EndGame");
            }
        }

        // Initiates a play request with another user and handles the play acceptance logic.
        public async Task WantToPlayWith(Chat chat)
        {
            // Retrieve all users from the database.
            var users = await _userService.GetUsersAsync();
            // Identify the current user based on their connection ID.
            var currentUser = users.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            // If the current user or the chat is null, exit the method.
            if (currentUser == null || chat == null) return;

            // Find the other user involved in the play request by excluding the current user from the chat's users.
            var tmp = chat.Users.First(x => x != currentUser.Username);
            var otherUser = users.FirstOrDefault(x => x.Username == tmp);
            // If the other user isn't found, exit the method.
            if (otherUser == null) return;

            // If the current user was already in a play request with another user, notify the previous user that the request is no longer valid.
            if (currentUser.PlayWith != null)
            {
                await Clients.Group(currentUser.PlayWith).SendAsync("WantToPlayWithYou", currentUser.Username, false);
            }

            // Update the 'PlayWith' property of the current user to reflect the new play request.
            currentUser.PlayWith = otherUser.Username;
            await _userService.UpdateUserAsync(currentUser);
            // Check if both users can play and handle the acceptance logic.
            await CheckIfCanPlay(currentUser, otherUser, chat);
            // Notify the other user of the play request.
            await Clients.Group(currentUser.PlayWith).SendAsync("WantToPlayWithYou", currentUser.Username, true);
        }

        // Checks if two users can start a game and notifies them if so.
        public async Task CheckIfCanPlay(User currentUser, User otherUser, Chat chat)
        {
            // Check if both users have agreed to play with each other.
            if (!(currentUser.PlayWith == otherUser.Username && otherUser.PlayWith == currentUser.Username)) return;

            // Add both users to a SignalR group based on the chat ID.
            await Groups.AddToGroupAsync(currentUser.Username, chat.ChatId.ToString());
            await Groups.AddToGroupAsync(otherUser.Username, chat.ChatId.ToString());

            // Notify both users that they can start playing.
            await Clients.Group(chat.ChatId.ToString()).SendAsync("CanPlay");
            // Start the game for the two users.
            await StartGame(currentUser, otherUser, chat);
        }


        // Starts the game between two users and assigns colors.
        public async Task StartGame(User currentUser, User otherUser, Chat chat)
        {
            // Notify the current user with the color white.
            await Clients.Group(currentUser.Username).SendAsync("GetColor", "white");
            // Notify the other user with the color black.
            await Clients.Group(otherUser.Username).SendAsync("GetColor", "black");

            // Notify all users in the chat group about the initial turn, starting with white.
            await Clients.Group(chat.ChatId.ToString()).SendAsync("Turn", "white");
        }


        // Retrieves the chat between the current user and another user, or the general chat if specified.
        public async Task GetChat(string currentUser, string otherUser)
        {
            Chat chat;
            if (otherUser == "allChat")
            {
                // Get the general chat if requested.
                chat = await _chatService.GetChatAsync("", otherUser);
            }
            else if (!string.IsNullOrEmpty(currentUser) && !string.IsNullOrEmpty(otherUser))
            {
                var users = await _userService.GetUsersAsync();
                var current = users.FirstOrDefault(x => x.Username == currentUser);
                var other = users.FirstOrDefault(x => x.Username == otherUser);

                // If either user is not found, exit the method.
                if (current == null || other == null) return;

                // Get the chat between the current user and the other user.
                chat = await _chatService.GetChatAsync(currentUser, otherUser);

                // Disconnect the current user from their previous chat if applicable.
                if (current.CurrentChat != null)
                    await Disconnect(current.ConnectionId, current.CurrentChat.ChatId.ToString());

                // Update the current user's current chat and save changes.
                current.CurrentChat = chat;
                await _userService.UpdateUserAsync(current);
            }
            else
            {
                return; // Return early if the conditions are not met
            }

            // Add the current connection to the chat group.
            await Groups.AddToGroupAsync(Context.ConnectionId, chat.ChatId.ToString());
            // Send the retrieved chat to all users in the chat group.
            await Clients.Group(chat.ChatId.ToString()).SendAsync("GetChat", chat);
        }

        // Sends a message within the specified chat.
        public async Task SendMessageAsync(string currentUsername, Chat chat, string text, bool isFromUser)
        {
            var reciverUsername = chat.Users.First(x => x != currentUsername);
            var sender = "";
            var reciver = "";

            // Determine sender and receiver based on the chat type.
            if (chat.Users.FirstOrDefault(x => x == "allChat") != default)
            {
                sender = currentUsername;
                reciver = "All";
                reciverUsername = "allChat";
            }
            else if (isFromUser)
            {
                sender = currentUsername;
                reciver = reciverUsername;
            }
            else
            {
                sender = "Server";
                reciver = "All";
            }

            // Add the message to the chat.
            chat.Messages.Add(new Message()
            {
                Sender = sender,
                Reciver = reciver,
                Date = DateTime.Now.ToString("HH:mm"),
                Text = text
            });

            // Update the chat in the database.
            await _chatService.UpdateChatAsync(chat);

            // Send the updated chat to the sender and receiver.
            await GetChat(currentUsername, reciverUsername);

            // Notify all users in the chat group about the new message.
            await Clients.Group(chat.ChatId.ToString()).SendAsync("SendMessage", true);
        }

        // Handles the login process for a user.
        public async Task LoginUser(User user)
        {
            // Attempt to authenticate the user.
            var output = await _userService.LoginAsync(Context.ConnectionId, user.Username, user.Password);

            // If authentication is successful, proceed with login.
            if (output != null)
            {
                // Check if the user is already logged in.
                if (output.ConnectionId != null)
                {
                    // Add the user to a group based on their connection ID.
                    await Groups.AddToGroupAsync(Context.ConnectionId, Context.ConnectionId);

                    // Notify the client that the user is logged in.
                    await Clients.Group(Context.ConnectionId).SendAsync("IsLogined", null);
                }
                else
                {
                    // Update the user's connection ID and add them to a group based on their username.
                    output.ConnectionId = Context.ConnectionId;
                    await _userService.UpdateUserAsync(output);
                    await Groups.AddToGroupAsync(output.ConnectionId, output.Username);

                    // Notify the client that the user is logged in.
                    await Clients.Group(output.Username).SendAsync("IsLogined", output);
                }
            }
        }


        // Registers a new user with the provided username and password.
        public async Task RegisterUser(User user)
        {
            // Attempt to register the user with the provided credentials.
            var output = await _userService.RegisterAsync(user.Username, user.Password);

            // Notify all clients about the registration status.
            await Clients.All.SendAsync("IsRegistered", output);
        }

        // Loads all users and sends the list to all connected clients.
        public async Task LoadUsers()
        {
            // Retrieve the list of all users.
            var users = await _userService.GetUsersAsync();

            // Send the list of users to all connected clients.
            await Clients.All.SendAsync("GetUsers", users);
        }

        // Overrides the method to handle disconnection of a client.
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            // Retrieve all users currently connected.
            var users = await _userService.GetUsersAsync();

            // Find the user associated with the disconnected connection ID.
            var user = users.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            if (user != null)
            {
                // End any ongoing game the user is participating in.
                await EndGame(user.CurrentChat, null);

                // Disconnect the user and update their status.
                await Disconnect(user.ConnectionId, user.Username);
                user.ConnectionId = default;
                user.PlayWith = default;
                user.CurrentChat = default;
                await _userService.UpdateUserAsync(user);

                // Notify all clients about the updated list of users.
                await LoadUsers(); // Consider moving outside the if block

            }

            // Call the base method to handle disconnection.
            await base.OnDisconnectedAsync(exception);
        }

        // Removes a client from a specific group.
        public async Task Disconnect(string connectionId, string room)
        {
            await Groups.RemoveFromGroupAsync(connectionId, room);
        }

    }
}
