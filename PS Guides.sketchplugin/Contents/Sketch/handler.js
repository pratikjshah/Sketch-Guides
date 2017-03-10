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
  initPlugin(context);
  var selectedLayers = context.selection;

  if (isSelectionValid(context, selectedLayers)) {
    var layer = selectedLayers.firstObject();
    setGuides(context, layer);
  }
}

var addLastGuides = function(context) {
  initPlugin(context);
  var selectedLayers = context.selection;

  if (isSelectionValid(context, selectedLayers)) {
    var layer = selectedLayers.firstObject();
    drawGuides(context, layer, configData.guidesConfig.column, configData.guidesConfig.gutter, configData.guidesConfig.lOffset, configData.guidesConfig.rOffset);
  }
}

var clearGuides = function(context) {
  removeVerticalGuides(context);
  removeHorizontalGuides(context);
}
