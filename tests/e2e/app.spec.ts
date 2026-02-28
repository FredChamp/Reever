import { test, expect } from '@playwright/test'

test.describe('App smoke tests', () => {
  test('page loads without errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check title
    await expect(page).toHaveTitle(/Reever/)

    // Check top bar is visible
    await expect(page.getByText('Reever').first()).toBeVisible()

    // Check map container exists
    await expect(page.getByTestId('map-container')).toBeVisible()

    // No fatal page errors
    expect(errors.filter((e) => !e.includes('ResizeObserver'))).toHaveLength(0)
  })

  test('sidebar is visible by default', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('sidebar')).toBeVisible()
  })

  test('sidebar can be toggled', async ({ page }) => {
    await page.goto('/')
    const toggleBtn = page.getByRole('button', { name: /close sidebar/i })
    await toggleBtn.click()
    await expect(page.getByTestId('sidebar')).not.toBeInViewport()
  })
})
