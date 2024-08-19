---
title: How to Debug JavaScript Projects
description: >-
  Here’s a tutorial in English on how to debug JavaScript projects using both
  VSCode and WebStorm.
authorId: 70e12655-a130-46ea-b67a-5ccfcd95d040
authorName: iwishfulDev
date: '2024-08-19T06:18:36.550Z'
lastModified: '2024-08-19T08:10:59.129Z'
---
Here’s a tutorial in English on how to debug JavaScript projects using both VSCode and WebStorm:

```markdown
# How to Debug JavaScript Projects

In this tutorial, we will cover how to debug JavaScript projects using both Visual Studio Code (VSCode) and WebStorm. Debugging is an essential part of development that helps you find and fix issues in your code.

## Debugging with VSCode

### 1. Install VSCode and Extensions

First, ensure that you have Visual Studio Code (VSCode) installed. You can download it from the [VSCode website](https://code.visualstudio.com/).

After installation, you may want to install the following extensions to enhance your debugging experience:
- **Debugger for Chrome**: For debugging JavaScript code running in Google Chrome.
- **Node.js**: For debugging Node.js applications.

### 2. Configure the Debugger

In VSCode, you need to create a debug configuration file to specify how to start your debugging session. Open your project folder, then click on the **Run and Debug** icon on the left sidebar and select **create a launch.json file**. Choose the template that suits your debugging environment, such as **Node.js** or **Chrome**.

#### Example Configuration (for Node.js):

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}/app.js"
    }
  ]
}
```

#### Example Configuration (for Chrome):

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome against localhost",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

### 3. Set Breakpoints

To pause execution and inspect variable states, click on the gray circle next to the line number where you want to set a breakpoint. When code execution reaches this line, the debugger will pause.

### 4. Start Debugging

Click the green debug button (play icon) on the VSCode interface or press `F5` to start debugging. The debugger will start and pause at the breakpoints.

### 5. Use Debugging Tools

During debugging, you can use the debug toolbar to:

* **Continue (F5)**: Continue execution until the next breakpoint.
* **Step Into (F11)**: Step into the function call on the current line.
* **Step Over (F10)**: Skip the current line.
* **Stop (Shift + F5)**: Stop the debugging session.

## Debugging with WebStorm

### 1. Install WebStorm

Ensure you have WebStorm installed. You can download it from the [WebStorm website](https://www.jetbrains.com/webstorm/).

### 2. Configure the Debugger

WebStorm will automatically configure the debugger for supported project types. For Node.js projects, you can directly use WebStorm’s built-in debugging capabilities. For browser applications, you need to set up a debug configuration.

#### Create a Node.js Debug Configuration:

1. Open WebStorm.
2. Click the **Run** menu and select **Edit Configurations**.
3. Click the **+** icon in the top-left corner and choose **Node.js**.
4. Configure the Node.js run configuration, such as setting `JavaScript file` to your entry file `app.js`.

#### Create a Chrome Debug Configuration:

1. Open WebStorm.
2. Click the **Run** menu and select **Edit Configurations**.
3. Click the **+** icon in the top-left corner and select **JavaScript Debug**.
4. Enter your application’s URL in the **URL** field, e.g., `http://localhost:3000`.

### 3. Set Breakpoints

Click on the line number where you want to pause execution to set a breakpoint. The breakpoint will be marked with a red dot.

### 4. Start Debugging

Click the green debug button (similar to the play icon) in the top-right corner of WebStorm or press `Shift + F9` to start debugging. The debugger will start and pause at the breakpoints.

### 5. Use Debugging Tools

During debugging, you can use WebStorm’s debug toolbar to:

* **Continue (F9)**: Continue execution until the next breakpoint.
* **Step Into (F7)**: Step into the function call on the current line.
* **Step Over (F8)**: Skip the current line.
* **Stop (Shift + F5)**: Stop the debugging session.

## Summary

Debugging is a crucial part of development that helps you quickly locate and fix issues. Whether using VSCode or WebStorm, configuring the debugger and utilizing debugging tools effectively will greatly enhance your development workflow.
