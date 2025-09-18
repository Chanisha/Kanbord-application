# Note Management Backend

A MERN stack backend for the Note Management Board application.

## Features

- User authentication with JWT
- CRUD operations for notes
- User-specific note management
- Input validation and error handling
- MongoDB integration

## API Endpoints

### Authentication Routes

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Note Routes (All protected)

- `POST /api/notes` - Create a new note
- `GET /api/notes` - Get all notes for logged-in user
- `GET /api/notes/:id` - Get a specific note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

## Setup Instructions

1. **Install Dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**
   - Copy `config.env` and update the values:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A secure secret for JWT signing
     - `PORT`: Server port (default: 5000)

3. **Start MongoDB**
   - Make sure MongoDB is running on your system
   - Default connection: `mongodb://localhost:27017/note-management`

4. **Run the Server**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## Environment Variables

Create a `.env` file in the backend directory:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/note-management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

## API Usage Examples

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login User

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Note (with JWT token)

```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My First Note",
    "content": "This is the content of my note",
    "category": "In Development",
    "priority": "High"
  }'
```

## Database Schema

### User Schema

- firstName: String (required)
- lastName: String (required)
- email: String (required, unique)
- password: String (required, hashed)
- createdAt: Date
- updatedAt: Date

### Note Schema

- title: String (required)
- content: String (required)
- category: String (enum: Unassigned, In Development, Pending Review, Done)
- priority: String (enum: Low, Medium, High)
- dueDate: Date (optional)
- tags: Array of Strings
- isCompleted: Boolean
- user: ObjectId (reference to User)
- createdAt: Date
- updatedAt: Date
