# RedsiftUI

[![Circle CI](https://circleci.com/gh/Redsift/redsift-ui.svg?style=svg)](https://circleci.com/gh/Redsift/redsift-ui)

RedsiftUI is a user interface library for rapid development of Sifts and other Red Sift applications. The documentation is available at [here](https://docs.redsift.io/docs/client-code-redsift-ui).

This repository does not contain UI components itself. It contains logic to grab available Red Sift UI components from NPM and to bundle them into packages. Those packages are then served by our CDN as UMD modules. There are multiple bundles which you can use:

###### `core` bundle

Contains the Redsift theme in the *light* and *dark* flavour, as well as UI logic shared between components.

To use the bundle add the following HTML to your project:

```html
<!-- in the <head> section -->
<link rel="stylesheet" href="//static.redsift.io/ui/latest/css/core/redsift-light.min.css">
<!-- or the dark theme: -->
<link rel="stylesheet" href="//static.redsift.io/ui/latest/css/core/redsift-dark.min.css">

<!-- in the <body> section -->
<script src="//static.redsift.io/ui/latest/js/core/redsift.umd.min.js"></script>
```

###### `sift` bundle

This is probably the most important one to start with Sift development. It contains the Redsift theme in the *light* and *dark* flavour, together with the `rs-hero` component.

To use the bundle add the following HTML to your project:

```html
<!-- in the <head> section -->
<link rel="stylesheet" href="//static.redsift.io/ui/latest/css/sift/redsift-light.min.css">
<!-- or the dark theme: -->
<link rel="stylesheet" href="//static.redsift.io/ui/latest/css/sift/redsift-dark.min.css">

<!-- in the <body> section -->
<script src="//static.redsift.io/ui/latest/js/sift/redsift.umd.min.js"></script>
```

###### `full` bundle

To get all the functionality provided by RedsiftUI use this bundle. It contains the Redsift theme in the *light* and *dark* flavour, together with the following (data visualization) components:

* `rs-hero`: A hero unit for your Sift or app
* `rs-radial-chart`: A radial chart for visualizing monthly data
* `rs-schedule`: A scheduling component

To use the bundle add the following HTML to your project:

```html
<!-- in the <head> section -->
<link rel="stylesheet" href="//static.redsift.io/ui/latest/css/full/redsift-light.min.css">
<!-- or the dark theme: -->
<link rel="stylesheet" href="//static.redsift.io/ui/latest/css/full/redsift-dark.min.css">

<!-- in the <body> section -->
<script src="//static.redsift.io/ui/latest/js/full/redsift.umd.min.js"></script>
```

## Development and Customization

The bundles are provided to start quickly with developing your Sifts or applications. To have more control on which parts to include into your project you are encouraged to use the UI components directly. The components are develop in ES2015 for the Javascript and with the [Stylus](http://stylus-lang.com/) CSS preprocessor. It is easy to integrate and customize these components into your projects. Have a look at the `./bundles` folder to get an idea on how to integrate the functionality into your own projects. The following components are available as separate repositories and also als NPM modules:

* [ui-rs-core](https://github.com/Redsift/ui-rs-core) | [npm](https://www.npmjs.com/package/@redsift/ui-rs-core)
* [ui-rs-hero](https://github.com/Redsift/ui-rs-hero) | [npm](https://www.npmjs.com/package/@redsift/ui-rs-hero)
* [ui-rs-radial-chart](https://github.com/Redsift/ui-rs-radial-chart) | [npm](https://www.npmjs.com/package/@redsift/ui-rs-radial-chart)
* [ui-rs-schedule](https://github.com/Redsift/ui-rs-schedule) | [npm](https://www.npmjs.com/package/@redsift/ui-rs-schedule)

## Development Setup

For development directly within this repository run

```bash
> npm run serve
```

within the repository folder. It will start a web server serving the content of `./samples` and supports live-reloading when a source file is changed.
