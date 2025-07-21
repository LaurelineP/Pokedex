
export type CLICommand = {
    name: string;
    description: string;
    callback: (commands?: Record<string, CLICommand>) => void
}
export type CLICommands = Record<string, CLICommand>