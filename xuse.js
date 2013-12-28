var XUsePrototype = Object.create(SVGGraphicsElement.prototype);

XUsePrototype._updateHrefAttribute = function(forceReclone) {
  var href = this.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
  if (!href)
    return;
  var hrefElement = document.querySelector(href);
  if (forceReclone || this._targetElement != hrefElement) {
    this._targetElement = hrefElement;
    this.shadowRoot.appendChild(hrefElement.cloneNode(true));
  }
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
    case('xlink:href'):
    case('href'):
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