const fs = require('fs');
const path = require('path');

const kanjiDataRaw = fs.readFileSync(path.join(__dirname, 'kanjiDict.json'), 'utf8');
const kanjiDict = JSON.parse(kanjiDataRaw);

const sortedKanjis = Object.entries(kanjiDict)
    .filter(([k, d]) => d.wk_level)
    .sort((a,b) => a[1].wk_level - b[1].wk_level);

const radicalDict = {};

// Find first appearance of each radical
sortedKanjis.forEach(([kanji, data]) => {
    if (data.wk_radicals) {
        data.wk_radicals.forEach(rad => {
            if (!radicalDict[rad]) {
                radicalDict[rad] = {
                    name: rad,
                    level: data.wk_level, // The radical belongs to the level it first appears in WK
                    kanjis: []
                };
            }
            radicalDict[rad].kanjis.push(kanji);
        });
    }
});

// Write to radicalDict.json
fs.writeFileSync(path.join(__dirname, 'radicalDict.json'), JSON.stringify(radicalDict, null, 2));
console.log(`Generated ${Object.keys(radicalDict).length} radicals to src/data/radicalDict.json`);
