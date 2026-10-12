import { useState } from 'react'

function IncomeForm({ onAddIncome }) {
  const [incomeName, setIncomeName] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')

function handleSubmit(event) {
  event.preventDefault()

  if (!incomeName || !amount || !date) {
    alert('Please fill in all fields.')
    return
  }

  if (Number(amount) <= 0) {
    alert('Amount must be greater than 0.')
    return
  }

 

  const newIncome = {
    incomeName,
    amount,
    date
  }

  onAddIncome(newIncome)

  setIncomeName('')
  setAmount('')
  setDate('')
}

  return (
    <div className="income-form">
      <h2>Add Income</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Income Name</label>
          <input
            type="text"
            placeholder="e.g. Salary"
            value={incomeName}
            onChange={(event) => setIncomeName(event.target.value)}
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
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>

        <button type="submit">Add Income</button>
      </form>
    </div>
  )
}

export default IncomeForm