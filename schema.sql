DROP TABLE IF EXISTS artists;
CREATE TABLE artists (
  artist_id SERIAL NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  PRIMARY KEY (artist_id)
);

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  username VARCHAR(50) NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  PRIMARY KEY (username)
);

DROP TABLE IF EXISTS movies;
CREATE TABLE movies (
  movie_id SERIAL NOT NULL,
  release_date DATE NOT NULL,
  title VARCHAR(255) NOT NULL,
  cover_url TEXT,
  synopsis TEXT NOT NULL,
  director_id INT NOT NULL,
  writer_id INT NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (movie_id),
  CONSTRAINT valid_url CHECK (cover_url ~* '^https://'),
  CONSTRAINT fk_director_movie FOREIGN KEY (director_id) REFERENCES artists (artist_id),
  CONSTRAINT fk_writer_movie FOREIGN KEY (writer_id) REFERENCES artists (artist_id)
);

DROP TABLE IF EXISTS reviews;
CREATE TABLE reviews (
  review_id SERIAL NOT NULL,
  movie_id INT NOT NULL,
  rating INT NOT NULL,
  heading TEXT NOT NULL,
  body TEXT,
  likes INT NOT NULL DEFAULT 0,
  dislikes INT NOT NULL DEFAULT 0,
  username VARCHAR(50) NOT NULL,
  PRIMARY KEY (review_id),
  CONSTRAINT valid_rating CHECK (
    rating >= 1
    AND rating <= 5
  ),
  CONSTRAINT fk_review_movie FOREIGN KEY (movie_id) REFERENCES movies (movie_id),
  CONSTRAINT fk_movie_review FOREIGN KEY (username) REFERENCES users (username)
);
CREATE INDEX idx_movie_id ON reviews (movie_id);

DROP TABLE IF EXISTS movie_categories;
CREATE TABLE movie_categories (
  movie_id INT NOT NULL,
  category VARCHAR(50) NOT NULL,
  PRIMARY KEY (movie_id, category),
  CONSTRAINT fk_movie_category FOREIGN KEY (movie_id) REFERENCES movies (movie_id)
);

DROP TABLE IF EXISTS movie_cast;
CREATE TABLE movie_cast (
  movie_id INT NOT NULL,
  artist_id INT NOT NULL,
  role VARCHAR(100) NOT NULL,
  PRIMARY KEY (movie_id, artist_id),
  CONSTRAINT fk_movie_cast_movie FOREIGN KEY (movie_id) REFERENCES movies (movie_id),
  CONSTRAINT fk_movie_cast_artist FOREIGN KEY (artist_id) REFERENCES artists (artist_id)
);

INSERT INTO artists (first_name, last_name) VALUES
  ('Steven', 'Spielberg'),
  ('Christopher', 'Nolan'),
  ('Quentin', 'Tarantino'),
  ('Martin', 'Scorsese'),
  ('James', 'Cameron');

INSERT INTO movies (title, release_date, cover_url, synopsis, director_id, writer_id) VALUES
  ('Inception', '2010-01-01', 'https://example.com/inception.jpg', 'A thief who steals corporate secrets through the use of dream-sharing technology.', 2, 2),
  ('Pulp Fiction', '2001-01-01', 'https://example.com/pulpfiction.jpg', 'The lives of two mob hitmen, a boxer, a gangster''s wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', 3, 3),
  ('Jurassic Park', '2004-01-01', 'https://example.com/jurassicpark.jpg', 'During a preview tour, a theme park suffers a major power breakdown that allows its cloned dinosaur exhibits to run amok.', 1, 1),
  ('The Wolf of Wall Street', '2005-01-01', 'https://example.com/wolfofwallstreet.jpg', 'Based on the true story of Jordan Belfort, from his rise to a wealthy stock-broker living the high life to his fall involving crime, corruption and the federal government.', 4, 4),
  ('Avatar', '2006-01-01', 'https://example.com/avatar.jpg', 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.', 5, 5);

INSERT INTO users (username, password, role) VALUES
  ('admin', '$2b$12$KIXQJZ5eF8E6jZ1Z6Z6Z6uJ8J8J8J8J8J8J8J8J8J8J8J8J8J8J8', 'admin'), -- password: adminpass
  ('user1', '$2b$12$KIXQJZ5eF8E6jZ1Z6Z6Z6uJ8J8J8J8J8J8J8J8J8J8J8J8J8', 'user'),  -- password: userpass
  ('user2', '$2b$12$KIXQJZ5eF8E6jZ1Z6Z6Z6uJ8J8J8J8J8J8J8J8J8J8J8J8', 'user');  -- password: userpass

INSERT INTO reviews (movie_id, rating, heading, body, username) VALUES
  (1, 5, 'Mind-bending masterpiece', 'Inception is a thrilling journey through the layers of dreams. A must-watch!', 'user1'),
  (2, 4, 'Classic Tarantino', 'Pulp Fiction is a stylish and witty film with unforgettable characters.', 'user2'),
  (3, 5, 'Dinosaur adventure', 'Jurassic Park is an exciting and groundbreaking film that still holds up today.', 'user1'),
  (4, 4, 'Scorsese at his best', 'The Wolf of Wall Street is a wild ride with fantastic performances.', 'user2'),
  (5, 5, 'Visual spectacle', 'Avatar is a visually stunning film with a compelling story about nature and humanity.', 'user1');
