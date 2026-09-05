const { query } = require('../../config/database');

const findAll = async ({ limit, offset }) => {
  const dataSql = `
    SELECT ss.*,
           (SELECT COUNT(*) FROM salary_rules sr WHERE sr.structure_id = ss.id) as rule_count,
           (SELECT COUNT(*) FROM contracts c WHERE c.salary_structure_id = ss.id) as employee_count
    FROM salary_structures ss
    ORDER BY ss.id DESC
    LIMIT $1 OFFSET $2
  `;
  const countSql = `SELECT COUNT(*) FROM salary_structures`;

  const dataRes = await query(dataSql, [limit, offset]);
  const countRes = await query(countSql);

  return {
    rows: dataRes.rows,
    total: parseInt(countRes.rows[0].count, 10),
  };
};

const findById = async (id) => {
  const sql = `
    SELECT ss.*,
           (SELECT COUNT(*) FROM salary_rules sr WHERE sr.structure_id = ss.id) as rule_count,
           (SELECT COUNT(*) FROM contracts c WHERE c.salary_structure_id = ss.id) as employee_count
    FROM salary_structures ss
    WHERE ss.id = $1
  `;
  const res = await query(sql, [id]);
  return res.rows[0] || null;
};

const findByCode = async (code) => {
  const res = await query('SELECT * FROM salary_structures WHERE code = $1', [code]);
  return res.rows[0] || null;
};

const create = async (data) => {
  const { name, code, description, active } = data;
  const sql = `
    INSERT INTO salary_structures (name, code, description, active)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const res = await query(sql, [name, code.toUpperCase(), description || null, active !== false]);
  return res.rows[0];
};

const update = async (id, data) => {
  const { name, code, description, active } = data;
  const sql = `
    UPDATE salary_structures
    SET name = $1, code = $2, description = $3, active = $4, updated_at = NOW()
    WHERE id = $5
    RETURNING *
  `;
  const res = await query(sql, [name, code.toUpperCase(), description || null, active !== false, id]);
  return res.rows[0];
};

const remove = async (id) => {
  const res = await query('DELETE FROM salary_structures WHERE id = $1 RETURNING *', [id]);
  return res.rows[0];
};

module.exports = {
  findAll,
  findById,
  findByCode,
  create,
  update,
  remove,
};
