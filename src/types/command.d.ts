interface Command {
    aliases?: [string],
    cooldown?: number,
    description?: string,
    name: string,
    usage: string,
    execute: () => void
}