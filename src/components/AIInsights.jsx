import { useState } from 'react'
import ReactMarkdown from 'react-markdown'


function AIInsights({
  expenses,
  monthlyIncome,
  monthlyExpenses,
  monthlySavings,
  savingsRate
})  {
  const [insights, setInsights] = useState('')
  const [loading, setLoading] = useState(false)

  async function generateInsights() {
    setLoading(true)
    setInsights('')

    const expenseSummary = expenses.map((expense) => ({
      name: expense.expenseName,
      amount: Number(expense.amount),
      category: expense.category,
      date: expense.date
    }))

 const prompt = `
Analyze the following personal expense data.

All amounts are in Indian Rupees (INR). Use ₹ when referring to amounts.

Expense data:
${JSON.stringify(expenseSummary)}

Monthly financial summary:
- Monthly income: ₹${monthlyIncome}
- Monthly expenses: ₹${monthlyExpenses}
- Monthly savings: ₹${monthlySavings}
- Savings rate: ${savingsRate.toFixed(1)}%

Give:
1. A short spending summary.
2. The category where the user spends the most.
3. A short comment on the user's monthly savings.
4. Two practical suggestions to improve spending habits.

Keep the response simple and easy to understand.
`
    try {
   const controller = new AbortController()

const timeout = setTimeout(() => {
  controller.abort()
}, 30000)

const response = await fetch(
  'http://localhost:5000/api/ai-insights',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt }),
    signal: controller.signal
  }
)

clearTimeout(timeout)

      const data = await response.json()

    if (data.success) {
  setInsights(data.result)
} else {
  setInsights(
    'AI insights are temporarily unavailable. Please try again in a moment.'
  )
}
    } catch (error) {
  console.error(error)
  setInsights(
    'Could not connect to the AI service. Please make sure the backend server is running.'
  )
}

    setLoading(false)
  }

  return (
    <div className="ai-insights" id="ai-insights">
      <h2>AI Insights</h2>

      <p>Total expenses recorded: {expenses.length}</p>

   <button onClick={generateInsights} disabled={loading}>
  {loading ? 'Analyzing...' : 'Generate AI Insights'}
</button>

{loading && (
  <p className="ai-loading">
    AI is analyzing your spending patterns...
  </p>
)}

      {insights && (
  <div className="ai-result">
    <h3>AI Analysis</h3>

    <div className="ai-text">
      <ReactMarkdown>{insights}</ReactMarkdown>
    </div>
  </div>
)}
    </div>
  )
}

export default AIInsights