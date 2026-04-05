const fs = require('fs');

let lines = fs.readFileSync('src/store/useTaskStore.ts', 'utf8').split(/\r?\n/);
let found = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('text.split("\\n").map')) {
        lines.splice(i, 1, 
        '  const arr = [];',
        '  let quote = false;',
        '  for (let row = 0, col = 0, c = 0; c < text.length; c++) {',
        '      let cc = text[c], nc = text[c+1];',
        '      arr[row] = arr[row] || [];',
        '      arr[row][col] = arr[row][col] || "";',
        '      if (cc == \\'"\\' && quote && nc == \\'"\\') { arr[row][col] += cc; ++c; continue; }',
        '      if (cc == \\'"\\') { quote = !quote; continue; }',
        '      if (cc == "," && !quote) { ++col; continue; }',
        '      if (cc == "\\r" && nc == "\\n" && !quote) { ++row; col = 0; ++c; continue; }',
        '      if (cc == "\\n" && !quote) { ++row; col = 0; continue; }',
        '      if (cc == "\\r" && !quote) { ++row; col = 0; continue; }',
        '      arr[row][col] += cc;',
        '  }',
        '  return arr;'
        );
        found = true;
        break;
    }
}
if (!found) console.log("Failed to patch useTaskStore.ts");

fs.writeFileSync('src/store/useTaskStore.ts', lines.join('\n'));

let dashLines = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8').split(/\r?\n/);
let foundDash = false;
for (let i = 0; i < dashLines.length; i++) {
    if (dashLines[i].includes('useEffect(() => { initializeMockData(); }, [initializeMockData]);')) {
        dashLines.splice(i, 1,
        '  useEffect(() => {',
        '    initializeMockData();',
        '    const interval = setInterval(() => {',
        '      useTaskStore.getState().loadCSVData();',
        '    }, 5000);',
        '    return () => clearInterval(interval);',
        '  }, [initializeMockData]);'
        );
        foundDash = true;
        break;
    }
}
if (!foundDash) console.log("Failed to patch Dashboard.tsx");

fs.writeFileSync('src/pages/Dashboard.tsx', dashLines.join('\n'));
console.log("Patched successfully");
