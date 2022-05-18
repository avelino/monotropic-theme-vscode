const fs = require('fs');
const { join } = require('path');
const { Type, DEFAULT_SCHEMA, load } = require('js-yaml');
const tinycolor = require('tinycolor2');

/**
 * @typedef {Object} TokenColor - Textmate token color.
 * @prop {string} [name] - Optional name.
 * @prop {string[]} scope - Array of scopes.
 * @prop {Record<'foreground'|'background'|'fontStyle',string|undefined>} settings - Textmate token settings.
 *       Note: fontStyle is a space-separated list of any of `italic`, `bold`, `underline`.
 */

/**
 * @typedef {Object} Theme - Parsed theme object.
 * @prop {Record<'base'|'ansi'|'brightOther'|'other', string[]>} monotropic - monotropic color variables.
 * @prop {Record<string, string|null|undefined>} colors - VSCode color mapping.
 * @prop {TokenColor[]} tokenColors - Textmate token colors.
 */

/**
 * @typedef {(yamlObj: Theme) => Theme} ThemeMaker
 */
const withAlphaType = new Type('!alpha', {
    kind: 'sequence',
    construct: ([hexRGB, alpha]) => hexRGB + alpha,
    represent: ([hexRGB, alpha]) => hexRGB + alpha,
});
const schema = DEFAULT_SCHEMA.extend([withAlphaType]);

/**
 * Merge yaml files based on list and load into yaml object.
 * @type {ThemeMaker}
 */
const mergeYaml = filesArray => {
    var merged = "";
    filesArray.forEach(function(file) {
        merged += fs.readFileSync(file, 'utf8');
    });
    console.log(merged)
    return load(merged, { schema });
};

/**
 * Theme variant make.
 * @type {ThemeMaker}
 */
const makeTheme = name => {
    // merge yaml files
    const theme = mergeYaml([
        join(__dirname, '..', 'src', name + '.yml'),
        join(__dirname, '..', 'src', 'monotropic.yml')
    ]);
    // Remove nulls and other falsey values from colors
    for (const key of Object.keys(theme.colors)) {
        if (!theme.colors[key]) {
            delete theme.colors[key];
        }
    }
    return theme;
};

module.exports = async() => {
    return {
        base: makeTheme("base"),
        coffee: makeTheme("coffee")
    }
};