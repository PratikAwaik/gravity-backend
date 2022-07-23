# Ideation

## Schema

### Users

#### `Columns`

- id
- username
- prefixed_username
- email
- password
- profile_pic
- created_at
- updated_at

#### `Relations`

- With Subreddits as an admin

  - User has many Subreddits
  - Subreddit belongs to a User (currently only one admin can manage a Subreddit)

- With Subreddits as a member

  - User can be a member of many Subreddits
  - Subreddit can have one unique member

- With Posts as an author

  - User has many posts (as an author)
  - Post belongs to User

- With Posts as saved

  - User has many Posts (saved)
  - (Saved) Post belongs to User

- With Comments as an author

  - User has many comments (as an author)
  - Comment belongs to a User

- With Comments as saved

  - User has many comments (saved)
  - (Saved) Comment belongs to User

- With Votes on a Post

  - User can vote many posts
  - Votes can be done by many user

- With Votes on a Comment
  - User can vote many comments
  - Votes can be done by mamy user

### Subreddits

#### `Columns`

- id
- name
- prefixed_name
- description
- icon
- admin_id
- created_at
- updated_at

#### `Relations`

- With Users as an admin

  - User has many Subreddits
  - Subreddit belongs to a User (currently only one admin can manage a Subreddit)

- With Posts
  - Subreddit has many Posts
  - Post belongs to a Subreddit

### Posts

#### `Columns`

- id
- title
- content
- author_id
- subreddit_id
- type
- created_at
- updated_at

#### `Relations`

- With Users

  - User has many posts
  - Post belongs to User

- With Posts
  - Subreddit has many Posts
  - Post belongs to a Subreddit
