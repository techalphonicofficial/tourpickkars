const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src'));
let output = '';

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    let hasHeading = false;
    let fileOutput = `\n--- ${file.replace(__dirname, '')} ---\n`;
    
    lines.forEach((line, index) => {
        const match = line.match(/<h[1-6][^>]*>/i);
        if (match) {
            hasHeading = true;
            fileOutput += `Line ${index + 1}: ${line.trim()}\n`;
        }
    });
    
    if (hasHeading) {
        output += fileOutput;
    }
});

fs.writeFileSync(path.join(__dirname, 'headings_report.txt'), output);
console.log('Done');
