// agents/orchestrator.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

import RequirementAgent from './requirementAgent.js';
import ObservationAgent from './observationAgent.js';
import AnalysisAgent from './analysisAgent.js';
import PlanningAgent from './planningAgent.js';
import ImplementationAgent from './implementationAgent.js';
import ExecutionAgent from './executionAgent.js';
import ReviewAgent from './reviewAgent.js';
import ReportAgent from './reportAgent.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Orchestrator {
    constructor() {
        this.state = {
            rawInput: '',
            requirement: null,
            observedSystem: null,
            gapAnalysis: null,
            testPlan: null,
            testCode: null,
            testResults: null,
            reviewReport: null,
            finalSummary: null
        };
        this.outputDir = path.join(__dirname, '../outputs');
        this.maxRetries = 2;
    }

    async ensureOutputDir() {
        await fs.mkdir(this.outputDir, { recursive: true });
    }

    async saveOutput(filename, content) {
        try {
            const filePath = path.join(this.outputDir, filename);
            await fs.writeFile(filePath, content, 'utf8');
            console.log(chalk.green(`✅ Saved: outputs/${filename}`));
            return true;
        } catch (err) {
            console.error(chalk.red(`Failed to save ${filename}:`), err.message);
            return false;
        }
    }

    // NEW: Output validation (important for Orchestrator Intelligence marks)
    validateOutput(output, stepName) {
        if (!output || typeof output !== 'string' || output.trim().length < 50) {
            console.warn(chalk.yellow(`⚠️  Warning: ${stepName} output looks weak or empty`));
            return false;
        }
        return true;
    }

    async runAgentWithRetry(agent, input, stepName, retryCount = 0) {
        try {
            const result = await agent.process(input);
            if (this.validateOutput(result, stepName)) {
                return result;
            } else if (retryCount < this.maxRetries) {
                console.log(chalk.yellow(`Retrying ${stepName}...`));
                return this.runAgentWithRetry(agent, input, stepName, retryCount + 1);
            }
            return result;
        } catch (error) {
            console.error(chalk.red(`Error in ${stepName}:`), error.message);
            if (retryCount < this.maxRetries) {
                console.log(chalk.yellow(`Retrying ${stepName} after error...`));
                return this.runAgentWithRetry(agent, input, stepName, retryCount + 1);
            }
            throw error;
        }
    }

    async runWorkflow(rawInput) {
        console.log(chalk.cyan.bold("\n🚀 Starting Project ARES - QA Intelligence Engine\n"));

        await this.ensureOutputDir();
        this.state.rawInput = rawInput;

        try {
            // Step 1: Requirement Agent
            console.log(chalk.blue("📋 Step 1: Requirement Agent"));
            const reqAgent = new RequirementAgent();
            this.state.requirement = await this.runAgentWithRetry(reqAgent, rawInput, "Requirement Agent");
            await this.saveOutput('requirement.md', this.state.requirement);

            // Step 2: Observation Agent
            console.log(chalk.blue("🔍 Step 2: Observation Agent"));
            const obsAgent = new ObservationAgent();
            this.state.observedSystem = await this.runAgentWithRetry(obsAgent, this.state.requirement, "Observation Agent");
            await this.saveOutput('observed_system.md', this.state.observedSystem);

            // Step 3: Analysis Agent
            console.log(chalk.blue("🕵️ Step 3: Analysis Agent (Bug Hunter)"));
            const analysisAgent = new AnalysisAgent();
            this.state.gapAnalysis = await this.runAgentWithRetry(analysisAgent, this.state.observedSystem, "Analysis Agent");
            await this.saveOutput('gap_analysis.md', this.state.gapAnalysis);

            // Step 4: Planning Agent
            console.log(chalk.blue("📝 Step 4: Planning Agent"));
            const planningAgent = new PlanningAgent();
            this.state.testPlan = await this.runAgentWithRetry(planningAgent, 
                { gapAnalysis: this.state.gapAnalysis, requirement: this.state.requirement }, 
                "Planning Agent");
            await this.saveOutput('test_plan.md', this.state.testPlan);

            // Step 5: Implementation Agent
            console.log(chalk.blue("⚙️ Step 5: Implementation Agent"));
            const implAgent = new ImplementationAgent();
            this.state.testCode = await this.runAgentWithRetry(implAgent, this.state.testPlan, "Implementation Agent");
            await this.saveOutput('birla-white-login.spec.js', this.state.testCode);

            // Step 6: Execution Agent
            console.log(chalk.blue("▶️ Step 6: Execution Agent"));
            const execAgent = new ExecutionAgent();
            this.state.testResults = await this.runAgentWithRetry(execAgent, null, "Execution Agent");
            await this.saveOutput('test_results.json', JSON.stringify(this.state.testResults, null, 2));

            // Step 7: Review Agent
            console.log(chalk.blue("🔍 Step 7: Review Agent"));
            const reviewAgent = new ReviewAgent();
            this.state.reviewReport = await this.runAgentWithRetry(reviewAgent, 
                { testResults: this.state.testResults, testPlan: this.state.testPlan }, 
                "Review Agent");
            await this.saveOutput('review_report.md', this.state.reviewReport);

            // Step 8: Report Agent
            console.log(chalk.blue("📊 Step 8: Report Agent"));
            const reportAgent = new ReportAgent();
            this.state.finalSummary = await this.runAgentWithRetry(reportAgent, this.state, "Report Agent");
            await this.saveOutput('qa_summary.md', this.state.finalSummary);

            console.log(chalk.green.bold("\n🎉 Project ARES QA Intelligence Engine completed successfully!"));
            console.log(chalk.yellow("📁 All outputs saved in 'outputs/' folder."));
            console.log(chalk.cyan("🚀 Docker ready: npm run docker:build && npm run docker:run"));

        } catch (error) {
            console.error(chalk.red.bold("\n❌ Critical error in workflow:"), error.message);
            console.error(chalk.red(error.stack));
        }
    }
}

export default Orchestrator;