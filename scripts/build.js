const fs = require('fs');
const path = require('path');
const generate = require('./generate');

const THEME_DIR = path.join(__dirname, '..', 'theme');

if (!fs.existsSync(THEME_DIR)) {
    fs.mkdirSync(THEME_DIR);
}

module.exports = async() => {
    const themes = await generate();
    var allThemes = [];
    for (const theme of Object.keys(themes)) {
        const themeName = 'monotropic' +
            (theme != 'base' ? '-' + theme : '') +
            '.json';
        allThemes.push(fs.promises.writeFile(
            path.join(THEME_DIR, themeName),
            JSON.stringify(themes[theme], null, 2)
        ))
    }
    return Promise.all(allThemes);
};

if (require.main === module) {
    module.exports();
}