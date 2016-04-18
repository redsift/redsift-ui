# Redsift UI

[![Circle CI](https://circleci.com/gh/Redsift/redsift-ui.svg?style=svg)](https://circleci.com/gh/Redsift/redsift-ui)

Common UI components for Sifts and Apps.

## Development workflow

### Interactive development

	$ npm install
	$ npm run serve

### Development integration into your project

To extend and update **redsift-ui** from within an application which uses the library you can do the following (the application has to be a git repository):

```shell
cd my-application
git submodule add https://github.com/Redsift/redsift-ui.git
(cd redsift-ui && npm install && sudo npm link)
npm link redsift-ui
```

After these lines 'redsift-ui' is installed as npm module in *my-application* and you can import its files from 'npm_modules/redsift-ui'.

### Trigger application reload on redsift-ui change

Gulp, Grunt, Meteor, etc. provide auto reload functionality when a file within the application tree is changing. Typically the `npm_modules` folder is not watched, therefore a change within the **redsift-ui** folder will not trigger a reload of the application.

To enable this handy feature create a new file `./my-application/npm_modules/redsift-ui/trigger-app-reload.json` and add the following content:

```JSON
{
  "watchedFolder": "/path/to/watched/folder"
}
```

Replace `/path/to/watched/folder` with a path suited for your application and restart the interactive development setup of **redsift-ui**:

> CAUTION: Do **NOT** use `~` to specify a home folder, it is not supported!

```shell
cd my-application/npm_modules/redsift-ui
npm run serve
```

After this setup each change in **redsift-ui** will trigger a file creation/update in the `watchedFolder` and reload the application, which in turn pulls in the updated **redsift-ui** files.

### Image optimization

The repository contains the script `forweb.sh` to optimize images in size. It also takes care of generating an image version for high-dpi, retina displays.

#### Prerequisites (MacOS)

1. install [brew](http://brew.sh/)
2. install [cwebp](https://developers.google.com/speed/webp/docs/precompiled#getting_cwebp_dwebp_and_the_webp_libraries) in copying the scripts in the `bin` folder to `/usr/local/bin`
3. `brew install imagemagick`

After that run the script like so:

```
./forweb.sh path/to/image outputpath/basename
```
