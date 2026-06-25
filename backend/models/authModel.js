const db = require("../config/db");

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

exports.createUser = async ({
  name,
  email,
  password,
  address,
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
    VALUES (?, ?, ?, ?, 'USER')
    `,
    [
      name,
      email,
      password,
      address,
    ]
  );

  return result.insertId;
};

exports.changePassword = async (
  userId,
  hashedPassword
) => {
  const [result] = await db.query(
    `
    UPDATE users
    SET password = ?
    WHERE id = ?
    `,
    [
      hashedPassword,
      userId,
    ]
  );

  return result;
};

exports.findUserById = async (id) => {
  const [rows] = await db.query(
    `
    SELECT *
    FROM users
    WHERE id = ?
    `,
    [id]
  );

  return rows[0];
};