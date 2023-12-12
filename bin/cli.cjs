#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const command = process.argv[2];
const nodeVersion = process.version;
const minimumMajorVersion = 18;
const currentVersion = parseInt(nodeVersion.split(".")[0].slice(1), 10);

const currentDir = process.cwd();
const projectDir = path.resolve(currentDir, command);

if (currentVersion < minimumMajorVersion) {
  console.error(
    chalk.red.bold(`Node.js v${currentVersion} is out of date and unsupported!`)
  );
  console.error(
    chalk.red.bold(`Please use Node.js v${minimumMajorVersion} or higher.`)
  );

  process.exit(1);
}

fs.mkdirSync(projectDir, { recursive: true });

const templateDir = path.resolve(__dirname, "../template");
const packageJsonPath = path.join(__dirname, "../template/package.json");
const packageJson = require(packageJsonPath);

packageJson.name = command;

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

fs.cpSync(templateDir, projectDir, { recursive: true });

generateReadme(command);

runCommand(`cd ${command}`);
console.log(chalk.green.bold("DONE"), "new AOC project created successfully.");

function runCommand(command) {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.log(error);
    return false;
  }

  return true;
}

function generateReadme(title) {
  const readmeTemplate = `# ${title}

`;
  const readmePath = path.join(projectDir, "README.md");
  fs.writeFileSync(readmePath, readmeTemplate, "utf-8");
}
