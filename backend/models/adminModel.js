const db = require("../config/db");

/**
 * Dashboard Statistics
 */
exports.getDashboard = async () => {
  const [[users]] = await db.query(
    "SELECT COUNT(*) AS totalUsers FROM users"
  );

  const [[stores]] = await db.query(
    "SELECT COUNT(*) AS totalStores FROM stores"
  );

  const [[ratings]] = await db.query(
    "SELECT COUNT(*) AS totalRatings FROM ratings"
  );

  return {
    totalUsers: users.totalUsers,
    totalStores: stores.totalStores,
    totalRatings: ratings.totalRatings,
  };
};

/**
 * Create User
 */
exports.createUser = async ({
  name,
  email,
  password,
  address,
  role,
}) => {
  const [result] = await db.query(
    `
    INSERT INTO users
    (
      name,
      email,
      password,
      address,
      role
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [name, email, password, address, role]
  );

  return result.insertId;
};

/**
 * Create Store
 */
exports.createStore = async ({
  name,
  email,
  address,
  owner_id,
}) => {
  const [result] = await db.query(
    `
    INSERT INTO stores
    (
      name,
      email,
      address,
      owner_id
    )
    VALUES (?, ?, ?, ?)
    `,
    [name, email, address, owner_id]
  );

  return result.insertId;
};

/**
 * Get All Users with Filters
 */
exports.getUsers = async (filters) => {
  let query = `
    SELECT
      id,
      name,
      email,
      address,
      role,
      created_at
    FROM users
    WHERE 1 = 1
  `;

  const values = [];

  if (filters.name) {
    query += " AND name LIKE ?";
    values.push(`%${filters.name}%`);
  }

  if (filters.email) {
    query += " AND email LIKE ?";
    values.push(`%${filters.email}%`);
  }

  if (filters.address) {
    query += " AND address LIKE ?";
    values.push(`%${filters.address}%`);
  }

  if (filters.role) {
    query += " AND role = ?";
    values.push(filters.role);
  }

  query += `
    ORDER BY name ASC
  `;

  const [rows] = await db.query(query, values);

  return rows;
};

/**
 * Get User By ID
 */
exports.getUserById = async (id) => {
  const [rows] = await db.query(
    `
    SELECT
      u.id,
      u.name,
      u.email,
      u.address,
      u.role,
      u.created_at,
      ROUND(AVG(r.rating),2) AS rating
    FROM users u
    LEFT JOIN stores s
      ON s.owner_id = u.id
    LEFT JOIN ratings r
      ON r.store_id = s.id
    WHERE u.id = ?
    GROUP BY u.id
    `,
    [id]
  );

  return rows[0];
};

/**
 * Get All Stores with Filters
 */
exports.getStores = async (filters) => {
  let query = `
    SELECT
      s.id,
      s.name,
      s.email,
      s.address,
      ROUND(AVG(r.rating),2) AS rating,
      COUNT(r.id) AS totalRatings
    FROM stores s
    LEFT JOIN ratings r
      ON s.id = r.store_id
    WHERE 1 = 1
  `;

  const values = [];

  if (filters.name) {
    query += " AND s.name LIKE ?";
    values.push(`%${filters.name}%`);
  }

  if (filters.email) {
    query += " AND s.email LIKE ?";
    values.push(`%${filters.email}%`);
  }

  if (filters.address) {
    query += " AND s.address LIKE ?";
    values.push(`%${filters.address}%`);
  }

  query += `
    GROUP BY s.id
    ORDER BY s.name ASC
  `;

  const [rows] = await db.query(query, values);

  return rows;
};

/**
 * Check Existing Email
 */
exports.findUserByEmail = async (email) => {
  const [rows] = await db.query(
    `
    SELECT *
    FROM users
    WHERE email = ?
    `,
    [email]
  );

  return rows[0];
};

/**
 * Check Existing Store Email
 */
exports.findStoreByEmail = async (email) => {
  const [rows] = await db.query(
    `
    SELECT *
    FROM stores
    WHERE email = ?
    `,
    [email]
  );

  return rows[0];
};

/**
 * Delete User
 */
exports.deleteUser = async (id) => {
  const [result] = await db.query(
    `
    DELETE FROM users
    WHERE id = ?
    `,
    [id]
  );

  return result;
};

/**
 * Delete Store
 */
exports.deleteStore = async (id) => {
  const [result] = await db.query(
    `
    DELETE FROM stores
    WHERE id = ?
    `,
    [id]
  );

  return result;
};

/**
 * Update User
 */
exports.updateUser = async (
  id,
  {
    name,
    email,
    address,
    role,
  }
) => {
  const [result] = await db.query(
    `
    UPDATE users
    SET
      name = ?,
      email = ?,
      address = ?,
      role = ?
    WHERE id = ?
    `,
    [
      name,
      email,
      address,
      role,
      id,
    ]
  );

  return result;
};

/**
 * Update Store
 */
exports.updateStore = async (
  id,
  {
    name,
    email,
    address,
    owner_id,
  }
) => {
  const [result] = await db.query(
    `
    UPDATE stores
    SET
      name = ?,
      email = ?,
      address = ?,
      owner_id = ?
    WHERE id = ?
    `,
    [
      name,
      email,
      address,
      owner_id,
      id,
    ]
  );

  return result;
};