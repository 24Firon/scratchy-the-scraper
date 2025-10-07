#!/usr/bin/env node
import inquirer from 'inquirer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { runDocsStrategy } from './strategies/docs.mjs';
import { runSkoolStrategy } from './strategies/skool.mjs';
import { pushToAirtable } from './adapters/airtable.mjs';

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
  },
  {
    type: 'confirm',
    name: 'useAirtable',
    message: 'Zu Airtable hochladen?',
    default: false
  }
]);

const configPath = path.join(configsDir, `${answers.project}.json`);
const config = JSON.parse(await fs.readFile(configPath, 'utf8'));

if (config.strategy === 'docs') {
  await runDocsStrategy(config);
} else if (config.strategy === 'skool') {
  await runSkoolStrategy(config);
} else {
  console.log(`⚠️ Strategy "${config.strategy}" noch nicht implementiert`);
  process.exit(0);
}

if (answers.useAirtable) {
  const outputDir = path.join(__dirname, 'output', config.projectName);
  try {
    const dates = await fs.readdir(outputDir);
    const latestDate = dates.sort().reverse()[0];
    const files = await fs.readdir(path.join(outputDir, latestDate));
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    if (jsonFiles.length > 0) {
      const latestFile = jsonFiles.sort().reverse()[0];
      const data = JSON.parse(await fs.readFile(path.join(outputDir, latestDate, latestFile), 'utf8'));
      await pushToAirtable(Array.isArray(data) ? data : [data], config);
    } else {
      console.log('⚠️ Keine JSON-Dateien für Airtable gefunden');
    }
  } catch (err) {
    console.error('❌ Airtable-Upload fehlgeschlagen:', err.message);
  }
}
