// agents/implementationAgent.js
import chalk from 'chalk';

class ImplementationAgent {
    constructor() {
        this.name = "Playwright Code Smith Agent";
    }

    async generateCode(testPlan) {
        console.log(chalk.blue(`⚙️ ${this.name} is forging Playwright tests...`));

        const testCode = `// tests/birla-white-login.spec.js
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://uatawsexpertsclub.birlawhite.com/'; // Update this URL

test.describe('Birla White Experts Club Login Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('TC001 - Successful Login (Happy Path)', async ({ page }) => {
    await page.fill('input[type="email"]', 'palak.desai@kombee.com');
    await page.fill('input[type="password"]', 'Admin@123');
    await page.click('button:has-text("Submit")');
    await expect(page).not.toHaveURL(BASE_URL);
  });

  test('TC002 - Password Visibility Toggle', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill('VisiblePassword123');
    // Click the eye icon (sibling svg or button)
    await page.locator('[data-testid="toggle-password"], input[type="password"] ~ button, input[type="password"] ~ span').first().click();
    await expect(page.locator('input[name="password"], input[id="password"]').first()).toHaveAttribute('type', 'text');
  });

  test('TC003 - Empty Fields Validation', async ({ page }) => {
    await page.click('button:has-text("Submit")');
    // Expect inline error or form not submitted
    const errorVisible = await page.locator('text=/required|cannot be empty|mandatory/i').isVisible().catch(() => false);
    const stillOnLogin = page.url().includes('login');
    expect(errorVisible || stillOnLogin).toBeTruthy();
  });

  test('TC004 - Invalid Email Format', async ({ page }) => {
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Submit")');
    const errorVisible = await page.locator('text=/invalid|valid email/i').isVisible().catch(() => false);
    const stillOnLogin = page.url().includes('login');
    expect(errorVisible || stillOnLogin).toBeTruthy();
  });

  test('TC005 - Wrong Credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'wrong@kombee.com');
    await page.fill('input[type="password"]', 'WrongPass123');
    await page.click('button:has-text("Submit")');
    await expect(page.locator('text=/invalid|incorrect|wrong|not found/i')).toBeVisible({ timeout: 5000 });
  });

  test('TC006 - Empty Email Only', async ({ page }) => {
    await page.fill('input[type="password"]', 'Test@12345');
    await page.click('button:has-text("Submit")');
    const stillOnLogin = page.url().includes('login');
    expect(stillOnLogin).toBeTruthy();
  });

  test('TC007 - Empty Password Only', async ({ page }) => {
    await page.fill('input[type="email"]', 'palak.desai@kombee.com');
    await page.click('button:has-text("Submit")');
    const stillOnLogin = page.url().includes('login');
    expect(stillOnLogin).toBeTruthy();
  });

  test('TC008 - Forgot Password Link Visible and Clickable', async ({ page }) => {
    const forgotLink = page.locator('text=/forgot password/i');
    await expect(forgotLink).toBeVisible();
    await forgotLink.click();
    // Should navigate away or open a modal
    const navigated = !page.url().includes('login') || await page.locator('text=/reset|email sent/i').isVisible().catch(() => false);
    expect(navigated).toBeTruthy();
  });

  test('TC009 - Page Title and Branding Visible', async ({ page }) => {
    await expect(page.locator('text=/Birla White/i').first()).toBeVisible();
  });

  test('TC010 - Keyboard Navigation (Tab + Enter)', async ({ page }) => {
    await page.focus('input[type="email"]');
    await page.keyboard.type('palak.desai@kombee.com');
    await page.keyboard.press('Tab');
    await page.keyboard.type('Test@12345');
    await page.keyboard.press('Enter');
    // Should attempt submission
    await page.waitForTimeout(1000);
  });

});
`;

        console.log(chalk.green(`✅ ${this.name} completed. Playwright test code generated.`));
        return testCode;
    }
}

export default ImplementationAgent;