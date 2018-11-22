## Webpack configuration - turnkey

> Move to package [Webpack turnkey](https://www.npmjs.com/package/webpack-turnkey)

### How it works

Scripts which are in `assets/pages` folder are bundled into `public/js`.

You can override directory with environment variable:

- WEBPACK_TURNKEY_PROJECT_DIR: absolute path to the project directory (process.cwd) _(ex: '/home/project')_
- WEBPACK_TURNKEY_ASSET_SUFFIX: relative path to PROJECT_DIR (process.cwd) _(ex: 'assets')_
- WEBPACK_TURNKEY_ASSET_DIR: absolute path to entries of type asset directory _(ex: '/home/project/assets')_
- WEBPACK_TURNKEY_PAGE_SUFFIX: relative path to ASSET_DIR _(ex: 'pages')_
- WEBPACK_TURNKEY_PAGE_DIR: absolute path to entries of type page directory _(ex: '/home/project/assets/pages')_
- WEBPACK_TURNKEY_PUBLIC_SUFFIX: relative path to PROJECT_DIR (process.cwd) _(ex: 'public')_
- WEBPACK_TURNKEY_PUBLIC_DIR: absolute path to public folder _(ex: '/home/project/public')_
- WEBPACK_TURNKEY_OUTPUT_SUFFIX: folder name between public directory and page path _(ex: 'js')_

### Install

- `npm i -S webpack-turnkey`
- Update package.json

```json
{
    "name": "...",
    "version": "...",
    "scripts": {
        "dev": "webpack-turnkey", /* Add '-d' argument to webpack command */
        "prod": "NODE_ENV=prod webpack-turnkey", /* Add '-p' argument to webpack command */
    },
}
```

### Work with WEBPACK_TURNKEY_ENTRY environment variable

The value of this variable is, by default, a relative path, from `assets/pages/`.
It can be a file or a folder.

*Examples:*

- `WEBPACK_TURNKEY_ENTRY="game" npm run dev` => _assets/pages/game/*_
- `WEBPACK_TURNKEY_ENTRY="homepage.jsx" npm run dev` => _assets/pages/homepage.jsx_
- `WEBPACK_TURNKEY_ENTRY="profile/index.jsx" npm run dev` => _assets/pages/profile/index.jsx_

Shortcut to argument(s) with no options related exists too :

*Examples:*

- `npm run dev -- game` => _assets/pages/game/*_
- `npm run dev -- homepage.jsx` => _assets/pages/homepage.jsx_
- `npm run dev -- profile/index.jsx` => _assets/pages/profile/index.jsx_
- `npm run dev -- game homepage.jsx profile/index.jsx` => _assets/pages/profile/index.jsx_

### Options

#### Sourcemap

> An option `--sourcemap` use it with : `npm run dev -- --sourcemap`
> It will set options to true for styles loaders

#### ESLint

> An option `--eslint` use it with : `npm run dev -- --eslint`
> It will add `.eslintrc.js` at the root of your project if not exists and compile with it.

#### Watch and other options

> Other options like `--watch` are passed to webpack command

### Proposed configuration

#### Loaders

Files loaded and extensions permitted :

For codes files :

- .html
- .js / .jsx
- .css
- .sass / .scss

For images files :

- .jpg / .jpeg
- .png
- .gif

For fonts files :

- .svg
- .woff / .woff2
- .ttf / .otf
- .eot

#### Aliases

You can call specifics folders with aliases, there are :

- @actions => `ASSET_DIR/actions`
- @capsules => `ASSET_DIR/capsules`
- @components => `ASSET_DIR/components`
- @connecters => `ASSET_DIR/connecters`
- @constants => `ASSET_DIR/constants`
- @containers => `ASSET_DIR/containers`
- @fonts => `ASSET_DIR/fonts`
- @images => `ASSET_DIR/images`
- @middlewares => `ASSET_DIR/middlewares`
- @pages => `ASSET_DIR/pages`
- @reducers => `ASSET_DIR/reducers`
- @sounds => `ASSET_DIR/sounds`
- @stylesheets => `ASSET_DIR/stylesheets`
- @utils => `ASSET_DIR/utils`
- @videos => `ASSET_DIR/videos`

### Customization

Create your own `webpack.config.js` at the root of your project and run `webpack` command.

```javascript
'use strict';

const config = require('webpack-turnkey/config.js');

module.exports = Object.assign({}, config);
```

If you run `webpack-turnkey` command with a `webpack-turnkey.config.js` file, it will merge default config with your config.

```javascript
module.exports = {
    alias: {...},
    rules: [{...}, {...}, ...],
    extensions: [...]
};
```

### Requirements

Webpack >= 3.10

### Thanks

![Thanks BP](https://media1.giphy.com/media/yoJC2El7xJkYCadlWE/giphy.gif)