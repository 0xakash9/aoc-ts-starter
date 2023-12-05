#!/usr/bin/env node

const spawn = require("cross-spawn");
import { execSync } from "child_process";
import { program } from "commander";
import fs from "fs";
import path from "path";

const runCommand = (command: string) => {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.log(error);
    return false;
  }

  return true;
};

const projectName = process.argv[2];
const nodeVersion = process.version;
const minRequiredNodeVersion = 18;
const versionNumber = parseInt(nodeVersion.split(".")[0].slice(1), 10);

const currentDir = process.cwd();
const projectDir = path.resolve(currentDir, projectName);

console.log(
  "versionNumber < minRequiredNodeVersion",
  versionNumber < minRequiredNodeVersion
);
if (versionNumber < minRequiredNodeVersion) {
  console.error(
    `Error: Node.js version ${nodeVersion} is below the required minimum version ${minRequiredNodeVersion}.`
  );
  process.exit(1);
}

fs.mkdirSync(projectDir, { recursive: true });

const templateDir = path.resolve(__dirname, "../template");
const packageJsonPath = path.join(__dirname, "../template/package.json");
const packageJson = require(packageJsonPath);

packageJson.name = projectName;

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

fs.cpSync(templateDir, projectDir, { recursive: true });

console.log("Installing dependencies...");
runCommand(`cd ${projectName} && npm install`);
console.log("Dependencies installed successfully.");
