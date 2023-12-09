# Piazza - Twitter-like Social Media API

This project is a backend API for a Twitter-like social media application. It's built with Node.js, Express, MongoDB, and uses JWT for authentication.

## Features
- User registration and login
- CRUD operations for posts
- Post likes and dislikes
- Comments on posts
- Fetch posts by topic and filter by date

## Setup
1. Install Node.js and MongoDB.
2. Clone this repository.
3. Run `npm install` to install dependencies.
4. Set environment variables: `TOKEN_SECRET` for JWT.
5. Start the server with `npm start`.

## Usage
- Use Postman or any API client to test the endpoints.
- Authenticate via the `/login` endpoint to receive a token.
- Use the token in the `auth-token` header for protected routes.

## Endpoints
- `/users/register`
- `/users/login`
- `/posts/`
- `/posts/:id`
- `/posts/:id/like`
- `/posts/:id/dislike`
- `/comments/`

## Contributing
Contributions to the project are welcome. Please ensure to follow the existing coding style and add unit tests for any new or changed functionality.

## License
[MIT](https://opensource.org/licenses/MIT)