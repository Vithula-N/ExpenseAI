function Navbar() {
  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId)

    if (section) {
      section.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }

  return (
    <nav className="main-navbar">
      <div className="brand">
        <div className="brand-icon">₹</div>

        <div>
          <h2>ExpenseAI</h2>
          <span>Smart Finance</span>
        </div>
      </div>

      <div className="nav-links">
        <button
          className="nav-link active"
          onClick={() => scrollToSection('dashboard')}
        >
          Dashboard
        </button>

        <button
          className="nav-link"
          onClick={() => scrollToSection('ai-insights')}
        >
          ✨ AI Insights
        </button>
      </div>
    </nav>
  )
}

export default Navbar