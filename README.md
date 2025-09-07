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
