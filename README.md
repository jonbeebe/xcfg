# xcfg

[![GitHub Issues](https://img.shields.io/github/issues/jonbeebe/xcfg.svg)](https://github.com/jonbeebe/xcfg/issues)
[![ISC License](https://img.shields.io/badge/license-ISC-blue.svg)](https://github.com/jonbeebe/xcfg/blob/master/LICENSE)
[![JavaScript Standard Style](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Cross-platform config file management made easy. Works great with command-line tools and [Electron](https://electron.atom.io) apps.

## Overview

When building command-line tools and desktop apps with [Node.js](https://nodejs.org/en/), there exists a common need for managing application configuration files.

**xcfg** is a package that saves you the trouble of validating config paths across multiple platforms and creating the config file. It makes config file management easy by handling all IO operations under the hood, and provides a simple `get()` and `set()` interface for individual configuration properties. JSON is used as the config file format to be easy on both machines and humans (and to eliminate the need for 3rd party dependencies).

## Installation

```
$ cd node-project
$ npm install xcfg
```

## Usage

Require the module and create a new instance:

```
var Xcfg = require('xcfg')
var xcfg = new Xcfg('net.jonbeebe.myapp')
```

On construction, after sanitizing the `id`, it is used to create a configuration file (if it doesn't already exist) at the following path: `~/.config/net.jonbeebe.myapp/config.json`

After that, you can use the `xcfg` instance to get, set, and delete properties on the in-memory object:

```
xcfg.set('foo', 'bar')
xcfg.get('foo') // bar
xcfg.del('foo')
xcfg.get('foo') // undefined
```

The above will only manipulate the in-memory config instance. To persist changes to disk, use `save()`:

```
xcfg.save()
```

And while there's *a little* more to it than that, that's the basic idea and really all you need to know to use this package. To see more methods and options, view the documentation.

## Documentation

Build and view the documentation locally:

```
$ npm run docs
$ open ./docs/index.html
```

## Tests

```
$ npm run test
```

All tests were written using the [mocha](https://mochajs.org) and [chai](http://chaijs.com) packages.

## JavaScript Standard Style

[![JavaScript Standard Style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://standardjs.com)

This project conforms to the JavaScript Standard Style. You can check for style errors by running:

```
$ npm run lint
```

## License

Copyright (c) 2017, Jonathan Beebe

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR
IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
