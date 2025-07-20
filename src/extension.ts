import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

function getUniqueTargetPath(dir: string, filename: string): string {
    let target = path.join(dir, filename);
    let counter = 1;
    while (fs.existsSync(target)) {
        const ext = path.extname(filename);
        const name = path.basename(filename, ext);
        target = path.join(dir, `${name}_${counter}${ext}`);
        counter++;
    }
    return target;
}

function moveToFolder(uri: vscode.Uri, folderName: string, label: string) {
    const projectRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!projectRoot) return;

    const targetDir = path.join(projectRoot, folderName);

    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir);
        const gitignorePath = path.join(projectRoot, '.gitignore');
        if (fs.existsSync(gitignorePath)) {
            let content = fs.readFileSync(gitignorePath, 'utf8');
            if (!content.includes(folderName)) {
                content += `\n${folderName}\n`;
                fs.writeFileSync(gitignorePath, content);
            }
        }
    }

    const targetPath = getUniqueTargetPath(targetDir, path.basename(uri.fsPath));
    fs.renameSync(uri.fsPath, targetPath);

    vscode.window.showInformationMessage(`Moved to ${folderName}: ${path.basename(uri.fsPath)}`);
}

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.moveToTemp', (uri: vscode.Uri) => {
            if (!uri) return;
            moveToFolder(uri, '.temp', 'Temp');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.moveToTrash', (uri: vscode.Uri) => {
            if (!uri) return;
            moveToFolder(uri, '.trash', 'Trash');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.clearTrash', async (uri: vscode.Uri) => {
            if (!uri || !fs.existsSync(uri.fsPath)) return;

            const confirm = await vscode.window.showWarningMessage(
                `Are you sure you want to clear the Trash?`,
                { modal: true },
                'Yes'
            );

            if (confirm !== 'Yes') return;

            const items = fs.readdirSync(uri.fsPath);
            for (const item of items) {
                const itemPath = path.join(uri.fsPath, item);
                fs.rmSync(itemPath, { recursive: true, force: true });
            }

            vscode.window.showInformationMessage(`Trash cleared: ${uri.fsPath}`);
        })
    );
}

export function deactivate() { }
