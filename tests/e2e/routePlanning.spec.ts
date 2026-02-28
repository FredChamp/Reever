import { test, expect } from '@playwright/test'

test.describe('Route planning', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for map canvas to be present
    await page.waitForSelector('[data-testid="map-container"]')
    await page.waitForTimeout(2000) // give MapLibre time to render
  })

  test('clicking the map adds a waypoint', async ({ page }) => {
    const mapContainer = page.getByTestId('map-container')
    const box = await mapContainer.boundingBox()
    expect(box).not.toBeNull()

    // Click near the centre of the map
    await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2)
    await page.waitForTimeout(300)

    // Waypoint list should show one entry
    await expect(page.getByTestId('waypoint-list')).toBeVisible()
    const items = page.getByTestId('waypoint-list').locator('li')
    await expect(items).toHaveCount(1)
  })

  test('two clicks produce a route and show ETA', async ({ page }) => {
    const mapContainer = page.getByTestId('map-container')
    const box = await mapContainer.boundingBox()
    expect(box).not.toBeNull()

    const cx = box!.x + box!.width / 2
    const cy = box!.y + box!.height / 2

    // First waypoint
    await page.mouse.click(cx - 80, cy)
    await page.waitForTimeout(300)

    // Second waypoint
    await page.mouse.click(cx + 80, cy)
    await page.waitForTimeout(500)

    // ETA panel should appear
    await expect(page.getByTestId('eta-panel')).toBeVisible()

    // Distance should be a number
    await expect(page.getByText(/km/)).toBeVisible()
  })

  test('clear route removes all waypoints', async ({ page }) => {
    const mapContainer = page.getByTestId('map-container')
    const box = await mapContainer.boundingBox()
    expect(box).not.toBeNull()

    const cx = box!.x + box!.width / 2
    const cy = box!.y + box!.height / 2

    await page.mouse.click(cx - 80, cy)
    await page.waitForTimeout(200)
    await page.mouse.click(cx + 80, cy)
    await page.waitForTimeout(300)

    // Clear all
    await page.getByRole('button', { name: /clear all/i }).click()
    await page.waitForTimeout(200)

    // Waypoint list should not exist (empty state shown instead)
    await expect(page.getByTestId('waypoint-list')).not.toBeVisible()
    // ETA panel placeholder
    await expect(page.getByText(/click the map to add waypoints/i)).toBeVisible()
  })

  test('ETA panel updates when speed changes', async ({ page }) => {
    const mapContainer = page.getByTestId('map-container')
    const box = await mapContainer.boundingBox()
    expect(box).not.toBeNull()

    const cx = box!.x + box!.width / 2
    const cy = box!.y + box!.height / 2

    // Add two waypoints far apart
    await page.mouse.click(cx - 150, cy)
    await page.waitForTimeout(200)
    await page.mouse.click(cx + 150, cy)
    await page.waitForTimeout(500)

    await expect(page.getByTestId('eta-panel')).toBeVisible()

    // Get current ETA text
    const etaBefore = await page.getByTestId('eta-panel').textContent()

    // Change speed to max (20 km/h) — faster = shorter ETA
    const slider = page.getByTestId('speed-slider')
    await slider.evaluate((el: HTMLInputElement) => {
      el.value = '20'
      el.dispatchEvent(new Event('input', { bubbles: true }))
      el.dispatchEvent(new Event('change', { bubbles: true }))
    })

    await page.waitForTimeout(300)

    const etaAfter = await page.getByTestId('eta-panel').textContent()

    // ETA content should have changed
    expect(etaBefore).not.toBe(etaAfter)
  })
})
