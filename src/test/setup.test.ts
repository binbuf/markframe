describe('test framework', () => {
  it('runs tests with vitest globals', () => {
    expect(true).toBe(true)
  })

  it('has jest-dom matchers available', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    expect(div).toBeInTheDocument()
    document.body.removeChild(div)
  })
})
