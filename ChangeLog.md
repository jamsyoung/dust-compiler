# Changelog


## 0.1.2
- Updated README


## 0.1.1
- Updated `dustjs-linkedin` to 2.0.3


## 0.1.0
- no functional changes, minor version bumped because it should have always been
  0.1.x from the beginning.

- updated `colors` to 0.6.2

- updated `dustjs-linkedin` to 2.0.2

- added lots of dev dependencies to support grunt test tasks

- added a man page, now you can do `man dust-compiler` from a shell if desired


## 0.0.9
- EXPERIMENTAL - added support for Windows notification via growl ([ZoogieZork][1])

- switched Linux notification to hit notify-send via grow ([ZoogieZork][1])

- upgraded dustjs-linkedin to 1.2.4

- added `-v|--version` argument to display the version installed

- changed how `-s|--source` and `-d|--destination` arguments processed

- reverted `--bootstrap` to only build, it does not watch anymore



## 0.0.8
- code refactoring - made variable names make more sense

- fixed a defect with error messages not being properly displayed by
  terminal-notify in the OS X notification center

- Issue #10 - clearer identification of error messages



## 0.0.7
- modified to not include the .dust extension in the registered name of the
  compiled dust template ([CRHain88][0])



## 0.0.6
- updated `watch` to 0.7.0

- updated `dustjs-linkedin` to 1.2.3

- updated `mkdirp` to 0.3.5

- added `optimist` support for handling command line arguments

- added `colors` support for fancy command line colors when output is written
  to the console

- Issue #4 - added support for recursing directories

- Issue #2 - added `-s|--source` argument for passing in the source directory

- Issue #2 - added `-d|--destination` argument for passing in the destination
  directory

- Issue #8 - added `--includepath` argument to include the path in the compiled
  template as the name

- changed `--no-notify` to `--nonotify`

- improved output to be more verbose

- modified `--bootstrap` to watch after it bootstraps, so no need to re-run the
  compiler after a bootstrap

- Issue #3 - Now traps when source or destination path does not exist



## 0.0.5
- added support notifications on Linux via notify-send

- added `--no-notify` option for platforms that do not have notify-send or
  terminal-notifier support, or people that just don't want to see any
  notifications

- `--bootstrap` option skips directories (vs. crashing)



## 0.0.4
- initial published version



[0]: https://github.com/CRHain88
[1]: https://github.com/ZoogieZork

