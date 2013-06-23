# Dust Compiler
[![NPM version](https://badge.fury.io/js/dust-compiler.png)](http://badge.fury.io/js/dust-compiler)

This is a basic dust compiler, there are many out there. This one adds support
for the OS X 10.8.x Notification Center and notifications on modern Linux
desktops to bring more visiblity to compile errors when developing while the
terminal window that it is running in is not visible.


## Install
You will likely integrate this into the project you are working on.  Add this
as a devDependency in your package.json and:

    $ npm install

Next add a symlink to `node_modules/.bin/dust-compiler` anywhere you like in
your project folder.


### Enabling notifications in Linux
Many Linux distributions ship with the `notify-send` tool already installed.
If not, you will need to install the "libnotify-bin" (Ubuntu) or "libnotify"
(RedHat / Fedora) packages.


## Turning it on
To fire it up just do this:

    $ ./dust-compiler -s source_path -d destination_path

Notifications will look like this:

Success!

![](http://grab.by/jrgo)

or Failure :(

![](http://grab.by/jrh4)


## Bootstrapping
In cases where you are creating a new project and have lots of existing dust
templates, you will want to bootstrap the files.  To save time you can run
the following to automatically build everything in the source folder.

    $ ./dust-compiler -s source_path -d destination_path --bootstrap


## Disabling notifications
Don't like the notifications?  Prefer to watch the terminal window instead?

    $ ./dust-compiler -s source_path -d destination_path --nonotify


## Include path in compiled template name
This may not be of value to everyone, but it is to me.  In some conditions you
may need the name of the compiled template that is registered in the Dust.js
cache to include the path.  Using the same templates on server side and client
side may require this.  I added a switch for that.

    $ ./dust-compiler -s source_path -d destination_path --includepath


## Overloading arguments
You can load up your command line with just about everything.

    $ ./dust-compiler -s source_path -d destination_path --bootstrap --includepath --nonotify


