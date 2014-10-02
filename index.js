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

  var removeAttributeAfterwards = false;

  if(_.isUndefined(options) === false) {
    if( _.isUndefined(options.marked) === false) {
      marked.setOptions(options.marked);
    }
    if( _.isUndefined(options.removeAttributeAfterwards) === false) {
      removeAttributeAfterwards = options.removeAttributeAfterwards;
    }
  }

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
        
        if(removeAttributeAfterwards) {
          $(this).removeAttr("data-markdown");
        }
        
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