import { existsSync, readFileSync } from 'node:fs';

export function readJSONSync(file: string) {
  if (!existsSync(file)) {
    throw new Error(`${file} is not found`);
  }
  return JSON.parse(readFileSync(file, 'utf-8'));
}
