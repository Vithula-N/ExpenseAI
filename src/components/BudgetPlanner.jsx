import { useState } from 'react'

function BudgetPlanner({ expenses }) {
 const [budgets, setBudgets] = useState(() => {
  const savedBudgets = localStorage.getItem('expenseai-budgets')

  return savedBudgets
    ? JSON.parse(savedBudgets)
    : {
        Food: '',
        Transport: '',
        Shopping: '',
        Bills: '',
        Entertainment: '',
        Other: ''
      }
})
function handleBudgetChange(category, value) {
  setBudgets((previousBudgets) => {
    const updatedBudgets = {
      ...previousBudgets,
      [category]: value
    }

    localStorage.setItem(
      'expenseai-budgets',
      JSON.stringify(updatedBudgets)
    )

    return updatedBudgets
  })
}
function getCategorySpending(category) {
  const currentMonth = new Date().toISOString().slice(0, 7)

  return expenses
    .filter(
      (expense) =>
        expense.category === category &&
        expense.date?.startsWith(currentMonth)
    )
    .reduce(
      (total, expense) => total + Number(expense.amount),
      0
    )
}
const totalBudget = Object.values(budgets).reduce(
  (total, budget) => total + (Number(budget) || 0),
  0
)

const totalSpent = Object.keys(budgets).reduce(
  (total, category) => total + getCategorySpending(category),
  0
)

const totalRemaining = totalBudget - totalSpent
const budgetUsage =
  totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

const budgetHealth =
  totalBudget === 0
    ? 'Set Your Budget'
    : budgetUsage >= 100
      ? 'Over Budget'
      : budgetUsage >= 80
        ? 'Caution'
        : 'Healthy'
 return (
  <div className="budget-planner">
    <div className="budget-summary">
  <div className="budget-summary-card">
    <span>💰 Total Budget</span>
    <h3>₹{totalBudget.toLocaleString('en-IN')}</h3>
  </div>

  <div className="budget-summary-card">
    <span>💸 Total Spent</span>
    <h3>₹{totalSpent.toLocaleString('en-IN')}</h3>
  </div>

  <div className="budget-summary-card">
    <span>🎯 Budget Remaining</span>
    <h3>
      ₹{totalRemaining.toLocaleString('en-IN')}
    </h3>
  </div>
  <div className="budget-summary-card budget-health-card">
  <span>💚 Budget Health</span>

  <h3
    className={
      budgetHealth === 'Healthy'
        ? 'health-healthy'
        : budgetHealth === 'Caution'
          ? 'health-caution'
          : budgetHealth === 'Over Budget'
            ? 'health-over'
            : 'health-empty'
    }
  >
    {budgetHealth}
  </h3>

  <small>{budgetUsage.toFixed(1)}% of total budget used</small>
</div>
</div>
    <h2>🎯 Monthly Budget Planner</h2>

    <p>Set your monthly spending limits for each category.</p>

    <div className="budget-inputs">
      {Object.keys(budgets).map((category) => {
        const spent = getCategorySpending(category)
        const budget = Number(budgets[category]) || 0
        const remaining = budget - spent

        const percentage =
          budget > 0 ? (spent / budget) * 100 : 0

        const progress = Math.min(percentage, 100)

        return (
          <div className="budget-input-group" key={category}>
            <label htmlFor={`budget-${category}`}>
              {category}
            </label>

            <input
              id={`budget-${category}`}
              type="number"
              min="0"
              placeholder="Enter budget (₹)"
              value={budgets[category]}
              onChange={(event) =>
                handleBudgetChange(category, event.target.value)
              }
            />

            <div className="budget-progress-details">
              <p>
                Spent: ₹{spent.toLocaleString('en-IN')}
              </p>

              <p>
                Budget: ₹{budget.toLocaleString('en-IN')}
              </p>

              <p>
                {remaining >= 0
                  ? `Remaining: ₹${remaining.toLocaleString('en-IN')}`
                  : `Over budget by: ₹${Math.abs(remaining).toLocaleString('en-IN')}`}
              </p>

              <p>
                Used: {percentage.toFixed(1)}%
              </p>
            </div>

            <div
              className="budget-progress-track"
              role="progressbar"
              aria-label={`${category} budget usage`}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={Math.min(percentage, 100)}
            >
              <div
                className={`budget-progress-fill ${
                  percentage >= 100
                    ? 'over-budget'
                    : percentage >= 80
                      ? 'near-budget'
                      : ''
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>

            {budget > 0 && percentage >= 80 && (
              <small className="budget-warning">
                {percentage >= 100
                  ? '⚠️ Budget exceeded!'
                  : '⚡ You are approaching your budget limit!'}
              </small>
            )}
          </div>
        )
      })}
    </div>
  </div>
)
}

export default BudgetPlanner