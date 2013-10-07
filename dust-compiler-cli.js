#!/usr/bin/env node

/**
  * this is a wrapper around the node app to allow it to be executed like a
  * shell script and keep the shebang from blowing things up.
  */

require('./lib/dust-compiler.js');
