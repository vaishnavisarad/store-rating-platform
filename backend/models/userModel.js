const db = require("../config/db");

/**
 * Get Stores
 */
exports.getStores = async (
  userId,
  filters
) => {
  let query = `
    SELECT
      s.id,
      s.name,
      s.address,

      ROUND(
        AVG(r.rating),
        2
      ) AS overall_rating,

      (
        SELECT rating
        FROM ratings
        WHERE user_id = ?
        AND store_id = s.id
      ) AS user_rating

    FROM stores s

    LEFT JOIN ratings r
    ON s.id = r.store_id

    WHERE 1=1

    
  `;

  const values = [userId];

  if (filters.name) {
    query +=
      " AND s.name LIKE ?";

    values.push(
      `%${filters.name}%`
    );
  }

  if (filters.address) {
    query +=
      " AND s.address LIKE ?";

    values.push(
      `%${filters.address}%`
    );
  }

  query += `
    GROUP BY s.id
    ORDER BY s.name ASC
  `;

  const [rows] =
    await db.query(query, values);

  return rows;
};

/**
 * Get User Rating
 */
exports.getUserRating = async (
  userId,
  storeId
) => {
  const [rows] =
    await db.query(
      `
      SELECT *
      FROM ratings
      WHERE user_id = ?
      AND store_id = ?
      `,
      [
        userId,
        storeId,
      ]
    );

  return rows[0];
};

/**
 * Submit Rating
 */
exports.submitRating = async ({
  user_id,
  store_id,
  rating,
}) => {
  const [result] =
    await db.query(
      `
      INSERT INTO ratings
      (
        user_id,
        store_id,
        rating
      )
      VALUES (?, ?, ?)
      `,
      [
        user_id,
        store_id,
        rating,
      ]
    );

  return result;
};

/**
 * Update Rating
 */
exports.updateRating = async (
  userId,
  storeId,
  rating
) => {
  const [result] =
    await db.query(
      `
      UPDATE ratings
      SET rating = ?
      WHERE user_id = ?
      AND store_id = ?
      `,
      [
        rating,
        userId,
        storeId,
      ]
    );

  return result;
};


/**
 * Get Store By Owner
 */
exports.getStoreByOwner = async (ownerId) => {
  const [rows] = await db.query(
    `
    SELECT *
    FROM stores
    WHERE owner_id = ?
    `,
    [ownerId]
  );

  return rows[0];
};

exports.getAverageRating = async (ownerId) => {
  const [rows] = await db.query(
    `
    SELECT
      s.id,
      s.name,
      ROUND(IFNULL(AVG(r.rating),0),2) AS average_rating,
      COUNT(r.id) AS total_ratings
    FROM stores s
    LEFT JOIN ratings r
      ON s.id = r.store_id
    WHERE s.owner_id = ?
    GROUP BY s.id, s.name
    `,
    [ownerId]
  );

  return rows;
};



/**
 * Users Who Rated Store
 */
exports.getStoreRatings = async (ownerId) => {
  const [rows] = await db.query(
    `
    SELECT
      r.id,
      u.name,
      u.email,
      s.name AS store_name,
      r.rating,
      r.created_at
    FROM ratings r
    INNER JOIN users u
      ON r.user_id = u.id
    INNER JOIN stores s
      ON r.store_id = s.id
    WHERE s.owner_id = ?
    ORDER BY r.created_at DESC
    `,
    [ownerId]
  );

  return rows;
};