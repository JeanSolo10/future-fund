import Decimal from 'decimal.js';
import type { ExpenseDataType } from './types';

const listOfColors = [
  'rgba(231, 76, 60, 1)' /* Red */,
  'rgba(52, 152, 219, 1)' /* Blue */,
  'rgba(46, 204, 113, 1)' /* Green */,
  'rgba(230, 126, 34, 1)' /* Orange */,
  'rgba(26, 188, 156, 1)' /* Turquoise */,
  'rgba(241, 196, 15, 1)' /* Yellow */,
  'rgba(155, 89, 182, 1)' /* Purple */,
  'rgba(236, 240, 241, 1)' /* Light Gray */,
  'rgba(149, 165, 166, 1)' /* Gray */,
  'rgba(192, 57, 43, 1)' /* Dark Red */,
  'rgba(41, 128, 185, 1)' /* Dark Blue */,
  'rgba(39, 174, 96, 1)' /* Dark Green */,
  'rgba(243, 156, 18, 1)' /* Dark Orange */,
  'rgba(142, 68, 173, 1)' /* Dark Purple */,
  'rgba(22, 160, 133, 1)' /* Dark Turquoise */,
  'rgba(211, 84, 0, 1)' /* Burnt Orange */,
  'rgba(44, 62, 80, 1)' /* Dark Slate */,
  'rgba(127, 140, 141, 1)' /* Medium Gray */,
  'rgba(189, 195, 199, 1)' /* Silver */,
  'rgba(255, 87, 34, 1)' /* Deep Orange */,
];

/**
 * Aggregates expenses by category and returns formatted data for a pie chart.
 * Groups expenses by their category, sums the amounts per category, and returns
 * the totals along with corresponding colors for visualization.
 * @param {ExpenseDataType[]} expenses array of expenses to aggregate
 * @returns {{data: string[], colors: string[]}} Object containing:
 * - data: array of total amounts per category as strings
 * - colors: array of RGBA color strings (one per unique category)
 * - categories: array of categories used when formatting
 */

export const getPieChartDataByExpenseCategory = (
  expenses: ExpenseDataType[],
) => {
  let amountOfUniqueCategories = 0;

  expenses.sort((a, b) => {
    const nameA = a.name.toLocaleLowerCase();
    const nameB = b.name.toLocaleLowerCase();

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

  const seenCategories: Record<string, number> = {};
  const totalPerCategory: Record<string, Decimal | string> = {};
  const expensesInCategory: Record<string, string[]> = {};

  for (let i = 0; i < expenses.length; i += 1) {
    const expenseCategory = expenses[i].category;
    const expenseAmount = new Decimal(expenses[i].amount);
    const expenseName = expenses[i].name;

    if (!seenCategories[expenseCategory]) {
      seenCategories[expenseCategory] = 1;
      amountOfUniqueCategories += 1;
      totalPerCategory[expenseCategory] = expenseAmount;
      expensesInCategory[expenseCategory] = [expenseName];
    } else {
      const currTotal = new Decimal(totalPerCategory[expenseCategory]);
      totalPerCategory[expenseCategory] = currTotal.plus(expenseAmount);
      expensesInCategory[expenseCategory].push(expenseName);
    }
  }

  return {
    data: Object.values(totalPerCategory).map((total) => total.toString()),
    colors: listOfColors.slice(0, amountOfUniqueCategories),
    categories: Object.keys(totalPerCategory).map((category) => category),
  };
};
