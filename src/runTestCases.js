const vscode = require("vscode");
const fs = require("fs-extra");
const path = require("path");
const { exec } = require("child_process");
const os = require("os");

async function runTestCases(language, workspaceFolder, inputDir, outputDir) {
  if (!fs.existsSync(inputDir) || !fs.existsSync(outputDir)) {
    vscode.window.showErrorMessage("Input or output directories are missing.");
    return;
  }

  const inputFiles = fs
    .readdirSync(inputDir)
    .filter((file) => file.startsWith("input_") && file.endsWith(".txt"))
    .sort();
  const outputFiles = fs
    .readdirSync(outputDir)
    .filter((file) => file.startsWith("output_") && file.endsWith(".txt"))
    .sort();

  if (inputFiles.length !== outputFiles.length) {
    vscode.window.showErrorMessage(
      "Mismatch in the number of input and output files."
    );
    return;
  }

  const solutionFilePath = vscode.window.activeTextEditor.document.fileName;
  if (!fs.existsSync(solutionFilePath)) {
    vscode.window.showErrorMessage("Solution file does not exist.");
    return;
  }

  try {
    const results = [];
    for (let i = 0; i < inputFiles.length; i++) {
      const inputFilePath = path.join(inputDir, inputFiles[i]);
      const outputFilePath = path.join(outputDir, outputFiles[i]);

      const inputContent = fs.readFileSync(inputFilePath, "utf-8").trim();
      const expectedOutput = fs.readFileSync(outputFilePath, "utf-8").trim();

      const result = await executeTestCase(
        solutionFilePath,
        inputContent,
        language
      );
      results.push({
        testCase: i + 1,
        result,
        expectedOutput,
      });
    }

    displayResults(results);
  } catch (error) {
    console.error(error);
    vscode.window.showErrorMessage(
      `Error executing test cases: ${error.message}`
    );
  }
}

function executeTestCase(filePath, testCase, language) {
  const isWindows = os.platform() === "win32";
  const commands = {
    cpp: isWindows
      ? `g++ "${filePath}" -o temp && temp.exe`
      : `g++ "${filePath}" -o temp && ./temp`,
    python: `python "${filePath}"`,
  };

  return new Promise((resolve, reject) => {
    const command = commands[language];
    const process = exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(stderr || error.message);
      }
      resolve(stdout.trim());
    });
    process.stdin.write(testCase + "\n");
    process.stdin.end();
  });
}

function displayResults(results) {
  const resultsChannel = vscode.window.createOutputChannel("Test Results");
  resultsChannel.clear();

  results.forEach(({ testCase, result, expectedOutput }) => {
    const status = result === expectedOutput ? "✔️ Passed" : "❌ Failed";
    resultsChannel.appendLine(`Test Case ${testCase}: ${status}`);
    resultsChannel.appendLine(`  Expected: ${expectedOutput}`);
    resultsChannel.appendLine(`  Received: ${result}`);
  });

  resultsChannel.show();
}

module.exports = runTestCases;
