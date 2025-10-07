#!/usr/bin/env node
import inquirer from 'inquirer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n========================================');
console.log('Scratchy-The-Scraper v1.0.0');
console.log('Universal Web Scraping Framework');
console.log('========================================\n');

const configsDir = path.join(__dirname, 'configs');
let configs = [];

try {
  const files = await fs.readdir(configsDir);
  configs = files.filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''));
} catch (err) {
  console.error('❌ Configs-Ordner nicht gefunden:', err.message);
  process.exit(1);
}

if (configs.length === 0) {
  console.error('❌ Keine Projekt-Configs gefunden in configs/');
  process.exit(1);
}

const answers = await inquirer.prompt([
  {
    type: 'list',
    name: 'project',
    message: 'Projekt wählen:',
    choices: configs.map((c, i) => ({ name: `${i + 1}. ${c}`, value: c }))
  },
  {
    type: 'list',
    name: 'mode',
    message: 'Output-Modus:',
    choices: [
      { name: '1. Vollständig', value: 'full' },
      { name: '2. Nur Text MD', value: 'text-md' },
      { name: '3. Nur Text JSON', value: 'text-json' }
    ]
  }
]);

console.log('\n✓ Projekt:', answers.project);
console.log('✓ Modus:', answers.mode);
console.log('\n⚠️ Implementierung folgt!\n');
