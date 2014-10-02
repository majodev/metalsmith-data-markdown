var marked = require("marked");
var cheerio = require('cheerio');
var extname = require('path').extname;
var he = require("he");

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
  marked.setOptions(options);

  return function(files, metalsmith, done) {
    setImmediate(done);
    Object.keys(files).forEach(function(file) {
      if (!isHtml(file)) return;
      var data = files[file];
      var foundMatches = false;

      var $ = cheerio.load(data.contents.toString());

      $("[data-markdown]").each(function(index) {
        // grab the html of the node and 
        // decode all html entities (as marked doesn't have to know about them)
        // decoding fixes problems with smartypants
        var markedText = marked(he.decode($(this).html())); 
        //console.log(markedText);
        $(this).html(markedText);
        foundMatches = true;
      });

      if (foundMatches) { // only do anything to contents, if matches were found
        files[file].contents = $.html();
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