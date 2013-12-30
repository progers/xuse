xuse
====

SVG &lt;use> implementation built on ShadowDOM

At the moment this repo is just a public playground to see if this idea could work.


### References

SVG2 spec: https://svgwg.org/svg2-draft/single-page.html

ShadowDOM spec primer: http://www.w3.org/TR/components-intro/#shadow-dom-section


### TODO

1. Need to flesh out the event model as there will be differences from SVG's instance tree.

### How to use xuse.js

I hope this will eventually be empty but we're early days and it's a massive pain in the ass right now.

1. You will need a custom build of Chromium with AuthorShadowDOMForAnyElement enabled. Check out Chromium and edit RuntimeEnabledFeatures.in:

   Change: "AuthorShadowDOMForAnyElement" to: "AuthorShadowDOMForAnyElement status=stable"

   Change: "ShadowDOM status=experimental" to "ShadowDOM status=stable"
   
   Then build chrome and content_shell.
1. Include xuse.js with &lt;script src="xuse.js">&lt;/script>
1. Change &lt;use ...> instances to &lt;g is="x-use" ...> (See crbug.com/330980)
