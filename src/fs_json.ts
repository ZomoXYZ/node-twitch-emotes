import { readFile, writeFile } from 'fs/promises'

export async function readJson<T = any>(path: string): Promise<T> {
    const data = await readFile(path, 'utf8')
    return JSON.parse(data)
}

export async function writeJson<T = any>(path: string, data: T) {
    const json = JSON.stringify(data)
    await writeFile(path, json, 'utf8')
}
