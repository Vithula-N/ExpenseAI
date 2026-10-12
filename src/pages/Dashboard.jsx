import { useState, useEffect } from 'react'
import SummaryCard from '../components/SummaryCard'
import ExpenseForm from '../components/ExpenseForm'
import IncomeForm from '../components/IncomeForm'
import AIInsights from '../components/AIInsights'
import BudgetPlanner from '../components/BudgetPlanner'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts'
const CHART_COLORS = [
  '#6366F1',
  '#10B981',
  '#EF4444',
  '#F59E0B',
  '#8B5CF6',
  '#06B6D4'
]
function Dashboard() {
 const [expenses, setExpenses] = useState(() => {
  const savedExpenses = localStorage.getItem('expenses')

  return savedExpenses ? JSON.parse(savedExpenses) : []
})
  useEffect(() => {
  localStorage.setItem('expenses', JSON.stringify(expenses))
}, [expenses])

 const [income, setIncome] = useState(() => {
  const savedIncome = localStorage.getItem('income')

  return savedIncome ? JSON.parse(savedIncome) : []
})
const [searchTerm, setSearchTerm] = useState('')
const [selectedCategory, setSelectedCategory] = useState('')
const [selectedDate, setSelectedDate] = useState('')
function clearFilters() {
  setSearchTerm('')
  setSelectedCategory('')
  setSelectedDate('')
}
function resetData() {
  const confirmed = window.confirm(
    'Are you sure you want to delete all expenses and income?'
  )

  if (!confirmed) {
    return
  }

  setExpenses([])
  setIncome([])

  localStorage.removeItem('expenses')
  localStorage.removeItem('income')
}
useEffect(() => {
  localStorage.setItem('income', JSON.stringify(income))
}, [income])

  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  )
  const currentMonth = new Date().toISOString().slice(0, 7)

const monthlyExpenses = expenses
  .filter((expense) => expense.date.startsWith(currentMonth))
  .reduce(
    (total, expense) => total + Number(expense.amount),
    0
  )
  const totalIncome = income.reduce(
  (total, item) => total + Number(item.amount),
  0
)
const monthlyIncome = income
  .filter((item) => item.date.startsWith(currentMonth))
  .reduce(
    (total, item) => total + Number(item.amount),
    0
  )
  const monthlySavings = monthlyIncome - monthlyExpenses
  const savingsRate =
  monthlyIncome > 0
    ? (monthlySavings / monthlyIncome) * 100
    : 0

const balance = totalIncome - totalExpenses
const categoryTotals = expenses.reduce((totals, expense) => {
  const category = expense.category

  if (!totals[category]) {
    totals[category] = 0
  }

  totals[category] += Number(expense.amount)

  return totals
}, {})
const categoryPercentages = Object.entries(categoryTotals).map(
  ([category, total]) => ({
    category,
    total,
    percentage:
      totalExpenses > 0
        ? (total / totalExpenses) * 100
        : 0
  })
)
const filteredExpenses = expenses
  .map((expense, index) => ({
    expense,
    originalIndex: index
  }))
  .filter(({ expense }) => {
    const matchesSearch = expense.expenseName
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    const matchesCategory =
      selectedCategory === '' ||
      expense.category === selectedCategory

    const matchesDate =
      selectedDate === '' ||
      expense.date === selectedDate

    return matchesSearch && matchesCategory && matchesDate
  })

  function addExpense(expense) {
    setExpenses([...expenses, expense])
  }
