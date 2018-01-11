# webpack-symfony

## Webpack configuration file for Symfony project - turnkey

### How it works

Scripts which are in `assets/pages` folder are bundled into `public/js`.

You can override directory with environment variable:

- PAGE_DIR: absolute path to entries of type page directory _(ex: '/home/project/assets')_
- PUBLIC_DIR: absolute path to public folder _(ex: '/home/project/public')_
- OUTPUT_DIR: folder name between public directory and page path _(ex: 'js')_

### Install

- `npm i -S git+https://git@github.com:JochLAin/webpack-symfony.git`
- Update package.json scripts section with:
    - "dev": "webpack-symfony"
    - "prod": "NODE_ENV="prod" webpack-symfony"

### Work with WEBPACK_ENTRY environment variable

The value of this variable is, by default, a relative path, from `assets/pages/`.
It can be a file or a folder.

*Examples:*

- `WEBPACK_ENTRY="game" npm run dev -- --watch` => _assets/pages/game/*_
- `WEBPACK_ENTRY="homepage.jsx" npm run dev -- --watch` => _assets/pages/homepage.jsx_
- `WEBPACK_ENTRY="profile/index.jsx" npm run dev -- --watch` => _assets/pages/profile/index.jsx_

If first arguments is a string, it's interpreted as entry filename.
Other arguments are passed to webpack

*Examples:*
- `npm run dev game -- --watch` => _assets/pages/game/*_
- `npm run dev homepage.jsx -- --watch` => _assets/pages/homepage.jsx_
- `npm run dev profile/index.jsx -- --watch` => _assets/pages/profile/index.jsx_

### Requirements

Webpack 3