const { query } = require('../../config/database');

const findAllByStructure = async (structureId) => {
  const sql = `
    SELECT sr.*, ss.name as structure_name
    FROM salary_rules sr
    JOIN salary_structures ss ON sr.structure_id = ss.id
    WHERE sr.structure_id = $1
    ORDER BY sr.sequence ASC
  `;
  const res = await query(sql, [structureId]);
  return res.rows;
};

const findById = async (id) => {
  const sql = `
    SELECT sr.*, ss.name as structure_name
    FROM salary_rules sr
    JOIN salary_structures ss ON sr.structure_id = ss.id
    WHERE sr.id = $1
  `;
  const res = await query(sql, [id]);
  return res.rows[0] || null;
};

const create = async (data) => {
  const {
    structure_id,
    name,
    code,
    category,
    sequence,
    computation_type,
    amount_fixed,
    percentage_rate,
    percentage_base_code,
    formula_script,
  } = data;

  const sql = `
    INSERT INTO salary_rules (structure_id, name, code, category, sequence, computation_type, amount_fixed, percentage_rate, percentage_base_code, formula_script)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
  `;
  const res = await query(sql, [
    structure_id,
    name,
    code.toUpperCase(),
    category,
    sequence || 10,
    computation_type,
    amount_fixed || 0,
    percentage_rate || 0,
    percentage_base_code || null,
    formula_script || null,
  ]);
  return res.rows[0];
};

const update = async (id, data) => {
  const {
    name,
    code,
    category,
    sequence,
    computation_type,
    amount_fixed,
    percentage_rate,
    percentage_base_code,
    formula_script,
  } = data;

  const sql = `
    UPDATE salary_rules
    SET name = $1, code = $2, category = $3, sequence = $4, computation_type = $5,
        amount_fixed = $6, percentage_rate = $7, percentage_base_code = $8,
        formula_script = $9, updated_at = NOW()
    WHERE id = $10
    RETURNING *
  `;
  const res = await query(sql, [
    name,
    code.toUpperCase(),
    category,
    sequence || 10,
    computation_type,
    amount_fixed || 0,
    percentage_rate || 0,
    percentage_base_code || null,
    formula_script || null,
    id,
  ]);
  return res.rows[0];
};

const remove = async (id) => {
  const res = await query('DELETE FROM salary_rules WHERE id = $1 RETURNING *', [id]);
  return res.rows[0];
};

module.exports = {
  findAllByStructure,
  findById,
  create,
  update,
  remove,
};
