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

### `/users/`

1. Register a New User
    - **Endpoint:** `POST /users/register`
    - **Body:**
        - userName: String, required, unique
        - email: String, required
        - password: String, required
        - fullName: String, required
    - **Description:** Registers a new user with the provided details.
    - **Response:** 201 - Created, confirmation message.
2. User Login
    - **Endpoint:** `POST /users/login`
    - **Body:**
        - userName: String, required
        - password: String, required
    - **Description:** Authenticates a user and returns an auth-token.
    - **Response:** 200 - OK, returns auth-token.
3. Get User by ID
    - **Endpoint:** `GET /users/:id`
    - **Authorization:** Required
    - **Description:** Retrieves user details by user ID.
    - **Response:** 200 - OK, returns user details.
4. Update User Information
    - **Endpoint:** `PUT /users/:id`
    - **Authorization:** Required
    - **Body:** Fields to be updated.
    - **Description:** Updates the information of the authenticated user.
    - **Response:** 200 - OK, returns updated user details.
5. Delete User
    - **Endpoint:** `DELETE /users/:id`
    - **Authorization:** Required
    - **Description:** Deletes the authenticated user's account.
    - **Response:** 200 - OK, confirmation message.

### `/posts/`

1. Create a New Post
    - **Endpoint:** `POST /posts/`
    - **Authorization:** Required
    - **Body:**
        - content: String, required
        - topic: String, required
        - validUntil: String, optional (format: number + m/h/d, e.g., 30m, 4h, 1d) default values is 30 days
    - **Description:** Creates a new post. validUntil sets when the post expires.
    - **Response:** 201 - Created, returns the created post.
2. Get All Posts
    - **Endpoint:** `GET /posts/`
    - **Authorization:** Optional
    - **Query Parameters** (for authenticated users):
        - createdTo: Date string, optional
        - createdFrom: Date string, optional
        - archiveOnly: Boolean, optional
        - maxInterest: Boolean, optional
        - validOnly: Boolean, optional
    - **Description:** Retrieves all posts. Authenticated users can apply filters.
    - **Response:** 200 - OK, returns an array of posts.
3. Get a Specific Post by ID
    - **Endpoint:** `GET /posts/:id`
    - **Authorization:** Required
    - **Description:** Retrieves a specific post by ID.
    - **Response:** 200 - OK, returns the requested post.
4. Update a Post
    - **Endpoint:** `PUT /posts/:id`
    - **Authorization:** Required
    - **Body:** Fields to update, validUntil can be updated with the same format as in creation.
    - **Description:** Updates the specified post.
    - **Response:** 200 - OK, returns the updated post.
5. Get All Posts by Topic
    - **Endpoint:** `GET /posts/topic/:topic`
    - **Authorization:** Optional
    - **Query Parameters:** Same as "Get All Posts."
    - **Description:** Retrieves all posts with a specific topic.
    - **Response:** 200 - OK, returns posts filtered by topic.
6. Delete a Post
    - **Endpoint:** `DELETE /posts/:id`
    - **Authorization:** Required
    - **Description:** Deletes the specified post and its associated comments.
    - **Response:** 200 - OK, confirmation of deletion.
7. Like a Post
    - **Endpoint:** `PUT /posts/:id/like`
    - **Authorization:** Required
    - **Description:** Increments the like count of a post, self-like not allowed.
    - **Response:** 200 - OK, returns the updated post.
8. Dislike a Post
    - **Endpoint:** `PUT /posts/:id/dislike`
    - **Authorization:** Required
    - **Description:** Increments the dislike count of a post, respects validUntil.
    - **Response:** 200 - OK, returns the updated post.

### `/comments/`

1. Post a New Comment
    - **Endpoint:** `POST /comments/`
    - **Authorization:** Required
    - **Body:**
        - content: String, required
        - post: Post ID, required
    - **Description:** Creates a new comment on a given post.
    - **Response:** 201 - Created, returns the newly created comment.
2. Get Comments for a Specific Post
    - **Endpoint:** `GET /comments/post/:postId`
    - **Authorization:** Not Required
    - **Params:**
        - postId: ID of the post
    - **Description:** Retrieves all comments associated with a specific post.
    - **Response:** 200 - OK, returns an array of comments.
3. Delete a Comment
    - **Endpoint:** `DELETE /comments/:commentId`
    - **Authorization:** Required
    - **Params:**
        - commentId: ID of the comment to delete
    - **Description:** Deletes a comment if the authenticated user is the author.
    - **Response:** 200 - OK, returns confirmation of deletion.

## Contributing
Contributions to the project are welcome. Please ensure to follow the existing coding style and add unit tests for any new or changed functionality.

## License
[MIT](https://opensource.org/licenses/MIT)