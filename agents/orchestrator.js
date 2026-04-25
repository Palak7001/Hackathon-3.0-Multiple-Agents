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
    }

    async ensureOutputDir() {
        try {
            await fs.mkdir(this.outputDir, { recursive: true });
        } catch (err) {
            console.error(chalk.red("Failed to create outputs folder:"), err.message);
        }
    }

    async saveOutput(filename, content) {
        try {
            const filePath = path.join(this.outputDir, filename);
            await fs.writeFile(filePath, content, 'utf8');
            console.log(chalk.green(`✅ Saved: outputs/${filename}`));
        } catch (err) {
            console.error(chalk.red(`Failed to save ${filename}:`), err.message);
        }
    }

    async runWorkflow(rawInput) {
        console.log(chalk.cyan("🚀 Starting Project ARES - QA Intelligence Engine\n"));

        await this.ensureOutputDir();
        this.state.rawInput = rawInput;

        try {
            // Step 1: Requirement Agent
            console.log(chalk.blue("📋 Step 1: Requirement Agent"));
            const reqAgent = new RequirementAgent();
            this.state.requirement = await reqAgent.process(rawInput);
            await this.saveOutput('requirement.md', this.state.requirement);

            // Step 2: Observation Agent
            console.log(chalk.blue("🔍 Step 2: Observation Agent"));
            const obsAgent = new ObservationAgent();
            this.state.observedSystem = await obsAgent.process(this.state.requirement);
            await this.saveOutput('observed_system.md', this.state.observedSystem);

            // Step 3: Analysis Agent
            console.log(chalk.blue("🕵️ Step 3: Analysis Agent (Bug Hunter)"));
            const analysisAgent = new AnalysisAgent();
            this.state.gapAnalysis = await analysisAgent.process(this.state.observedSystem);
            await this.saveOutput('gap_analysis.md', this.state.gapAnalysis);

            // Step 4: Planning Agent
            console.log(chalk.blue("📝 Step 4: Planning Agent"));
            const planningAgent = new PlanningAgent();
            this.state.testPlan = await planningAgent.process(this.state.gapAnalysis, this.state.requirement);
            await this.saveOutput('test_plan.md', this.state.testPlan);

            // Step 5: Implementation Agent
            console.log(chalk.blue("⚙️ Step 5: Implementation Agent"));
            const implAgent = new ImplementationAgent();
            this.state.testCode = await implAgent.generateCode(this.state.testPlan);
            await this.saveOutput('birla-white-login.spec.js', this.state.testCode);

            // Step 6: Execution Agent
            console.log(chalk.blue("▶️ Step 6: Execution Agent"));
            const execAgent = new ExecutionAgent();
            this.state.testResults = await execAgent.executeTests();
            await this.saveOutput('test_results.json', JSON.stringify(this.state.testResults, null, 2));

            // Step 7: Review Agent
            console.log(chalk.blue("🔍 Step 7: Review Agent"));
            const reviewAgent = new ReviewAgent();
            this.state.reviewReport = await reviewAgent.analyze(this.state.testResults, this.state.testPlan);
            await this.saveOutput('review_report.md', this.state.reviewReport);

            // Step 8: Report Agent
            console.log(chalk.blue("📊 Step 8: Report Agent"));
            const reportAgent = new ReportAgent();
            this.state.finalSummary = await reportAgent.generate(this.state);
            await this.saveOutput('qa_summary.md', this.state.finalSummary);

            console.log(chalk.green.bold("\n🎉 Project ARES QA Intelligence Engine completed successfully!"));
            console.log(chalk.yellow("Check the 'outputs' folder for all generated files."));

        } catch (error) {
            console.error(chalk.red.bold("\n❌ Error in workflow:"), error.message);
            console.error(chalk.red(error.stack));
        }
    }
}

export { Orchestrator };