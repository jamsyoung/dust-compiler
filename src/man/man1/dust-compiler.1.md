# dust-compiler(1) -- Dust.js template watcher/compiler


## SYNOPSIS
dust-compiler -s|--source source_path -d|--destination destination_path
[--bootstrap] [--nonotify] [--includepath] [--amd]



## DESCRIPTION
`dust-compiler` is a command line tool that will watch and compile Dust.js
templates.  It provides notification support for OS X, Linux, and Windows.

The following options are available:

-s, --source         Source path for uncompiled Dust templates.

-d, --destination    Destination path to write out compiled Dust templates.

--bootstrap          Process all files immediatley.

--nonotify           Do not send notification messages.

--includepath        Include the path of the template as part of the registered
                     name in the compiled template.

--amd                Wrap the output AMD style


## SEE ALSO
<https://github.com/jamsyoung/dust-compiler>

<https://npmjs.org/package/dust-compiler>


## AUTHOR
James Young jmeyoung@gmail.com <http://jamsyoung.com>
