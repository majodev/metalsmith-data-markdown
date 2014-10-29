var path = require('path');
var expect = require('chai').expect;
var Metalsmith = require('metalsmith');
var equal = require('assert-dir-equal');

var dataMarkdown = require('..');

describe('metalsmith-data-markdown', function() {
  it('should convert everything inside data-markdown attr', function(done) {
    Metalsmith('spec/fixture')
      .use(dataMarkdown({
        marked: {
          gfm: true,
          breaks: true,
          tables: true,
          smartLists: true,
          smartypants: true
        },
        removeAttributeAfterwards: true
      }))
      .build(function(err) {
        if (err) return done(err);
        equal('spec/fixture/expected', 'spec/fixture/build');
        done();
      });
  });
});