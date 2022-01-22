const db = require("../db/connection");

exports.fetchArticles = ({ sort_by = "created_at", order="desc", topic}) => {

  // need refactoring idea here (DRY)
  if(topic){
    return db
    .query(`SELECT * FROM articles WHERE topic in ($1) ORDER BY $2 ${order.toUpperCase()};`,[topic,sort_by])
    .then((result) => result.rows)
  }else{
    return db
    .query(`SELECT * FROM articles ORDER BY $1 ${order.toUpperCase()};`,[sort_by])
    .then((result) => result.rows)
  } 
};

exports.fetchArticleById = (id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id) 
    AS comment_count FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id
   WHERE articles.article_id = $1 GROUP BY articles.article_id`,
      [id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateArticle = (id, update) => {
  console.log("article:", id, "votes:", update);
  return db
    .query("UPDATE articles SET votes=$1 WHERE article_id=$2 RETURNING *;", [
      update,
      id,
    ])
    .then((result) => {
      return result.rows[0];
    });
};

exports.removeArticle = (id) => {
  console.log("article to delete:", id);
  return db.query("DELETE FROM articles where article_id=$1;", [id]);
};

exports.addArticle = (article) => {

  const { author, title, body, topic } = article;

  // check 1 valid user
  return db
    .query(
      "select EXISTS (select * from users where username=$1 limit 1) as success;",
      [author]
    )
    .then((result) => {
      if (!result.rows[0].success) {
        return;
      } else {
        // check 2 existing topic
        return db.query(
          "select EXISTS (select * from topics where slug=$1 limit 1) as success;",
          [topic]
        );
      }
    })
    .then((result) => {
      if (!result.rows[0].success) {
        return;
      } else {
        // to add- comment_count
        return db.query(
          "INSERT INTO articles (author, title, body, topic ) VALUES ($1,$2,$3,$4) RETURNING *;",
          [author, title, body, topic]
        );
      }
    })
    .then((result) => {
      return result && result.rows[0];
    });

};

