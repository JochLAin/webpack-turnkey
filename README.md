# Webpack configuration file for Symfony project

You can override default options in __CONFIG__ variable.

You can add or remove aliases in __ALIASES__ variable.

## How it works

Creates an alias for all folders contained in the 'ALIASES' variable that are located in the 'Resources' folders, if they exist..

Scripts which are in `app/Resources/pages` folder are bundled into `web/js`.

Scripts which are in `src/(.*)Bundle/Resources/pages` folder are bundled into `web/bundles/$1/js`.

__Bundle name is slugify like `bin/console assets:install` does.__

_Example: `App/BlogBundle` => `app_blog`_

## Work with WEBPACK_ENTRY environment variable

The value of this variable is, by default, a relative path, from `app/Resources/pages/`.
It can be a file or a folder.

You can also work with absolute path and retrieve your file into `web/js/${path}`.

*Examples:*

- *`WEBPACK_ENTRY="game" npm run dev`* => _app/Resources/pages/game/*_
- *`WEBPACK_ENTRY="homepage.jsx" npm run dev`* => _app/Resources/pages/homepage.jsx_
- *`WEBPACK_ENTRY="profile/index.jsx" npm run dev`* => _app/Resources/pages/profile/index.jsx_
- *`WEBPACK_ENTRY="@AppBundle" npm run dev`* => _src/AppBundle/Resources/pages/*_
- *`WEBPACK_ENTRY="@App/BlogBundle" npm run dev`* => _src/App/BlogBundle/Resources/pages/*_
- *`WEBPACK_ENTRY="@App/BlogBundle/homepage.jsx" npm run dev`* => _src/App/BlogBundle/Resources/pages/homepage.jsx_
- *`WEBPACK_ENTRY="@App/BlogBundle/article/view.jsx" npm run dev`* => _src/App/BlogBundle/Resources/pages/article/view.jsx_

## Requirements

Webpack 2

## Enjoy !

Libre à vous de le modifier à votre convenance.