#!/usr/bin/env node
import inquirer from 'inquirer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { runDocsStrategy } from './strategies/docs.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n========================================');
console.log('Scratchy-The-Scraper v1.0.0');
console.log('========================================\n');

const configsDir = path.join(__dirname, 'configs');
let configs = [];

try {
  const files = await fs.readdir(configsDir);
  configs = files.filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''));
} catch (err) {
  console.error('❌ Configs nicht gefunden:', err.message);
  process.exit(1);
}

if (configs.length === 0) {
  console.error('❌ Keine Configs gefunden');
  process.exit(1);
}

const answers = await inquirer.prompt([
  {
    type: 'list',
    name: 'project',
    message: 'Projekt wählen:',
    choices: configs.map((c, i) => ({ name: `${i + 1}. ${c}`, value: c }))
  }
]);

const configPath = path.join(configsDir, `${answers.project}.json`);
const config = JSON.parse(await fs.readFile(configPath, 'utf8'));

if (config.strategy === 'docs') {
  await runDocsStrategy(config);
} else {
  console.log(`⚠️ Strategy "${config.strategy}" noch nicht implementiert`);
}
