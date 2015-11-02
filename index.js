var marked = require("marked");
var cheerio = require('cheerio');
var he = require("he");
var _ = require("lodash");

var extname = require('path').extname;

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * A Metalsmith plugin to use markdown content within html tags (with data-markdown attribute)
 * parses markdown (via marked) and inserts html on all tags that have the data-markdown attribute set (via cheerio)
 * he is required to decode html entities
 *
 * Idea originally by Paul Irish, see https://gist.github.com/paulirish/1343518
 *
 * @param {Object} options
 * @return {Function}
 */

function plugin(options) {

  var opts = options || {};

  // set default options or args
  opts.marked = opts.marked || {};
  opts.removeAttributeAfterwards = opts.removeAttributeAfterwards || false;

  // hand opts to marked
  marked.setOptions(opts.marked);

  return function(files, metalsmith, done) {
    setImmediate(done);
    Object.keys(files).forEach(function(file) {
      if (!isHtml(file)) return;
      var data = files[file];
      var foundMatches = false;

      // parse html content in cheerio to query it
      var $ = cheerio.load(data.contents.toString());

      $("[data-markdown]").each(function(index) {
        
        // grab the html of the node and 
        // decode all html entities (as marked doesn't have to know about them)
        // decoding fixes problems with smartypants
        var markedText = marked(he.decode($(this).html()));

        // set compiled markdown content to node
        $(this).html(markedText);
        foundMatches = true;

        // remove attr if configured
        if (opts.removeAttributeAfterwards) {
          $(this).removeAttr("data-markdown");
        }

      });

      if (foundMatches) { // only do anything to contents, if matches were found
        files[file].contents = new Buffer($.html());
      }

    });
  };
}

/**
 * Check if a `file` is html.
 *
 * @param {String} file
 * @return {Boolean}
 */

function isHtml(file) {
  return /\.html?/.test(extname(file));
}
