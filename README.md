# Backgammon Game With Real-Time Chat
A web-based backgammon game featuring real-time chat functionality. Developed using React for the frontend, with backend microservices in C# utilizing ASP.NET, and MongoDB for database management. Server communications are primarily asynchronous and are implemented using SignalR.


## The Project Features: 
- Follows Clean Architecture principles, meaning the code is organized into layers that are independent of each other. Contains comments explaining each chosen element and functionality.
- Adheres to async principles across all server functionality.
- Implements straightforward yet original security measures, including hashing user data and connection IDs for each socket.
- Manages server services and stores users' chat histories, while delegating intensive game logic to the client side.
- Leverages the DALL·E image generator for selecting unique project assets and color palettes.

## Installation
1. Clone the repository to your local machine.
2. Dear teacher, for instructional purposes, you may use my MongoDB instance (see `appsettings` in the Server solution). This allows for observation of object storage practices, including security measures such as hashing and connection IDs. Alternatively, you can modify the database connection string within the Server solution's `AppSettings.json` to use your MongoDB instance.
3. The repository includes screenshots of my MongoDB setup for reference.
4. Restore the NuGet packages (in Server solution).
5. Install the client's dependencies with the `npm install` command inside the client's directory using a terminal.



## Run the Project:
1. Run the Server solution (TalkBack.UI profile - port 5000/5001).
2. Run the client using a terminal with the `npm start` command (will automatically open the client in a browser on port 3000).

![MongoChats](https://github.com/Danesh0War/BackgammonWithChatServices-SingalR-Security-ASP-React/assets/139206365/bfe3fc03-e8b9-4203-b202-df43a4c57420)
![MongoUsers](https://github.com/Danesh0War/BackgammonWithChatServices-SingalR-Security-ASP-React/assets/139206365/3bffd749-ba59-4ca6-8745-8c541dd19e0b)
![LoginHub](https://github.com/Danesh0War/BackgammonWithChatServices-SingalR-Security-ASP-React/assets/139206365/770d32e5-7ff5-46d1-88b3-e71010a91526)
![ChatHub](https://github.com/Danesh0War/BackgammonWithChatServices-SingalR-Security-ASP-React/assets/139206365/d15af574-1efc-4c28-9c6c-402ea5613ecf)
![GameHub](https://github.com/Danesh0War/BackgammonWithChatServices-SingalR-Security-ASP-React/assets/139206365/87265101-dd08-4850-9c68-80a4c0a23142)


