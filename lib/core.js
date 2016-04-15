/**
 * @license The MIT License (MIT)
 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
 */

/* eslint no-path-concat: 0 */

'use strict';

var app     = require('spa-app/lib/core'),
    metrics = require('app:metrics'),
    linkCSS;


/**
 * Set crops, total, content size and link the corresponding CSS file.
 *
 * @param {Object} metrics screen params specific to resolution
 *
 * @return {boolean} operation status
 */
function setScreen ( metrics ) {
    if ( DEVELOP ) {
        if ( arguments.length !== 1 ) { throw new Error(__filename + ': wrong arguments number'); }
    }

    if ( metrics ) {
        if ( DEVELOP ) {
            if ( typeof metrics !== 'object' ) { throw new Error(__filename + ': wrong metrics type'); }
        }

        // calculate and extend
        metrics.availHeight = metrics.height - (metrics.availTop + metrics.availBottom);
        metrics.availWidth  = metrics.width - (metrics.availLeft + metrics.availRight);

        // set max browser window size
        window.moveTo(0, 0);
        window.resizeTo(metrics.width, metrics.height);

        // already was initialized
        if ( linkCSS && linkCSS instanceof HTMLLinkElement ) {
            // remove all current CSS styles
            document.head.removeChild(linkCSS);
        }

        // load CSS file base on resolution
        linkCSS = document.createElement('link');
        linkCSS.rel  = 'stylesheet';
        linkCSS.href = 'css/' + (DEVELOP ? 'develop.' : 'release.') + metrics.height + '.css?' + +new Date();
        document.head.appendChild(linkCSS);

        // provide global access
        app.metrics = metrics;

        return true;
    }

    // nothing has applied
    return false;
}


// apply screen size, position and margins
setScreen(metrics[app.query.screenHeight] || metrics[screen.height] || metrics[720]);

// execution environment
// STB device or desktop browser
app.host = true;


// public
module.exports = app;