#!/usr/bin/env node
import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';
import inquirer from 'inquirer';

console.log('\n========================================');
console.log('Scratchy Auth Setup');
console.log('========================================\n');

const answers = await inquirer.prompt([
  {
    type: 'list',
    name: 'platform',
    message: 'Plattform wählen:',
    choices: [
      { name: '1. Skool', value: 'skool' },
      { name: '2. Patreon', value: 'patreon' },
      { name: '3. YouTube', value: 'youtube' }
    ]
  }
]);

console.log('\n🌐 Starte Browser für Login...');

const browser = await chromium.launch({
  headless: false,
  args: ['--no-sandbox']
});

const context = await browser.newContext({
  viewport: { width: 1280, height: 720 }
});

const page = await context.newPage();

let loginUrl = '';
if (answers.platform === 'skool') {
  loginUrl = 'https://www.skool.com/login';
} else if (answers.platform === 'patreon') {
  loginUrl = 'https://www.patreon.com/login';
} else if (answers.platform === 'youtube') {
  loginUrl = 'https://accounts.google.com';
}

await page.goto(loginUrl);

console.log('\n📝 ANLEITUNG:');
console.log('1. Logge dich im Browser ein');
console.log('2. Warte bis Login komplett ist');
console.log('3. Drücke ENTER in diesem Terminal\n');

await inquirer.prompt([{
  type: 'input',
  name: 'done',
  message: 'Login fertig? (Enter drücken)'
}]);

const cookies = await context.cookies();
const authDir = '/opt/scratchy/playwright/.auth';
await fs.mkdir(authDir, { recursive: true });

const cookiesPath = path.join(authDir, answers.platform + '-cookies.json');
await fs.writeFile(cookiesPath, JSON.stringify(cookies, null, 2));

console.log('\n✅ Cookies gespeichert: ' + cookiesPath);
console.log('🎯 Starte jetzt: docker exec -it scratchy node main.js\n');

await browser.close();
