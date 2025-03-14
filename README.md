# Members Only

A secure, exclusive message board application where only authenticated members can see message authors, while non-members can only view the message content. This project demonstrates user authentication, authorization, and secure database operations using modern web technologies.

![Members Only Screenshot](https://placeholder-for-project-screenshot.com)

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: EJS templates, CSS
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: Passport.js, bcrypt.js
- **Session Management**: express-session with PostgreSQL session store
- **Testing**: Jest, Supertest
- **Deployment**: Ready for cloud deployment with environment variable configuration

## ✨ Features

### Core Features
- User registration and authentication system
- Exclusive membership access via secret passcode
- Message board with posts visible to all users
- Author information visible only to members
- Session-based authentication and persistence
- Password hashing for security
- Flash messages for user feedback

### Additional Features
- Admin privileges for content moderation
- Responsive design for mobile and desktop
- Form validation with error display
- PostgreSQL session store for enhanced security and scalability
- Comprehensive test suite

## 📋 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/members-only.git
   cd members-only
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_PUBLIC_URL=your_postgres_connection_string
   SESSION_SECRET=your_session_secret
   MEMBERSHIP_PASSCODE=your_club_passcode
   PORT=3000
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   npx sequelize-cli db:create
   npx sequelize-cli db:migrate
   ```

5. **Run the application**
   ```bash
   npm run dev
   ```

## 🚀 Usage

1. **Sign up** for a new account
2. **Log in** with your credentials
3. **Create messages** that will be visible to all users
4. **Join the club** by entering the secret passcode to become a member
5. Once a member, you'll be able to **see who wrote each message**
6. Admin users can **moderate content** by deleting inappropriate messages

## 🔮 Future Improvements

- Enhanced user profiles with avatars and bios
- Message categories and filtering
- Direct messaging between members
- Rich text formatting for messages
- Email verification for new accounts
- Password recovery functionality
- Social media authentication options
- Real-time notifications using WebSockets

## 📚 Learning Outcomes

Through this project, I've gained experience with:

- Implementing secure authentication and authorization flows
- Building a full-stack application with Node.js and Express
- Working with databases using Sequelize ORM
- Managing user sessions securely
- Writing and organizing maintainable code
- Creating and validating forms with error handling
- Writing tests for authentication, authorization, and CRUD operations
- Configuring an application for development and production environments

## 🌐 Live Demo

Check out the live demo of the application: [Members Only](https://members-only-demo.herokuapp.com)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
