var XUsePrototype = Object.create(SVGGraphicsElement.prototype);

XUsePrototype._updateHrefAttribute = function(reclone) {
  var href = this.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
  var hrefElement = document.querySelector(href);

  if (this._targetElement != hrefElement) {
    // Clean up the old shadow tree and mutation observer.
    if (this._targetMutationObserver)
      this._targetMutationObserver.disconnect();
    if (this._targetElement)
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

  if (reclone && this._targetElement)
    this.shadowRoot.appendChild(this._targetElement.cloneNode(true));

  // FIXME: Need to add a global mutation observer to listen for cases when document.querySelector(#href)
  //        changes. For example, if a new element is added to the document before the old target and
  //        with the same id, we need to update the target to refer to the first element that matches #href.
};

XUsePrototype._updateXAttribute = function() {
  var x = this.getAttribute('x');
  if (!x)
    return;
  console.log('updating x: ' + x);
};

XUsePrototype._updateYAttribute = function() {
  var y = this.getAttribute('y');
  if (!y)
    return;
  console.log('updating y: ' + y);
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
  this._updateHrefAttribute();
  this._updateXAttribute();
  this._updateYAttribute();
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
      this._updateXAttribute();
      break;
    case('y'):
      this._updateYAttribute();
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
  extends: 'g' // FIXME: for testing only. This should be 'use'.
});