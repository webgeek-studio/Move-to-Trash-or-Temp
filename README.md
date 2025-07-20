# Move to Trash or Temp — VS Code Extension

This extension adds two context menu options in the VS Code Explorer:

-   **Move to Trash** — moves selected files or folders into a hidden `.trash` directory in the root of your workspace.
-   **Move to Temp** — moves selected files or folders into a hidden `.temp` directory in the root of your workspace.
-   **Clear Trash** — available when right-clicking the `.trash` folder, this option allows you to clear its contents (with confirmation dialog).

## Features

-   Automatically creates `.trash` or `.temp` folders if they don't exist.
-   Automatically adds `.trash` and `.temp` to your workspace `.gitignore` (if it exists).
-   Displays a confirmation dialog before clearing the Trash.
-   Seamless context menu integration.

## Usage

-   Right-click any file or folder in the Explorer to move it to **Trash** or **Temp**.
-   Right-click the `.trash` folder to **Clear Trash**.

## License

MIT License — free to use, modify, and distribute.
