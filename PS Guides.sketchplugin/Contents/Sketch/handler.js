/*----------------------------------------------------------

author: Pratik Shah
Homepage: https://github.com/pratikjshah/PS-Guides
license: MIT

----------------------------------------------------------*/

@import 'main.js'
@import 'functions.js'

var commandInit = function(context) {
  // Get all the things
  // context.document.showMessage("Inside commandInit");
  // initPlugin(context);
}

var addGuides = function(context) {
  initPlugin(context);
  var selectedLayers = context.selection;

  if (isSelectionValid(selectedLayers)) {
    //var layer = selectedLayers.firstObject();
    setGuides(selectedLayers);
    trackEvent("DrawGuides", "addGuides", 1);
  }
}

var addLastGuides = function(context) {
  initPlugin(context);
  var selectedLayers = context.selection;

  if (isSelectionValid(selectedLayers)) {
    //var layer = selectedLayers.firstObject();
    drawGuides(selectedLayers, configData.guidesConfig.column, configData.guidesConfig.gutter, configData.guidesConfig.lOffset, configData.guidesConfig.rOffset);
    trackEvent("DrawGuides", "addLastGuides", 1);
  }
}

var clearGuides = function(context) {
  initPlugin(context);
  removeVerticalGuides();
  removeHorizontalGuides();
  trackEvent("ClearGuides", "bothGuides", 1);
}
