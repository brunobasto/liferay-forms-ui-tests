# UI Tests for Liferay Forms

## Install

Installations is as easy as:

```
npm install
```

## Running the tests

To run the tests, just execute the command:

```
npm test
```

And that's it!

## Command line tool

If you want to run the tests form anywhere, install it as a global executable:

```
npm install liferay-forms-ui-tests -g
```

Create a config file in your home directory called forms.config.js like this one:

```
module.exports = {
    liferayBundleDir: '/Users/myuser/Projects/bundles/tomcat-7.0.62',
    liferaySourceDir: '/Users/myuser/Projects/liferay-portal'
};
```

And run the tests:

```
forms test
```

## License

[BSD License](https://github.com/metal/metal.js/blob/master/LICENSE.md) © Liferay, Inc.