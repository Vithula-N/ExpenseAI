function SummaryCard({ title, amount }) {
  const icons = {
    Balance: '💳',
    Income: '↗',
    Expenses: '↘'
  }

  const formattedAmount = Number(amount).toLocaleString('en-IN', {
    maximumFractionDigits: 2
  })

  return (
    <div className="summary-card">
      <div className="summary-card-header">
        <h3>{title}</h3>

        <span className="summary-card-icon">
          {icons[title]}
        </span>
      </div>

      <p>₹{formattedAmount}</p>

      <span className="summary-card-caption">
        {title === 'Balance'
          ? 'Your current balance'
          : title === 'Income'
            ? 'Total money received'
            : 'Total money spent'}
      </span>
    </div>
  )
}

export default SummaryCard