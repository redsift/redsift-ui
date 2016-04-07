# Redsift UI

[![Circle CI](https://circleci.com/gh/Redsift/redsift-ui.svg?style=svg)](https://circleci.com/gh/Redsift/redsift-ui)

Common UI components for Sifts and Apps.

## Interactive development

	$ npm install
	$ npm run serve

## Development workflow

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

| CAUTION: Do **NOT** use `~` to specify your home folder, as it is not supported!

```shell
cd my-application/npm_modules/redsift-ui
npm run serve
```

After this setup each change in **redsift-ui** will trigger a file creation/update in the `watchedFolder` and reload the application, which in turn pulls in the updated **redsift-ui** files.
