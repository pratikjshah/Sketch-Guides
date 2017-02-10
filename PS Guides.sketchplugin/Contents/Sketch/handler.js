/*----------------------------------------------------------

author: Pratik Shah
Homepage: https://github.com/pratikjshah/PS-Guides
license: MIT

----------------------------------------------------------*/

@import 'main.js'
@import 'functions.js'

var commandInit = function(context) {
  // Get all the things
  context.document.showMessage("Inside commandInit");
  initPlugin(context);
}

var addGuides = function(context) {
  var selectedLayers = context.selection;
  var selectedCount = selectedLayers.count();

  if (selectedCount <= 0) {
    context.document.showMessage("Please select at least one element.");
    return;
  }

  var layer = selectedLayers.firstObject();
  var layerType = layer.className();
  var hasArtboard = hasParentArtboard(context,layer);

  //document.showMessage("layoutSettings: "+context.document.layoutSettings());
  //context.document.showMessage("hasArtboard: "+hasArtboard);

  if (hasArtboard < 0) {
    context.document.showMessage("Soemthing is wrong");
    return;
  } else if (hasArtboard == 2) {
    context.document.showMessage("Please select an element inside an Artboard.");
    return;
  } else if (isSelectionAllowed(layerType) < 0) {
    context.document.showMessage("Currently "+layerType+" selection is not allowed.");
    return;
  } else if (selectedCount >= 2) {
    context.document.showMessage("Please select single layer.");
    return;
  } else {
    setGuides(context, layer);
  }
}

var clearGuides = function(context) {
  removeVerticalGuides(context);
  removeHorizontalGuides(context);
}
