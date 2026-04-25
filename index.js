// index.js
import { Orchestrator } from './agents/orchestrator.js';

async function main() {
    const rawInput = `
    Application: Birla White Experts Club Login Page
    Description: Login page with Email, Password, Submit button, Forgot Password link.
    Target: Automate testing using Playwright for the login functionality shown in the screenshot.
    `;

    const orchestrator = new Orchestrator();
    await orchestrator.runWorkflow(rawInput);
}

main().catch(err => {
    console.error("Critical Error:", err);
});