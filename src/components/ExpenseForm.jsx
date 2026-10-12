import { useState } from 'react'

function ExpenseForm({ onAddExpense })  {
  const [expenseName, setExpenseName] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')

 function handleSubmit(event) {
  event.preventDefault()
if (!expenseName || !amount || !category || !date) {
  alert('Please fill in all fields.')
  return
}

if (Number(amount) <= 0) {
  alert('Amount must be greater than 0.')
  return
}
  const newExpense = {
    expenseName,
    amount,
    category,
    date
  }

  onAddExpense(newExpense)

  setExpenseName('')
  setAmount('')
  setCategory('')
  setDate('')
}

  return (
    <div className="expense-form">
      <h2>Add Expense</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Expense Name</label>
          <input
            type="text"
            placeholder="e.g. Grocery shopping"
            value={expenseName}
            onChange={(event) => setExpenseName(event.target.value)}
          />
        </div>

        <div>
          <label>Amount</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </div>

        <div>
          <label>Category</label>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">Select category</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>

        <button type="submit">Add Expense</button>
      </form>
    </div>
  )
}

export default ExpenseForm