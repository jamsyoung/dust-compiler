'use strict';

// require('blanket')({
//     'data-cover-only': [ 'src/' ],
//     'data-cover-never': ['node_modules', 'test']
// });
require('blanket')({
    // Only files that match the pattern will be instrumented
    pattern: '/src/'
});
