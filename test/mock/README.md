# Mocks
This folder contains some files that can be used manually and by unit tests.

- **index.html**: Test page to load in a browser that uses the test.js compiled
  template.


- **test.dust**: The template used for testing.


- **test.control.nopath.js**: Control file generated from the project root with:

        $ node_modules/.bin/dustc -n=test test/mock/test.dust test/mock/test.control.nopath.js

    This is equivalent to either of these:

        $ ./dust-compiler-cli.js -s test/mock -d test/mock --bootstrap
        $ dust-compiler -s test/mock -d test/mock --bootstrap

    A diff should show no changes:

        $ diff test/mock/test.js test/mock/test.control.nopath.js 


- **test.control.inlcudepath.js**: Control file generted from the project root
  with:

        $ node_modules/.bin/dustc -n=test/mock/test test/mock/test.dust test/mock/test.control.includepath.js

    This is equivalent to either:

        $ ./dust-compiler-cli.js -s test/mock -d test/mock --includepath --bootstrap
        $ dust-compiler -s test/mock -d test/mock --includepath --bootstrap

    Again, a diff should show no changes:

        $ diff test/mock/test.js test/mock/test.control.includepath.js


- **test.js**: This is the compile template that is generated from running
  `grunt test`.  It will be overwritten on each test case and by running either
  of the commands above.
