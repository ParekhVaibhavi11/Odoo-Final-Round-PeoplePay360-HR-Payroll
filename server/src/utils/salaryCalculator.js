const { RULE_CATEGORY, COMPUTATION_TYPE } = require('../config/constants');

/**
 * Calculates salary breakdown for a single employee based on assigned rules and contract wage.
 * @param {Array} rules - Sorted by sequence ASC
 * @param {Number} basicWage - Base contract wage
 * @returns {Object} { lines, basic, gross, deduction, net }
 */
const computeSalary = (rules, basicWage) => {
  let basic = parseFloat(basicWage || 0);
  let gross = basic;
  let deduction = 0;
  let net = basic;

  const categoryTotals = {
    BASIC: basic,
    ALLOWANCE: 0,
    GROSS: basic,
    DEDUCTION: 0,
    NET: basic,
  };

  const calculatedLines = [];

  // Sort rules by sequence explicitly just in case
  const sortedRules = [...rules].sort((a, b) => a.sequence - b.sequence);

  for (const rule of sortedRules) {
    let amount = 0;

    if (rule.computation_type === COMPUTATION_TYPE.FIXED) {
      amount = parseFloat(rule.amount_fixed || 0);
    } else if (rule.computation_type === COMPUTATION_TYPE.PERCENTAGE) {
      const baseCategory = rule.percentage_base_code || 'BASIC';
      const baseAmount = categoryTotals[baseCategory] || basic;
      const rate = parseFloat(rule.percentage_rate || 0);
      amount = (baseAmount * rate) / 100;
    } else if (rule.computation_type === COMPUTATION_TYPE.FORMULA && rule.formula_script) {
      try {
        // Safe evaluation context with category totals & basic
        const context = { ...categoryTotals, BASIC: basic, WAGE: basic };
        const keys = Object.keys(context);
        const values = Object.values(context);
        const exprFunc = new Function(...keys, `return ${rule.formula_script};`);
        amount = parseFloat(exprFunc(...values)) || 0;
      } catch (err) {
        console.error(`Error evaluating formula for rule ${rule.code}:`, err.message);
        amount = 0;
      }
    }

    amount = parseFloat(amount.toFixed(2));

    // Update cumulative category totals
    if (rule.category === RULE_CATEGORY.ALLOWANCE) {
      categoryTotals.ALLOWANCE += amount;
      categoryTotals.GROSS += amount;
    } else if (rule.category === RULE_CATEGORY.DEDUCTION) {
      categoryTotals.DEDUCTION += amount;
    } else if (rule.category === RULE_CATEGORY.BASIC) {
      categoryTotals.BASIC = amount;
    }

    // Always update NET = GROSS - DEDUCTION
    categoryTotals.NET = categoryTotals.GROSS - categoryTotals.DEDUCTION;

    calculatedLines.push({
      salary_rule_id: rule.id,
      code: rule.code,
      name: rule.name,
      category: rule.category,
      sequence: rule.sequence,
      amount,
    });
  }

  return {
    lines: calculatedLines,
    basic: parseFloat(categoryTotals.BASIC.toFixed(2)),
    gross: parseFloat(categoryTotals.GROSS.toFixed(2)),
    deduction: parseFloat(categoryTotals.DEDUCTION.toFixed(2)),
    net: parseFloat(categoryTotals.NET.toFixed(2)),
  };
};

module.exports = {
  computeSalary,
};
