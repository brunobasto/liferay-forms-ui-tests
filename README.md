# UI Tests for Liferay Forms

## Installation

Installation is as easy as:

```
[sudo] npm install liferay-forms-ui-tests -g
```

After that, make sure to expose these environment variables pointing to the path of your liferay source and tomcat bundle:

```
export LIFERAY_BUNDLE_HOME=/path/to/bundles/tomcat-7.0.62
export LIFERAY_SOURCE_HOME=/path/to/liferay-portal
```

## Running the tests

To run unit tests, just execute the command:

```
forms test:unit
```

To list all the commands available, run:

```
forms -h
```

And that's it!

## License

[BSD License](https://github.com/metal/metal.js/blob/master/LICENSE.md) © Liferay, Inc.

[![Sauce Test Status](https://saucelabs.com/buildstatus/brunobasto)](https://saucelabs.com/u/brunobasto)