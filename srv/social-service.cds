using { social.media as db } from '../db/schema';

service SocialService {

  entity Users as projection on db.Users;
  entity Posts as projection on db.Posts;
  entity Likes as projection on db.Likes;

}
