const vscode = require("vscode");
const fetchItems = require("./src/fetchTestCases");
const runTestCases = require("./src/runTestCases");
const path = require("path");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath;

  if (!workspaceFolder) {
    vscode.window.showErrorMessage(
      "Please open a workspace to use this extension."
    );
    return;
  } else {
    console.log("CPH is Running!");
  }

  const testCaseDir = path.join(workspaceFolder, "test_cases");

  //Fetching Test Cases
  const testcaseFetcher = vscode.commands.registerCommand(
    "cph.fetchTestCases",
    async function () {
      // Mark function as async
      const titleSlug = await vscode.window.showInputBox({
        placeHolder: "Enter Problem Title (Replacing Spaces with '-')",
      });

      if (!titleSlug) {
        vscode.window.showWarningMessage("No problem title provided.");
        return; // Exit if no input is provided
      }

      vscode.window.showInformationMessage("fetchTestCases Started!");
      try {
        await fetchItems(titleSlug); // Ensure fetchItems is awaited if it's async
      } catch (error) {
        vscode.window.showErrorMessage(
          `Error fetching test cases: ${error.message}`
        );
        console.error(error);
      }
    }
  );

  // Command for running C++ test cases
  const cppCommand = vscode.commands.registerCommand(
    "cph.runTestCasesCpp",
    async () => {
      await runTestCases("cpp", workspaceFolder, testCaseDir, testCaseDir);
    }
  );

  // Command for running Python test cases
  const pythonCommand = vscode.commands.registerCommand(
    "cph.runTestCasesPython",
    async () => {
      await runTestCases("python", workspaceFolder, testCaseDir, testCaseDir);
    }
  );

  context.subscriptions.push(testcaseFetcher, cppCommand, pythonCommand);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
