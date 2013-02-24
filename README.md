# Dust Compiler
This is a basic dust compiler, there are many out there. This one adds support
for OS X 10.8.x Notification Center to bring more visiblity to compile errors
when developing while the terminal window that it is running in is not visible.


## Install
You will likely integrate this into the project you are working on.  Place the
`package.json` in the root of your project folder and run `npm install`.  This
will install the other node packages needed.

    $ npm install

Next put `dust-compiler.js` anywhere you like in your project folder.  Edit the
file and set the `source` and `destination` paths on where it should watch for
dust files (source), and where it should write compiled js files (destination).


## Changing default Paths
This defaults to look for dust templates in a dust folder and puts compiled
templtes into a js folder.  If you want to change these, edit the `dust-compiler.js`
file.


## Turning it on
To fire it up just do this:

    $ node dust-compiler.js

Notifications will look like this:

Success!

![](http://grab.by/jrgo)

or Failure :(

![](http://grab.by/jrh4)
