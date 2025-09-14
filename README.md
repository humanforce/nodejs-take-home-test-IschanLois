
> **_NOTE:_**  Kindly go [here](#movie-reviews-api) for the APIs documentation

# 🎬 Humanforce | Node.js Take Home Exercise

Welcome! 👋  
Thanks for taking the time to complete this take home exercise. The goal is to see how you think about backend design, coding practices, and problem-solving in a real-world(ish) scenario.

You should aim to spend **roughly 4 hours** on this challenge. Please don’t over-engineer or polish endlessly — we value your time, and we’re more interested in your approach and clarity of thought than building a fully production-ready API.

---

## 📖 The Brief

Your task is to build a simple **Movie Reviews API**. Imagine we’re building a lightweight clone of IMDb or Letterboxd.

### Core Requirements

Your API should support the following endpoints:

#### Movies
- Add a new movie (including uploading/saving a cover image).
- Edit a movie’s details.
- Delete a movie.

#### Reviews
- Post a review & rating (1–5 stars) for a movie.

#### Queries
- Get the average rating and list of reviews for a movie.
- Get the top *N* movies by average rating.

### Database

Include a either **MySQL** or **Postgres** database for persistence. We have intentionally not specified a schema, we’d like to see how you approach data modelling and normalisation.

### Tests

Add **unit tests** that demonstrate correctness of your core logic.  

---

## ✨ Stretch Goals (optional)

If you’ve got extra time or ideas, feel free to extend the project. Here are a few directions you could take:  

- Add **basic authentication** (e.g. signup/login, JWT tokens).
- Integrate with the **IMDb API** (or another public movie API) to enrich movie data.
- Add a **search endpoint** (e.g. find movies by partial title, genre, year).

These aren’t required but can showcase how you think beyond the basics.  

---

## ⚙️ Expectations

- Use **Node.js** with JavaScript or TypeScript.
- Use either **MySQL** or **Postgres** for persistence.
- Write clear, maintainable code.
- Include a `README.md` that:
  - Explains how to set up and run your project.
  - Describes your design decisions and trade-offs.

---

## 🧮 Assessment Rubric

We’ll assess your submission across the following areas:

| Category                  | Weight | What we look for |
|---------------------------|--------|------------------|
| **API Design**            | 25%    | Clear, consistent endpoints, follows REST principles, appropriate status codes |
| **Data Modeling & SQL**   | 25%    | Thoughtful schema design, normalisation, appropriate constraints/relationships, use of joins/aggregates |
| **Code Quality**          | 20%    | Readability, structure, use of idiomatic Node.js/TS, error handling |
| **Testing**               | 15%    | Meaningful unit tests, evidence of testing mindset |
| **Documentation**         | 10%    | Clear setup instructions, rationale for decisions |
| **Stretch / Creativity**  | 5%     | Extra features, polish, or innovative ideas (optional) |

---

## 💡 Tips

- Don’t stress about “perfect” — we’re more interested in your approach than whether you cover every edge case.
- Use frameworks/libraries you’re comfortable with (Express, Fastify, Nest.js — your choice).
- Small but well-thought-out beats sprawling and unfinished.
- Bonus points if your commit history shows how you worked through the problem incrementally.

---

## 💁‍♂️ Help & Support
Should you have any questions or need to clarify requirements, please reach out to our friendly talent team or your hiring manager.


# Movie Reviews API

## Local setup

### Prerequisites
Install the following dependencies
- [Docker](https://docs.docker.com/engine/install/)
- [Node.js](https://nodejs.org/en/download/) - or use nvm
  - Node 20 was used for developing this API so for maximum compatibility use node v20

### Steps
1. Clone this repository.
2. Set the current working directory to the root of local repository.
3. Build the dockerfile which should pull and configure a postgres image.
```
docker build -t postgres .
```
4. Instantiate a postgres container using this command. This should make available the postgres database to the host os.
```
docker run -p 5432:5432 --env-file .env.db.local -d --name postgres postgres
```
5. **(OPTIONAL)** check if the postgres container is running using:
```
docker ps
```
6. Install the npm dependencies:
```
npm install
```
7. Once the postgres container is running and the npm dependencies are installed, we can now start the server.
```
npm start
```
8. Validate that the server is up by sending a request. There should be a JSON string for initially loaded data.
```
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJyb2xlIjoiYWRtaW4ifQ.0GnCYBlPZXVFHZhhzUbjXQy11IR26e3VgzrtZgLppqQ" "http://127.0.0.1:3000/api/v1/movies/top-rated?limit=10"
```
9. **(OPTIONAL)** refer to [seeding](#seeding) section to seed the database with data from [TMDB](https://developer.themoviedb.org/)

## Domain model

![domain-model](./domain-model.jpg)

This domain model is a rough diagram of the relations and relationships that would satisfy the data requirements of the API.

Check [schema.sql](/schema.sql) to see on how these attributes are defined.

1. **Movies**
   - A relation representing a movie.
   - An artificial primary key `movie_id` is used since `title` could not be considered unique.
   - For cover image, instead of storing the image as a `BLOB`, I decided to store a `cover_url` denoting an http url returned by an object storage. Given that a cover image can get quite big, this would be a bottleneck for writing to the relation.
   - A separate endpoint for image upload is created. This endpoint would return the http url that exposes the image. The consumer could use this endpoint before creating a movie. `cover_url` is set to NULLABLE to allow defer of image upload. The tradeoff on write complexity will not be that high given that it's just one more api call.
   - `is_deleted` field is for soft deletion. A movie has a 1-to-N relationship with reviews, and there could be numerous reviews. Cascading the delete would not be a good idea as it could lead to db load and server latency issues. Restricting is also not an option for current use case. Soft delete allows us to mark rows that could be cleaned up (together with relationships) by a job in non-peak hours.
   - It has N-to-1 relationship to artists table on `writer_id` and `director_id`

2. **Reviews**
   - A relation representing a movie review.
   - `rating` is from 1 to 5 (inclusive).
   - To provide context on reviews, at the very least, `heading` is required (`body` is not). This would allow evaluation of review weights. Not all reviews are meaningful, especially spiteful/spam ones. To provide data meaningfulness, having context is necessary. Currently, average rating is calculated using the average mean, but having different weights on reviews could potentially allow weighted average rating.
   - An additional index is created on the `movie_id` foreign key. Yes, this would add an overhead on writing reviews, but a movie reviews api would most likely be more read-heavy. An average user may write a handful of reviews, but would be reading more views.

  3. **Users**
    - A relation representing a REGISTERED users of the api.

  4. **Movie Categories**
    - A normalisation relation to list the categories of a movie.
  
  5. **Artists**
    - A relation representing people involved with movie making (writes, directors, actors).

  6. **Movie Cast**
    - A relationship table for mapping movies to artists (actors) since they have N-to-N relationship.

## Endpoints

For server to database integration, an ORM `sequelize` is used for sanitation and ease of writing to the DB. However, sequelize native methods are only used for writing, querying is done using `RAW` queries.

### Auth

**IMPORTANT**: all request to the server apart from the `auth` requires a `Bearer token` (JWT) in Authorization header for authentication. You can use the `signup` endpoint to create a `user` and call the `login` endpoint to get a token. You can also use this token.

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJyb2xlIjoiYWRtaW4ifQ.0GnCYBlPZXVFHZhhzUbjXQy11IR26e3VgzrtZgLppqQ
```

1. POST - `/api/v1/auth/signup`
   - creates a new `USER` using a name and a password.
2. POST - `/api/v1/auth/login`
   - creates a JWT session token for a user if the `username` and `password` in the request body is valid.

### Movies

1. GET - `/api/v1/movies/top-rated?limit=N`
   - gets the top N movies by average rating.
   - this uses `INNER JOIN` when matching movies with reviews. Meaning movies with no reviews would not be included in the ranking. This makes the data returned meaningful as it would not return random data without some heuristic.
2. POST - `/api/v1/movies/`
   - creates a new movies row in the database.
3. POST - `/api/v1/movies/:movieId/images`
   - for uploading movie cover image.
   - for simplicity this just checks the file extension and mimetype for sanitation.
4. PATCH - `/api/v1/movies/:movieId`
   - for editing movie details.
5. DELETE - `/api/v1/movies/:movieId`
   - for deleting a movie.

### Movie Reviews
- Represent the relationship between movie and reviews

1. GET - `/api/v1/movies/:movieId/reviews?limit=N&page=M`
   - gets the average rating of a movie AND the list of reviews of that movie.
   - the list of reviews is paginated.
   - the calculation for average rating and getting the list of reviews is done in 2 separate queries for these reasons:
     - Average tend to changes less often for larger datasets, hence a good candidate for caching
     - Average is reasonably cheap to query for smaller datasets
     -  Have some decoupling with list of reviews, so that we can paginate reviews

2. POST - `/api/v1/movies/:movieId/reviews`
   - for creating a movie review

## Seeding

We can seed the data from TMDB API to mock meaningful data.

1. Generate an API key from [TMDB](https://developer.themoviedb.org/) by signing up or logging in.
2. Copy your API key and supply the `TMDB_API_KEY` in [seed/.env](/seed/.env). Like so:
```
TMDB_API_URL=https://api.themoviedb.org/3
TMDB_API_KEY=your_api_key
...
```
3. Run the command for seeding.
```
npm run seed
```

> **_NOTE:_**  Currently I'm sometimes getting DNS errors for the TMDB api, making it unable to connect to the api. Might be a DNS configuration issue with my machine. But if you experience the same, just retry it until it succeeds.