function addIncome(newIncome) {
  setIncome([...income, newIncome])
}
function deleteExpense(indexToDelete) {
  const updatedExpenses = expenses.filter(
    (_, index) => index !== indexToDelete
  )

  setExpenses(updatedExpenses)
}
function editExpense(indexToEdit) {
  const expenseToEdit = expenses[indexToEdit]

  const newName = prompt(
    'Enter expense name:',
    expenseToEdit.expenseName
  )

  const newAmount = prompt(
    'Enter amount:',
    expenseToEdit.amount
  )

  const newCategory = prompt(
    'Enter category:',
    expenseToEdit.category
  )

  const newDate = prompt(
    'Enter date:',
    expenseToEdit.date
  )

  if (
    newName === null ||
    newAmount === null ||
    newCategory === null ||
    newDate === null
  ) {
    return
  }

  const updatedExpenses = expenses.map((expense, index) => {
    if (index === indexToEdit) {
      return {
        ...expense,
        expenseName: newName,
        amount: newAmount,
        category: newCategory,
        date: newDate
      }
    }

    return expense
  })

  setExpenses(updatedExpenses)
}
function deleteIncome(indexToDelete) {
  const updatedIncome = income.filter(
    (_, index) => index !== indexToDelete
  )

  setIncome(updatedIncome)
}
function exportExpensesToCSV() {
  if (filteredExpenses.length === 0) {
    alert('No expenses available to export.')
    return
  }

  const headers = ['Expense Name', 'Amount (INR)', 'Category', 'Date']

 const rows = filteredExpenses.map(({ expense }) => {
  let formattedDate = expense.date

  if (expense.date) {
    const [year, month, day] = expense.date.split('-')
    formattedDate = `${day}-${month}-${year}`
  }

  return [
    expense.expenseName,
    expense.amount,
    expense.category,
    formattedDate
  ]
})
  const csvContent = [headers, ...rows]
    .map((row) =>
      row
        .map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`)
        .join(',')
    )
    .join('\n')

  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;'
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = 'expenseai-expenses.csv'
  link.click()

  URL.revokeObjectURL(url)
}
function exportIncomeToCSV() {
  if (income.length === 0) {
    alert('No income records available to export.')
    return
  }

  const headers = ['Income Source', 'Amount (INR)', 'Date']

  const rows = income.map((item) => {
    let formattedDate = item.date

    if (item.date) {
      const [year, month, day] = item.date.split('-')
      formattedDate = `${day}-${month}-${year}`
    }

    return [
      item.incomeName,
      item.amount,
      formattedDate
    ]
  })

  const csvContent = [headers, ...rows]
    .map((row) =>
      row
        .map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`)
        .join(',')
    )
    .join('\n')

  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;'
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = 'expenseai-income.csv'
  link.click()

  URL.revokeObjectURL(url)
}
function exportMonthlyReport() {
  const reportRows = [
    ['ExpenseAI Monthly Financial Report'],
    ['Month', currentMonth],
    [],
    ['Financial Summary', 'Amount (INR)'],
    ['Monthly Income', monthlyIncome],
    ['Monthly Expenses', monthlyExpenses],
    ['Monthly Savings', monthlySavings],
    ['Savings Rate', `${savingsRate.toFixed(1)}%`],
    [],
    ['Expense Name', 'Amount (INR)', 'Category', 'Date'],
    ...expenses
      .filter((expense) => expense.date.startsWith(currentMonth))
      .map((expense) => {
        const [year, month, day] = expense.date.split('-')

        return [
          expense.expenseName,
          expense.amount,
          expense.category,
          `${day}-${month}-${year}`
        ]
      })
  ]

  const csvContent = reportRows
    .map((row) =>
      row
        .map((value) => {
          const text = String(value ?? '').replace(/"/g, '""')
          return `"${text}"`
        })
        .join(',')
    )
    .join('\n')

  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;'
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `expenseai-monthly-report-${currentMonth}.csv`
  link.click()

  URL.revokeObjectURL(url)
}
  return (
   <main id="dashboard">
     <div className="dashboard-hero">
  <div className="hero-content">
    <span className="hero-label">YOUR FINANCIAL OVERVIEW</span>

    <h1>
      Welcome back! <span>👋</span>
    </h1>

    <p>
      Take control of your money, track your spending,
      and build healthier financial habits.
    </p>
  </div>

  <div className="hero-decoration">
    <div className="hero-icon">₹</div>
    <span className="hero-sparkle sparkle-one">✦</span>
    <span className="hero-sparkle sparkle-two">✧</span>
  </div>
</div>

  <div className="summary-container">
  <div className="balance-card">
    <SummaryCard title="Balance" amount={balance} />
  </div>

  <div className="income-card">
    <SummaryCard title="Income" amount={totalIncome} />
  </div>

  <div className="expense-card">
    <SummaryCard title="Expenses" amount={totalExpenses} />
  </div>
</div>
<div className="monthly-overview">
  <h2>This Month</h2>

 <div className="monthly-cards">
  <div className="monthly-income">
    <div className="monthly-card-heading">
      <span className="monthly-card-icon">↗</span>
      <h3>Monthly Income</h3>
    </div>

    <p>₹{Number(monthlyIncome).toLocaleString('en-IN')}</p>
    <small>Money received this month</small>
  </div>

  <div className="monthly-expenses">
    <div className="monthly-card-heading">
      <span className="monthly-card-icon">↘</span>
      <h3>Monthly Expenses</h3>
    </div>

    <p>₹{Number(monthlyExpenses).toLocaleString('en-IN')}</p>
    <small>Money spent this month</small>
  </div>

  <div className="monthly-savings">
    <div className="monthly-card-heading">
      <span className="monthly-card-icon">✦</span>
      <h3>Monthly Savings</h3>
    </div>

    <p>₹{Number(monthlySavings).toLocaleString('en-IN')}</p>
    <small>Savings rate: {savingsRate.toFixed(1)}%</small>
  </div>
  </div>

  <button
    className="monthly-report-button"
    onClick={exportMonthlyReport}
  >
    📊 Download Monthly Report
  </button>
</div>
<BudgetPlanner expenses={expenses} />
<div className="forms-container">
  <ExpenseForm onAddExpense={addExpense} />
  <IncomeForm onAddIncome={addIncome} />
</div>
<AIInsights
  expenses={expenses}
  monthlyIncome={monthlyIncome}
  monthlyExpenses={monthlyExpenses}
  monthlySavings={monthlySavings}
  savingsRate={savingsRate}
/>
<div className="filter-section">
  <h2>Filter Expenses</h2>

  <div className="filter-controls">
    <input
      type="text"
      placeholder="Search expenses..."
      value={searchTerm}
      onChange={(event) => setSearchTerm(event.target.value)}
    />

    <select
      value={selectedCategory}
      onChange={(event) => setSelectedCategory(event.target.value)}
    >
      <option value="">All Categories</option>
      <option value="Food">Food</option>
      <option value="Transport">Transport</option>
      <option value="Shopping">Shopping</option>
      <option value="Bills">Bills</option>
      <option value="Entertainment">Entertainment</option>
      <option value="Other">Other</option>
    </select>

    <input
      type="date"
      value={selectedDate}
      onChange={(event) => setSelectedDate(event.target.value)}
    />
  </div>
  <button
  className="clear-filters-button"
  onClick={clearFilters}
>
  Clear Filters
</button>
<button
  className="reset-data-button"
  onClick={resetData}
>
  Reset All Data
</button>
  <button
    className="export-csv-button"
    onClick={exportExpensesToCSV}
  >
    ⬇️ Export Expenses
  </button>
  <button
  className="export-income-button"
  onClick={exportIncomeToCSV}
>
  ⬇️ Export Income
</button>
</div>
<div className="expense-summary">
  <h2>Expense Summary</h2>

  <div className="category-summary">
  {categoryPercentages.map(
    ({ category, total, percentage }) => (
      <div className="category-card" key={category}>
        <div className="category-card-header">
          <h3>{category}</h3>
          <span className="category-percentage">
            {percentage.toFixed(1)}%
          </span>
        </div>

        <p>
          ₹{Number(total).toLocaleString('en-IN')}
        </p>

        <div
          className="category-progress-track"
          role="progressbar"
          aria-label={`${category} share of total spending`}
          aria-valuenow={Number(percentage.toFixed(1))}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="category-progress-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <small>of your total spending</small>
      </div>
    )
  )}
</div>
</div>
<div className="chart-container">
  <h2>Expense Chart</h2>

  {Object.keys(categoryTotals).length === 0 ? (
    <p>No expense data available yet.</p>
  ) : (
    <PieChart width={400} height={300}>
    <Pie
  data={Object.entries(categoryTotals).map(
    ([category, total], index) => ({
      name: category,
      value: total,
      fill: CHART_COLORS[index % CHART_COLORS.length]
    })
  )}
  dataKey="value"
  nameKey="name"
  cx="50%"
  cy="50%"
  outerRadius={100}
/>

      <Tooltip />
      <Legend />
    </PieChart>
  )}
</div>
     <div className="recent-section">
  <h2>Recent Expenses</h2>

  {filteredExpenses.length === 0 ? (
  <div className="empty-state">
    <h3>No expenses found</h3>
    <p>Add your first expense to see it here.</p>
  </div>
) : (
  filteredExpenses.map(({ expense, originalIndex }) => (
<div className="expense-item" key={originalIndex}>
  <div className="expense-header">
    <h3>{expense.expenseName}</h3>
    <strong>₹{expense.amount}</strong>
  </div>

  <div className="expense-details">
    <p>{expense.category}</p>
    <p>{expense.date}</p>
  </div>
<button onClick={() => editExpense(originalIndex)}>
  Edit
</button>

<button onClick={() => deleteExpense(originalIndex)}>
  Delete
</button>
  </div>
  ))
)}
      </div>
   <div className="recent-section">
  <h2>Recent Income</h2>

 {income.length === 0 ? (
  <div className="empty-state">
    <h3>No income recorded</h3>
    <p>Add your income to see it here.</p>
  </div>
) : (
  income.map((item, index) => (
  <div className="income-item" key={index}>
  <div className="income-header">
    <h3>{item.incomeName}</h3>
    <strong>₹{item.amount}</strong>
  </div>

  <div className="income-details">
    <p>{item.date}</p>
  </div>

      <button onClick={() => deleteIncome(index)}>
        Delete
      </button>
    </div>
    ))
)}
</div>
    </main>
  )
}

export default Dashboard