# webpack-symfony

## Webpack configuration file for Symfony project - turnkey

### How it works

Scripts which are in `assets/pages` folder are bundled into `public/js`.

You can override directory with environment variable:

- PROJECT_DIR: absolute path to the project directory (process.cwd) _(ex: '/home/project')_
- ASSET_SUFFIX: relative path to PROJECT_DIR (process.cwd) _(ex: 'assets')_
- ASSET_DIR: absolute path to entries of type asset directory _(ex: '/home/project/assets')_
- PAGE_SUFFIX: relative path to ASSET_DIR _(ex: 'pages')_
- PAGE_DIR: absolute path to entries of type page directory _(ex: '/home/project/assets/pages')_
- PUBLIC_SUFFIX: relative path to PROJECT_DIR (process.cwd) _(ex: 'public')_
- PUBLIC_DIR: absolute path to public folder _(ex: '/home/project/public')_
- OUTPUT_SUFFIX: folder name between public directory and page path _(ex: 'js')_

### Install

- `npm i -S webpack-symfony`
- Update package.json scripts section with:
    - "dev": "webpack-symfony" // Add '-d' argument to webpack command
    - "prod": "NODE_ENV="prod" webpack-symfony" // Add '-p' argument to webpack command

### Work with WEBPACK_ENTRY environment variable

The value of this variable is, by default, a relative path, from `assets/pages/`.
It can be a file or a folder.

*Examples:*

- `WEBPACK_ENTRY="game" npm run dev` => _assets/pages/game/*_
- `WEBPACK_ENTRY="homepage.jsx" npm run dev` => _assets/pages/homepage.jsx_
- `WEBPACK_ENTRY="profile/index.jsx" npm run dev` => _assets/pages/profile/index.jsx_

If first arguments is a string, it's interpreted as entry filename.
Other arguments are passed to webpack

*Examples:*
- `npm run dev game -- --watch` => _assets/pages/game/*_
- `npm run dev homepage.jsx -- --watch` => _assets/pages/homepage.jsx_
- `npm run dev profile/index.jsx -- --watch` => _assets/pages/profile/index.jsx_

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

Create your own `webpack.config.js` at the root of your project.

```javascript
'use strict';

const config = require('webpack-symfony/config.js');

module.exports = Object.assign({}, config);
```

If you run `webpack-symfony` command with a `webpack.config.js` file, it will merge default config with your config.

### Requirements

Webpack 3.10

### Thanks