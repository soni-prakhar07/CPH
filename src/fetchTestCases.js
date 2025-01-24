const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs-extra"); // Use fs-extra for ensureDirSync
const path = require("path");
const vscode = require("vscode");

const testCaseDir = path.join(
  vscode.workspace.workspaceFolders[0].uri.fsPath,
  "test_cases"
);
fs.ensureDirSync(testCaseDir);

async function fetchProblemTestCases(titleSlug) {
  try {
    const response = await axios.get(
      `https://alfa-leetcode-api.onrender.com/select?titleSlug=${titleSlug}`
    );

    const data = response.data;
    const questionHTML = data.question;

    const $ = cheerio.load(questionHTML);
    const testCases = $("strong:contains('Input:')").length; // Number of test cases

    let sampleTestCases = data.exampleTestcases;

    if (!sampleTestCases) {
      console.error("No test cases found.");
      return;
    }

    // Clean up unwanted characters and split into lines
    sampleTestCases = sampleTestCases.split("\n").map(
      (line) => line.replace(/[\[\],]+/g, " ").trim() // Clean up unwanted characters
    );

    // Divide inputs into equal parts and save
    const linesPerTestCase = Math.ceil(sampleTestCases.length / testCases);
    for (let i = 0; i < testCases; i++) {
      const testCaseContent = sampleTestCases.slice(
        i * linesPerTestCase,
        (i + 1) * linesPerTestCase
      );
      const inputFilePath = path.join(testCaseDir, `input_${i + 1}.txt`);
      await fs.writeFile(inputFilePath, testCaseContent.join("\n"));
    }

    console.log(`Input test cases saved in: ${testCaseDir}`);
  } catch (error) {
    console.error("Error fetching problem details:", error.message);
  }
}

async function fetchExpectedOutput(titleSlug) {
  try {
    const response = await axios.get(
      `https://alfa-leetcode-api.onrender.com/select?titleSlug=${titleSlug}`
    );

    const data = response.data;
    const questionHTML = data.question;

    const $ = cheerio.load(questionHTML);
    const testCases = $("strong:contains('Input:')").length; // Number of test cases

    const expectedOutputs = [];
    $("pre").each((_index, element) => {
      const content = $(element).html();
      if (content) {
        const outputMatch = content.match(/<strong>Output:<\/strong>\s*(.+)/);
        if (outputMatch) {
          const output = outputMatch[1].trim();
          expectedOutputs.push(output);
        }
      }
    });

    // Divide outputs into equal parts and save
    const linesPerTestCase = Math.ceil(expectedOutputs.length / testCases);
    for (let i = 0; i < testCases; i++) {
      const outputContent = expectedOutputs.slice(
        i * linesPerTestCase,
        (i + 1) * linesPerTestCase
      );
      const outputFilePath = path.join(testCaseDir, `output_${i + 1}.txt`);
      await fs.writeFile(outputFilePath, outputContent.join("\n"));
    }

    console.log(`Expected outputs saved in: ${testCaseDir}`);
  } catch (error) {
    if (error.response) {
      console.error("Error fetching expected output from API:", error.message);
    } else {
      console.error("Unexpected error:", error.message);
    }
  }
}

const fetchItems = async (titleSlug) => {
  try {
    await fetchProblemTestCases(titleSlug);
    await fetchExpectedOutput(titleSlug);
  } catch (error) {
    console.error("Error fetching items:", error.message);
  }
};

module.exports = fetchItems;
