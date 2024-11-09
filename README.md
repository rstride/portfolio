**🚀 Docker Challenges Setup with PM2 for CTF Platform**

### 👤 Contributors
- @rstride

### 🛠️ Features
- Create your own 🎮 challenges, 📁 files, 🔎 hints, 💻 code snippets, and 🏳️‍🌯 flags from the admin dashboard.
- 📁 File uploads to the server.
- ⛔ Flag submission protection against brute force.
- 🚀 Docker-based challenges.
- 📡 Dynamic flags for each team.
- 📈 Dynamic scoring with decay (decay of 15).
- 👥 Individual and team-based competitions:
  - Users can 🏃️‍♂️ play solo or form teams.
- 🎈 "First blood" tracking.
- 🚀 Docker challenges launched by team.
- 🏆 Scoreboard with automatic tie resolution.
- 📈 Global user, team, and challenge statistics.
- 👤 Individual user and team statistics.
- 🎉 Automatic competition start and end:
  - Easily set ⏳ startTime and ⏰ endTime from the admin dashboard.
- 🔧 Team and user management (promoting, banning, etc.).
- 🗘️ Customizable site (colors, background, rules, and frontpage).
- 📜 Import and export CTF scoreboards in JSON format.
- 🔧 Email verification on registration.

### 🔧 Backend & Frontend Setup for Docker Challenges (Using PM2)

#### Prerequisites
- **Node.js** (to run JavaScript code)
- **MongoDB** (for database storage)

#### 🔧 Setup Instructions

1. **🔧 Environment Variables**
   - Copy the `.env.example` to `.env` in each of the relevant directories (`/backEnd/`, `/dockerAPI/`, `/frontEnd/`).
   - Fill in the necessary information in each `.env` file.

2. **📁 MongoDB Setup**
   - Start your MongoDB database:
     - If you are on Linux or macOS, you can start MongoDB using the command:
       ```sh
       sudo systemctl start mongod
       ```
     - To ensure MongoDB starts automatically with your system, run:
       ```sh
       sudo systemctl enable mongod
       ```
     - To check if MongoDB is running, use:
       ```sh
       sudo systemctl status mongod
       ```
     - If you are testing on Windows, you may need to download MongoDB from [MongoDB Community Server](https://www.mongodb.com/try/download/community) and follow the installation instructions.

3. **🔧 FrontEnd Setup**
   - Navigate to `/frontend`.
   - Run `npm install` to install the required dependencies from `package.json`.
   - Start the frontend using `npm start` or `npm run start-react` (the latter is recommended for easier development).

4. **🔧 BackEnd Setup**
   - Navigate to `/backend`.
   - Run `npm install` to install the necessary dependencies.
   - Start the backend using `npm start`.

5. **🔧 DockerAPI Setup**
   - Navigate to `/dockerAPI`.
   - Run `npm install` to install the required dependencies.
   - Start the Docker API backend using `npm start`.

6. **🔧 Process Management Using PM2**
   - To manage your Node.js processes easily, you can use **PM2**.
   - Install PM2 globally using the following command:
     ```sh
     npm install -g pm2
     ```
   - Use PM2 to start the various components (backend, frontend, DockerAPI):
     ```sh
     pm2 start backend/server.js --name "Backend"
     pm2 start "serve -s build" --name "Frontend" --prefix frontend
     pm2 start dockerAPI/server.js --name "DockerAPI"
     ```
   - PM2 provides an easy way to manage, restart, and monitor your Node.js processes.

#### 🔒 Security Note
- Make sure to create a new account, promote it to admin, and delete the default `admin:admin` user after setup for security purposes.

#### 📢 Optional: Discord Bot Setup
- You can optionally set up a Discord bot for the CTF. Follow the instructions below:

##### Prerequisites
- **Discord.JS v13**
- **Node.JS**
- If you want to use `?launch` to display the challenge list, make sure that you add your organizers' Discord IDs into the site's database with `?auth`.

##### Installation
1. Set up a bot on [Discord Developer Portal](https://discord.com/developers).
2. Make a `.env` file with the following content:
   ```env
   DISCORD_BOT_TOKEN=<insert the bot's token>
   DISCORD_BOT_PREFIX=<prefix>

   SERVER_URI=<website url>

   MONGODB_URI=<mongodb connect url>

   CTF_NAME=<ctf name>
   ```
3. Run `npm install` to install the requirements from `package.json`.
4. Run `npm start` in the bot's directory to start the Discord bot.

### 💡 Summary
You're all set to launch your Docker challenges with PM2 managing the processes for stability and ease of use. Enjoy building and hosting secure, engaging CTF competitions!

