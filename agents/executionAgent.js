// agents/executionAgent.js
import { execSync } from 'child_process';
import fs from 'fs/promises';
import chalk from 'chalk';

class ExecutionAgent {
    constructor() {
        this.name = "Test Runner Agent";
    }

    async process() {
        console.log(chalk.blue(`▶️ ${this.name} is executing real Playwright tests...`));

        try {
            // Create tests folder if not exists
            await fs.mkdir('tests', { recursive: true });

            // Copy the generated test file to tests/
            const testContent = await fs.readFile('outputs/birla-white-login.spec.js', 'utf8');
            await fs.writeFile('tests/birla-white-login.spec.js', testContent);

            // Run actual Playwright test
            console.log("Running: npx playwright test tests/birla-white-login.spec.js --reporter=json");

            let results;
            try {
                const output = execSync('npx playwright test tests/birla-white-login.spec.js --reporter=json', {
                    encoding: 'utf8',
                    stdio: 'pipe'
                });

                results = {
                    status: "success",
                    rawOutput: output,
                    timestamp: new Date().toISOString()
                };
            } catch (execError) {
                // Playwright returns non-zero exit on failures, so we still capture results
                results = {
                    status: "completed_with_failures",
                    message: execError.message || "Tests completed",
                    timestamp: new Date().toISOString()
                };
            }

            await fs.writeFile('outputs/test_results.json', JSON.stringify(results, null, 2));

            console.log(chalk.green(`✅ ${this.name} completed. Real tests executed.`));
            return results;

        } catch (error) {
            console.error(chalk.red("Execution error:"), error.message);
            const fallback = { error: error.message, timestamp: new Date().toISOString() };
            await fs.writeFile('outputs/test_results.json', JSON.stringify(fallback, null, 2));
            return fallback;
        }
    }
}

export default ExecutionAgent;
