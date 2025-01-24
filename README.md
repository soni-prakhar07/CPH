# CPH: Competitive Programming Helper

This project provides an automated solution to fetch and execute test cases for coding problems on LeetCode. The tool allows developers to fetch inputs and expected outputs directly from the problem description on LeetCode, save them as files, and execute their code against these test cases seamlessly.

## Features

- Fetch Test Cases from LeetCode: Automatically extract input and output test cases from LeetCode problem descriptions.
- Support for Multiple Languages: Currently supports C++ and Python for code execution.
- Automated Test Case Execution: Executes the user's solution against the fetched test cases.
- Detailed Output Logs: Provides a comparison between the expected and actual outputs for each test case.

## Prerequisites

- Node.js: Ensure you have Node.js installed on your machine.
- MinGW (for C++ on Windows): A compiler like g++ must be available in your PATH.
- Python: Install Python if you want to execute Python programs.
- VS Code: The extension integrates with Visual Studio Code.
- Permissions: Ensure proper permissions in the working directory.

## Setup and Installation

- Clone this repository:

```console
git clone https://github.com/soni-prakhar07/CPH.git
cd CPH
```

- Install Dependencies:

```console
npm install
```

- Ensure g++ (for C++) and Python are installed and accessible from the terminal.

- Verify your environment:
  - Add MinGW or other compilers to your PATH.
  - Install any necessary VS Code extensions (e.g., C++ or Python support).

## How to Use

- Open extension.js and press F5.
- Open the leetcode problem in browser.
- copy the titleSlug from the problem link (eg. for a link: "https://leetcode.com/problems/generate-parentheses/description/", the titleSlug will be "generate-parentheses")
- Open the Solution you want to test against the testCases in VScode debugging window.
- Press Ctrl+Shift+P and type "CPH: Fetch Test Cases".
- Provide the titleSlug and press Enter. The test cases will now be saved locally.
- Now Run the command "CPH: Run Test Cases C++" for C++ solution and "CPH: Run Test Cases Python" for testing a python solution.

## Project Structure

```
 ├── src/
 │ ├── fetchTestCases.js     # Fetches inputs and expected outputs from LeetCode
 │ ├── runTestCases.js       # Executes the test cases
 ├── test_cases/             # Stores the fetched input/output files
 │ ├── input_1.txt
 │ ├── output_1.txt
 │ ├── ...
 ├── README.md               # Project documentation
 └── extension.js            # manages commands and function triggers
```

**Enjoy!**
