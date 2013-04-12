# Dust Compiler
This is a basic dust compiler, there are many out there. This one adds support
for the OS X 10.8.x Notification Center and notifications on modern Linux
desktops to bring more visiblity to compile errors when developing while the
terminal window that it is running in is not visible.


## Install
You will likely integrate this into the project you are working on.  Add this
as a devDependency in your package.json and:

    $ npm install

Next add a symlink to `node_modules/.bin/dust-compiler` anywhere you like in
your project folder.  Edit the file and set the `source` and `destination`
paths on where it should watch for dust files (source), and where it should
write compiled js files (destination).


### Enabling notifications in Linux
Many Linux distributions ship with the `notify-send` tool already installed.
If not, you will need to install the "libnotify-bin" (Ubuntu) or "libnotify"
(RedHat / Fedora) packages.


## Turning it on
To fire it up just do this:

    $ ./dust-compiler

Notifications will look like this:

Success!

![](http://grab.by/jrgo)

or Failure :(

![](http://grab.by/jrh4)


## Bootstrapping
In cases where you are creating a new project and have lots of existing dust
templates, you will want to bootstrap the files.  To save time you can run
the following to automatically build everything in the source folder.

    $ ./dust-compiler --bootstrap


## Disabling notifications
Don't like the notifications?  Prefer to watch the terminal window instead?

    $ ./dust-compiler --no-notify
