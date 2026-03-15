import fs from 'fs';
import path from 'path';

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Primary: #6366f1 -> #7c3aed (Violet)
    content = content.replace(/#6366f1/g, '#7c3aed');
    content = content.replace(/#6366F1/g, '#7c3aed');
    // Primary Dark: #4f46e5 -> #6d28d9
    content = content.replace(/#4f46e5/g, '#6d28d9');
    content = content.replace(/#4F46E5/g, '#6d28d9');
    // Primary rgb
    content = content.replace(/rgba\(\s*99\s*,\s*102\s*,\s*241/gi, 'rgba(124, 58, 237');

    // Secondary: #f43f5e -> #ec4899 (Pink)
    content = content.replace(/#f43f5e/gi, '#ec4899');
    // Secondary rgb
    content = content.replace(/rgba\(\s*244\s*,\s*63\s*,\s*94/gi, 'rgba(236, 72, 153');

    // Accent: #10b981 -> #06b6d4 (Cyan)
    content = content.replace(/#10b981/gi, '#06b6d4');
    // Accent rgb
    content = content.replace(/rgba\(\s*16\s*,\s*185\s*,\s*129/gi, 'rgba(6, 182, 212');

    // Gradient transition: #a855f7 -> #d946ef
    content = content.replace(/#a855f7/gi, '#d946ef');

    // Dark colors: #0f172a -> #09090b
    content = content.replace(/#0f172a/gi, '#09090b');
    // Dark rgb
    content = content.replace(/rgba\(\s*15\s*,\s*23\s*,\s*42/gi, 'rgba(9, 9, 11');

    // Dark border/secondary: #1e293b -> #18181b
    content = content.replace(/#1e293b/gi, '#18181b');
    content = content.replace(/#1e1b4b/gi, '#09090b'); // Even darker

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.css')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('src');
files.forEach(replaceInFile);
console.log('Done!');
