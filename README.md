#metalsmith-data-markdown

> A [Metalsmith](http://metalsmith.io) plugin to use markdown content within html tags via `data-markdown` attribute

Parses markdown (via [marked](https://github.com/chjj/marked)) and inserts generated html in all tags that have the data-markdown attribute set (via [cheerio](https://github.com/cheeriojs/cheerio)).

Based on idea and code by [Paul Irish](https://gist.github.com/paulirish/1343518). His implementation is currently used in [reveal.js](https://github.com/hakimel/reveal.js), a presentation framework. Likewise, this metalsmith plugin might become handy, if you want to compile these presentations down to HTML(during generation time with metalsmith.  
Extracted from [majodev.github.io](http://majodev.github.io).

As part the my note *"[Extracting libs from a node.js project: Publishing my metalsmith plugins](http://ranf.tl/2014/10/01/extracting-libs-from-a-node-js-project/)"*.

## Installation

```bash
npm install --save metalsmith-data-markdown
```

## Usage

```javascript
var Metalsmith = require("metalsmith");
var datamarkdown = require("metalsmith-data-markdown");

Metalsmith(__dirname)
  // ... state when html files are available
  .use(datamarkdown())
  // ...
```

Should also work in similar fashion with the `metalsmith.json` counterpart.

## Options

`datamarkdown` accepts an hash to provide a few customization options.

### `marked` (optional)
`Object`: Options you want to hand over to [marked](https://github.com/chjj/marked#options-1). Will get invoked via `marked.setOptions(options.marked);`.
default: `undefined`

### `removeAttributeAfterwards` (optional)
`Boolean`: If `data-markdown` attributes should be removed from tags after they were processed.
default: `false`

## Full example with options set

Here's how this will work with some marked options set + full input and output.

### metalsmith config

```javascript
var Metalsmith = require("metalsmith");
var headingsidentifier = require("metalsmith-headingsidentifier");


Metalsmith(__dirname)
  // ... state when html files are available
  .use(datamarkdown({
    marked: {
      gfm: true,
      breaks: true,
      tables: true,
      smartLists: true,
      smartypants: true
    },
    removeAttributeAfterwards: true
  }))
  // ...
```

### html example input

```html
<!-- ... -->
<section>
<section id="paper-esecurity-cover" data-markdown>
### WLAN Security Revisited (paper)
#### Rogue AP, Deauthentication Attack and Portal via PwnSTAR in 2 Minutes
published on June 2012
<small>FH JOANNEUM information management master</small>
</section>
<section id="paper-esecurity-video" data-markdown>
<iframe width="640" height="480" src="//www.youtube.com/embed/vy4leX_twTw" frameborder="0"></iframe>
*"Creating a Rogue Access Point with redirecting web portal and hijacking open wifi users via de-authentication attack."*
</section>
</section>
<!-- ... -->
```

### html example output

```html

<section>
  <section id="paper-esecurity-cover">
    <h3>WLAN Security Revisited (paper)</h3>
    <h4>Rogue AP, Deauthentication Attack and Portal via PwnSTAR in 2 Minutes</h4>
    <p>published on June 2012<br><small>FH JOANNEUM information management master</small></p>
  </section>
  <section id="paper-esecurity-video">
    <p><iframe width="640" height="480" src="//www.youtube.com/embed/vy4leX_twTw" frameborder="0"></iframe><br><em>“Creating a Rogue Access Point with redirecting web portal and hijacking open wifi users via de-authentication attack.”</em></p>
  </section>
</section>

```

## Problems?
File an issue or fork 'n' fix and send a pull request.

## License
(c) 2014 Mario Ranftl  
[MIT License](majodev.mit-license.org)
