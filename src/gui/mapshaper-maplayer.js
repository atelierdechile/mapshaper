/* @requires elements, mapshaper-canvas */


// Layer group...
//
function ArcLayerGroup(src) {
  var _self = this;
  var _surface = new CanvasLayer();

  var _arcLyr = new ShapeLayer(src.getArcs(), _surface),
      _layers = [_arcLyr],
      _map;

  var _visible = true;
  this.visible = function(b) {
    return arguments.length == 0 ? _visible : _visible = !b, this;
  };

  this.refresh = function() {
    if (_map && _map.isReady()) {
      drawLayers();
    }
  };

  this.setMap = function(map) {
    _map = map;
    _surface.getElement().appendTo(map.getElement());
    map.on('display', drawLayers, this);
    map.getExtent().on('change', drawLayers, this);
  };

  function drawLayers() {
    if (!_self.visible()) return;
    var ext = _map.getExtent();
    _surface.prepare(ext.width(), ext.height());

    Utils.forEach(_layers, function(lyr) {
      T.start();
      lyr.draw(ext); // visibility handled by layer
      T.stop("draw");
    });
  }
}


function ShapeLayer(src, surface) {
  var renderer = new ShapeRenderer();
  var _visible = true;
  var style = {
    strokeWidth: 1,
    strokeColor: "#0000CC",
    strokeAlpha: 1
  };

  this.visible = function(b) {
    return arguments.length == 0 ? _visible : _visible = !b, this;
  };

  this.draw = function(ext) {
    if (!this.visible()) return;
    var tr = ext.getTransform();
    src.boundsFilter(ext.getBounds()).scaleFilter(tr.mx);
    renderer.drawShapes(src, style, tr, surface.getContext());
  }
}

Opts.inherit(ShapeLayer, Waiter);

