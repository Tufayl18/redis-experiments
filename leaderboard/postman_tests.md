# Postman Testing Guide

This guide provides the JSON request bodies and details for testing the leaderboard API endpoints in Postman.

---

## 1. Increase Page Views
Increment the view count of a specific post.

* **Method**: `POST`
* **URL**: `http://localhost:3000/post/first-post/view`

---

## 2. Increase User Score
Add or increment the score of a user in the leaderboard.

* **Method**: `POST`
* **URL**: `http://localhost:3000/score`
* **Body**: Select `raw` and `JSON` format.
  ```json
  {
    "userId": "player_alex",
    "score": 15
  }
  ```

---

## 3. Get Top 10 Leaderboard
Retrieve the top 10 users ranked from highest to lowest score.

* **Method**: `GET`
* **URL**: `http://localhost:3000/leaderboard`

---

## 4. Get User's Rank
Retrieve the 0-based rank of a specific user.

* **Method**: `GET`
* **URL**: `http://localhost:3000/rank`
* **Body**: Select `raw` and `JSON` format.
  ```json
  {
    "userId": "player_alex"
  }
  ```

---

## 5. Get Post Views
Retrieve the total view count of a specific post.

* **Method**: `GET`
* **URL**: `http://localhost:3000/post/my-awesome-post-123/views`

