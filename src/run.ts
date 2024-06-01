import * as vscode from 'vscode';
import * as path from 'path';

function buildVitestArgs(text: string, pathToFile: string) {
    return ['vitest', pathToFile, '-t', text];
}

function buildCdArgs(path: string) {
    return ['cd', path];
}

export function runInTerminal(text: string, filename: string) {
    const terminal = vscode.window.createTerminal(`vitest - ${text}`);

    const casePathStr = JSON.stringify(filename);
    const caseNameStr = JSON.stringify(text);

    const vitestArgs = buildVitestArgs(caseNameStr, casePathStr);
    const npxArgs = ['pnpm', ...vitestArgs];
    terminal.sendText(npxArgs.join(' '), true);
    terminal.show();
}

function buildDebugConfig(
    cwd: string,
    text: string,
    filename: string
): vscode.DebugConfiguration {
    return {
        name: 'Debug vitest case',
        request: 'launch',
        runtimeArgs: buildVitestArgs(text, filename),
        cwd,
        runtimeExecutable: 'pnpm',
        skipFiles: ['<node_internals>/**'],
        type: 'pwa-node',
        console: 'integratedTerminal',
        internalConsoleOptions: 'neverOpen'
    };
}

export function debugInTermial(text: string, filename: string) {
    const casePath = path.dirname(filename);
    const config = buildDebugConfig(casePath, text, filename);
    vscode.debug.startDebugging(undefined, config);
}
