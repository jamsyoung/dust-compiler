# Dust Compiler
This is a basic dust compiler, there are many out there. This one adds support
for the OS X 10.8.x Notification Center and notifications on modern Linux
desktops to bring more visiblity to compile errors when developing while the
terminal window that it is running in is not visible.

[![Build Status](https://travis-ci.org/jamsyoung/dust-compiler.png)](https://travis-ci.org/jamsyoung/dust-compiler)
[![NPM version](https://badge.fury.io/js/dust-compiler.png)](http://badge.fury.io/js/dust-compiler)
[![Dependency Status](https://gemnasium.com/jamsyoung/dust-compiler.png)](https://gemnasium.com/jamsyoung/dust-compiler)
[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/jamsyoung/dust-compiler/trend.png)](https://bitdeli.com/free "Bitdeli Badge")


## Install
It is recommended to install this globally so you can have dust-copmiler to run
from any location on your machine, for any project you are working on.

    $ npm install -g dust-compiler


## File Extension
Expectation is that the files being compiled end in the `.dust` file extension


### Enabling notifications in Linux
Many Linux distributions ship with the `notify-send` tool already installed.
If not, you will need to install the "libnotify-bin" (Ubuntu) or "libnotify"
(RedHat / Fedora) packages.


## Turning it on
To fire it up just do this:

    $ dust-compiler -s source_path -d destination_path

Notifications will look like this:

Success!

![](http://new.tinygrab.com/d34460e816c9911aabc9cebaa92ac8c13910a39faa.png)

or Failure :(

![](http://new.tinygrab.com/d34460e8169c9c133481adf8a39126e0a40984b603.png)


## Bootstrapping
In cases where you are creating a new project and have lots of existing dust
templates, you will want to bootstrap the files.  To save time you can run
the following to automatically build everything in the source folder.

    $ dust-compiler -s source_path -d destination_path --bootstrap


## Disabling notifications
Don't like the notifications?  Prefer to watch the terminal window instead?

    $ dust-compiler -s source_path -d destination_path --nonotify


## Include path in compiled template name
This may not be of value to everyone, but it is to me.  In some conditions you
may need the name of the compiled template that is registered in the Dust.js
cache to include the path.  Using the same templates on server side and client
side may require this.  I added a switch for that.

    $ dust-compiler -s source_path -d destination_path --includepath


## AMD
If you need your compiled template to be output AMD style you can add a `--amd`
flag.  This will wrap it with the following, where `COMPILED_TEMPLATE` contains
the compiled template.  I don't personally use templates this way. If this
feature needs to be optimized, add details to issue #14 or open a new issue.

    define(["dust"], function () { dust = require("dust"); COMPILED_TEMPLATE });


## Overloading arguments
You can load up your command line with just about everything.

    $ dust-compiler -s source_path -d destination_path --bootstrap --includepath --nonotify --amd


## Development

### Common Tasks
Look in the Gruntfile.js for more details.

- `grunt test` - Runs all of the completed grunt test tasks.

- `npm run build-man` - Builds the man page.

