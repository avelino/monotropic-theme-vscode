const fs = require('fs');
const path = require('path');
const generate = require('./generate');

const THEME_DIR = path.join(__dirname, '..', 'theme');

if (!fs.existsSync(THEME_DIR)) {
    fs.mkdirSync(THEME_DIR);
}

module.exports = async() => {
    const { base, coffee } = await generate();
    return Promise.all([
        fs.promises.writeFile(
            path.join(THEME_DIR, 'monotropic.json'),
            JSON.stringify(base, null, 2)
        ),
        fs.promises.writeFile(
            path.join(THEME_DIR, 'monotropic-coffee.json'),
            JSON.stringify(coffee, null, 2)
        ),
    ]);
};

if (require.main === module) {
    module.exports();
}