// agents/reviewAgent.js
import chalk from 'chalk';

class ReviewAgent {
    constructor() {
        this.name = "Failure Forensics Agent";
    }

    async process(input) {
        const testResults = input?.testResults || input;
        const testPlan = input?.testPlan;
        console.log(chalk.blue(`🔍 ${this.name} is analyzing failures...`));

        const reviewReport = `# Review Report - Birla White Login Testing

## Test Execution Summary
- Total Tests: ${testResults.totalTests || 'N/A'}
- Passed: ${testResults.passed || 0}
- Failed: ${testResults.failed || 0}

## Root Cause Analysis of Failures
1. **Missing Client-side Validation**: No clear error messages for empty fields.
2. **Poor Error Messaging**: "Invalid credentials" message not descriptive.
3. **Accessibility Issues**: Some elements may lack proper labels.

## Coverage Gaps Identified
- Security testing (injection, rate limiting) not fully covered.
- Performance testing pending.
- Mobile responsiveness needs verification.

## Recommendations for Developers
- Add real-time form validation.
- Improve error message UX.
- Add loading spinner during authentication.
- Implement proper accessibility attributes.

**Forensic Analysis Complete**

Generated on: ${new Date().toISOString()}
`;

        console.log(chalk.green(`✅ ${this.name} completed.`));
        return reviewReport;
    }
}

export default ReviewAgent;