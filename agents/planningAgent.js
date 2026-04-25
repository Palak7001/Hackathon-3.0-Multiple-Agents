// agents/planningAgent.js
import chalk from 'chalk';

class PlanningAgent {
    constructor() {
        this.name = "Test Strategist Agent";
    }

    async process(gapAnalysis, requirement) {
        console.log(chalk.blue(`📝 ${this.name} is creating test plan...`));

        const testPlan = `# Test Plan - Birla White Experts Club Login

## 1. Test Categories

### Happy Path Tests
1. Valid login with correct credentials
2. Login using keyboard (Enter key)
3. Password visibility toggle works

### Negative Scenario Tests
1. Login with invalid email format
2. Login with wrong password
3. Login with empty email
4. Login with empty password
5. Login with both fields empty

### Edge Case Tests
1. Very long email address
2. Very long password
3. Email with special characters
4. Password with special characters/emojis
5. Whitespace-only input

### Non-Functional Tests
1. Page load performance
2. Accessibility compliance
3. Responsiveness on mobile viewport
4. Error message visibility and clarity

## 2. Traceability Matrix
- Each test case linked back to requirements

## 3. Expected Test Data
- Valid: palak.desai@kombee.com + correct password
- Invalid: wrongemail@kombee.com + wrongpass

**Test Plan Approved**: Structured coverage across happy path, negative, and edge cases.

Generated on: ${new Date().toISOString()}
`;

        console.log(chalk.green(`✅ ${this.name} completed. Test plan generated.`));
        return testPlan;
    }
}

export default PlanningAgent;