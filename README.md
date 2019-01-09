## Webpack configuration - turnkey

> Move to package [Webpack turnkey](https://www.npmjs.com/package/webpack-turnkey)

### How it works

Scripts which are in **assets/pages** folder are bundled into **public/js** as default.

### Install

- `npm i -S webpack-turnkey`
- Update package.json

### Usage

There are two ways to use it :

- With [npx](https://www.npmjs.com/package/npx)  
    `npx webpack-turnkey`
- With package scripts
    ```json
    {
        "name": "...",
        "version": "...",
        "scripts": {
            "dev": "webpack-turnkey",
            "prod": "NODE_ENV=prod webpack-turnkey"
        },
    }
    ```

By default the command add `-d` option, when environment variable **NODE_ENV** is equal to **prod** it will pass the `-p` option.

### Work with WEBPACK_TURNKEY_ENTRY environment variable

The value of this variable is, by default, a relative path, from **assets/pages/**.
It can be a file or a folder.

*Examples:*

- `WEBPACK_TURNKEY_ENTRY="game" npx webpack-turnkey`
  - => _assets/pages/game/*_
- `WEBPACK_TURNKEY_ENTRY="homepage.jsx" npx webpack-turnkey`
  - => _assets/pages/homepage.jsx_
- `WEBPACK_TURNKEY_ENTRY="profile/index.jsx" npx webpack-turnkey`
  - => _assets/pages/profile/index.jsx_

Shortcut to argument(s) with no options related exists too :

*Examples:*

- `npx webpack-turnkey game`
  - => _assets/pages/game/*_
- `npx webpack-turnkey homepage.jsx`
  - => _assets/pages/homepage.jsx_
- `npx webpack-turnkey profile/index.jsx`
  - => _assets/pages/profile/index.jsx_
- `npx webpack-turnkey game homepage.jsx profile/index.jsx`
  - => _assets/pages/game/*_
  - => _assets/pages/homepage.jsx_
  - => _assets/pages/profile/index.jsx_

### Override directories

You can override directory with environment variable:

- **WEBPACK_TURNKEY_PROJECT_DIR**:
  - absolute path to the project directory (process.cwd)
  - _(ex: '/home/project')_
- **WEBPACK_TURNKEY_ASSET_SUFFIX**:
  - relative path to PROJECT_DIR (process.cwd)
  - _(ex: 'assets')_
- **WEBPACK_TURNKEY_ASSET_DIR**:
  - absolute path to entries of type asset directory
  - _(ex: '/home/project/assets')_
- **WEBPACK_TURNKEY_PAGE_SUFFIX**:
  - relative path to ASSET_DIR
  - _(ex: 'pages')_
- **WEBPACK_TURNKEY_PAGE_DIR**:
  - absolute path to entries of type page directory
  - _(ex: '/home/project/assets/pages')_
- **WEBPACK_TURNKEY_PUBLIC_SUFFIX**:
  - relative path to PROJECT_DIR (process.cwd)
  - _(ex: 'public')_
- **WEBPACK_TURNKEY_PUBLIC_DIR**:
  - absolute path to public folder
  - _(ex: '/home/project/public')_
- **WEBPACK_TURNKEY_OUTPUT_SUFFIX**:
  - folder name between public directory and page path
  - _(ex: 'js')_
- **WEBPACK_TURNKEY_OUTPUT_DIR**:
  - absolute path to output directory
  - _(ex: '/home/project/public/js')_

### Options

#### Sourcemap

> An option `--sourcemap` use it with : `npx webpack-turnkey --sourcemap`
> It will set options to true for styles loaders

#### ESLint

> An option `--eslint` use it with : `npx webpack-turnkey --eslint`
> It will add `.eslintrc.js` at the root of your project if not exists and compile with it.

#### Bundled

> An option `--bundled` use it with : `npx webpack-turnkey --bundled`
> It will set the project directory to the current working directory
> 
> Usefull for Symfony <= 3 projects & assetic  
> `cd src/MyBundle/Ressources && npx webpack-turnkey --bundled`  
> It will compile files in **`MyBundle/Resources/assets/pages`** to **`MyBundle/Resources/public/js`**

#### Watch and other options

> Other options like `--watch` are passed to webpack command

### Proposed configuration

#### Loaders

Files loaded and extensions permitted :

For codes files :

- .html
- .js / .jsx / .mjs
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

- @actions => *ASSET_DIR/actions*
- @capsules => *ASSET_DIR/capsules*
- @components => *ASSET_DIR/components*
- @connecters => *ASSET_DIR/connecters*
- @constants => *ASSET_DIR/constants*
- @containers => *ASSET_DIR/containers*
- @fonts => *ASSET_DIR/fonts*
- @images => *ASSET_DIR/images*
- @managers => *ASSET_DIR/managers*
- @middlewares => *ASSET_DIR/middlewares*
- @models => *ASSET_DIR/models*
- @pages => *ASSET_DIR/pages*
- @reducers => *ASSET_DIR/reducers*
- @sounds => *ASSET_DIR/sounds*
- @stylesheets => *ASSET_DIR/stylesheets*
- @utils => *ASSET_DIR/utils*
- @videos => *ASSET_DIR/videos*

### Customization

Create your own **webpack.config.js** at the root of your project and run `webpack` command.

```javascript
'use strict';

const wpt = require('webpack-turnkey');

module.exports = Object.assign({}, wpt.config);
```

If you run `webpack-turnkey` command with a *webpack-turnkey.config.js* file, it will merge default config with your config.

```javascript
module.exports = {
    alias: {...},
    rules: [{...}, {...}, ...],
    extensions: [...]
};
```

### Generation

`npx webpack-turnkey --generate <format>`

To generate template for start coding, two format are available:

- **minimal**:
  - Create asset and public folders
  - Add folders in *ASSET_DIR*
    - _components_
    - _stylesheets_
- **starter**:
  - Create asset and public folders
  - Add folders in *ASSET_DIR*
    - _components_
    - _constants_
    - _managers_
    - _models_
    - _stylesheets_
    - _utils_
  - Install modules
    - @fortawesome/fontawesome
    - @fortawesome/fontawesome-free
    - @fortawesome/react-fontawesome
    - bootstrap
    - classnames
    - jquery
    - popper.js
    - react
    - react-dom
    - toast
  - Create files
    - components/super.jsx : An improved component (can be deleted if not used)
    - middlewares/event.js : Contains an prevent middleware
    - **pages/style.js** : Instanciate boostrap, fontawesome, jquery, toastr
    - **stylesheets/\*** : Import style with helpers

### Requirements

Webpack >= 3.10

### Thanks

![Thanks BP](https://media1.giphy.com/media/yoJC2El7xJkYCadlWE/giphy.gif)