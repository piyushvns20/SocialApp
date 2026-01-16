namespace social.media;

entity Users {
  key ID       : UUID;
      name     : String(100);
      email    : String(100);
      createdAt: Timestamp;
}

entity Posts {
  key ID       : UUID;
      content  : String(500);
      createdAt: Timestamp;
      author   : Association to Users;
}

entity Likes {
  key ID    : UUID;
      post  : Association to Posts;
      user  : Association to Users;
}

