var XUsePrototype = Object.create(SVGGraphicsElement.prototype);

XUsePrototype._updateHrefAttribute = function(reclone) {
  var href = this.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
  var hrefElement = document.querySelector(href);

  // FIXME: Need to prevent cycles.
  // FIXME: Need to disallow certain elements in the referenced subtree.

  if (this._targetElement != hrefElement) {
    // Clean up the old shadow tree and mutation observer.
    if (this._targetMutationObserver)
      this._targetMutationObserver.disconnect();
    if (this._targetElement) // Note: still the old target.
      this.shadowRoot.innerHTML = '';

    // Update our target.
    this._targetElement = hrefElement;
    reclone = true;

    // Hook up a shiny new observer to listen for target modifications.
    if (this._targetElement) {
      this._targetMutationObserver = new MutationObserver(function(mutations) {
        this._updateHrefAttribute(true);
      }.bind(this));
      this._targetMutationObserver.observe(this._targetElement, {
        attributes: true,
        childList: true,
        characterData: true
      });
    }
  }

  if (reclone && this._targetElement) {
    this._localTransformElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this._updateLocalTransform();
    this._localTransformElement.appendChild(this._targetElement.cloneNode(true));
    this.shadowRoot.appendChild(this._localTransformElement);
  }

  // FIXME: Need to add a global mutation observer to listen for cases when document.querySelector(#href)
  //        changes. For example, if a new element is added to the document before the old target and
  //        with the same id, we need to update the target to refer to the first element that matches #href.
};

// FIXME: Support the symbol and svg special cases in https://svgwg.org/svg2-draft/single-page.html#struct-UseElement
XUsePrototype._updateLocalTransform = function() {
  if (!this._localTransformElement)
    return;

  var x = this.getAttribute('x') || 0;
  var y = this.getAttribute('y') || 0;
  if (!x && !y) {
    this._localTransformElement.transform.baseVal.clear();
    return;
  }

  // FIXME: Implement this using the SVGMatrix/SVGTransformList API to avoid parsing.
  this._localTransformElement.setAttribute('transform', 'translate(' + x + ',' + y + ')');
};

XUsePrototype._updateWidthAttribute = function() {
  var width = this.getAttribute('width');
  if (!width)
    return;
  console.log('updating width: ' + width);
};

XUsePrototype._updateHeightAttribute = function() {
  var height = this.getAttribute('height');
  if (!height)
    return;
  console.log('updating height: ' + height);
};

XUsePrototype.createdCallback = function() {
  this.createShadowRoot();
  this._updateLocalTransform();
  this._updateHrefAttribute();
  this._updateWidthAttribute();
  this._updateHeightAttribute();
};

XUsePrototype.attributeChangedCallback = function(attributeName, oldValue, newValue) {
  switch (attributeName) {
    // FIXME: attributeChangedCallback doesn't support namespaces so we have to check for both xlink:href and href.
    case('xlink:href'): case('href'):
      this._updateHrefAttribute();
      break;
    case('x'):
    case('y'):
      this._updateLocalTransform();
      break;
    case('width'):
      this._updateWidthAttribute();
      break;
    case('height'):
      this._updateHeightAttribute();
      break;
  }
};

document.registerElement('x-use', {
  prototype: XUsePrototype,
  extends: 'g' // FIXME: This should not extend <g>, see crbug.com/330980.
});
