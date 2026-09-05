const { query } = require('../../config/database');

const findAll = async ({ limit, offset }) => {
  const dataSql = `
    SELECT ws.*, 
           (SELECT COUNT(*) FROM employees e WHERE e.schedule_id = ws.id) as employee_count
    FROM working_schedules ws
    ORDER BY ws.id DESC
    LIMIT $1 OFFSET $2
  `;
  const countSql = `SELECT COUNT(*) FROM working_schedules`;

  const dataRes = await query(dataSql, [limit, offset]);
  const countRes = await query(countSql);

  return {
    rows: dataRes.rows,
    total: parseInt(countRes.rows[0].count, 10),
  };
};

const findById = async (id) => {
  const sql = `
    SELECT ws.*, 
           (SELECT COUNT(*) FROM employees e WHERE e.schedule_id = ws.id) as employee_count
    FROM working_schedules ws
    WHERE ws.id = $1
  `;
  const res = await query(sql, [id]);
  return res.rows[0] || null;
};

const create = async (data) => {
  const { name, type, weekly_hours, pattern } = data;
  const sql = `
    INSERT INTO working_schedules (name, type, weekly_hours, pattern)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const res = await query(sql, [name, type || 'Standard', weekly_hours, JSON.stringify(pattern)]);
  return res.rows[0];
};

const update = async (id, data) => {
  const { name, type, weekly_hours, pattern } = data;
  const sql = `
    UPDATE working_schedules
    SET name = $1, type = $2, weekly_hours = $3, pattern = $4, updated_at = NOW()
    WHERE id = $5
    RETURNING *
  `;
  const res = await query(sql, [name, type || 'Standard', weekly_hours, JSON.stringify(pattern), id]);
  return res.rows[0];
};

const remove = async (id) => {
  const res = await query('DELETE FROM working_schedules WHERE id = $1 RETURNING *', [id]);
  return res.rows[0];
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
