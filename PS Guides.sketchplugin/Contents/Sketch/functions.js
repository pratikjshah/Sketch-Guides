/*----------------------------------------------------------

author: Pratik Shah
Homepage: https://github.com/pratikjshah/PS-Guides
license: MIT

----------------------------------------------------------*/

@import "main.js"

function setGuides(context, layer) {
  // Get all the things
  initPlugin(context);

  // Load the window
  var window = createGuidesWindow(12,16,0,0);
  var alert = window[0];

  // When “Ok” is clicked
  var response = alert.runModal();
  if (response == "1000") {

    // Get the user’s values
    // The replace strips any non-numeric (and non-slash for radius) characters
    // e.g. `px`
    var column = parseInt(columnTextfield.stringValue().replace(/[^0-9.,]/g, ''));
    var gutter = parseInt(gutterTextfield.stringValue().replace(/[^0-9.,]/g, ''));
    var lOffset = parseInt(lOffsetTextfield.stringValue().replace(/[^0-9.,]/g, ''));
    var rOffset = parseInt(rOffsetTextfield.stringValue().replace(/[^0-9.,]/g, ''));

    // Clear old guides
    clearGuides(context);
/*
    if((column > 0) && (gutter > 0) && (lOffset >= 0) && (rOffset >= 0)) {
      //context.document.showMessage("Please provide valid inputs");
      context.document.showMessage("column: "+ column+"gutter: "+ gutter+"lOffset: "+ lOffset+"rOffset: "+ rOffset);
      return;
    }
*/
    var layerProps = getLayerProps(layer);

    //context.document.showMessage("Column: "+column+" | Gutter: "+gutter + " | Layer: "+JSON.stringify(layerProps));
    var columnWidth = Math.round((layerProps.width - lOffset - rOffset - Math.round((gutter*(column-1))))/column);
    var artboardX = artboard.frame().x();
    var startPosition = ((artboardX - layerProps.x)*-1) + lOffset;

    //context.document.showMessage("columnWidth: "+columnWidth+" | startPosition: "+startPosition);

    var frameCenter = startPosition + Math.round(layerProps.width / 2);
    var gutterCount = column + 1;
    var spaceForColumn = layerProps.width - (gutterCount * gutter);
    var rulerCount = column*2 + 2;
    var drawGuideAt = frameCenter - Math.round(layerProps.width / 2) - gutter;
    var total = (columnWidth*column)+(gutter*(gutterCount-2));
    //context.document.showMessage("Total: "+total+" | selection width: "+layerProps.width);

    if (total > parseInt(layerProps.width)) {
      var message = "It is not possible to divide selected width of "+layerProps.width+" into "+column+" equal columns and gutter of "+gutter;
      var confirmButtonText = "Change config";
      var cancelButtonText = "Cancel";
      //createErrorWindow(message,confirmButtonText,cancelButtonText);
      var errorWindow = createErrorWindow(message,confirmButtonText,cancelButtonText);
      var errorAlert = errorWindow[0];
      // When “Ok” is clicked
      var errorResponse = errorAlert.runModal();
      if (errorResponse == "1000") {
        addGuides(context);
        return;
      }
      return;
    }

    //addVGuide(drawGuideAt);
    for (var i=0; i < rulerCount; i++) {
      addVGuide(drawGuideAt);
      if ((i % 2) == 0) {
        drawGuideAt = drawGuideAt + gutter;
      } else {
        drawGuideAt = drawGuideAt + columnWidth
      }
    }
  }
}

function getLayerProps (layer) {
  var rect = layer.absoluteRect();
  return {
    x: Math.round(rect.x()),
    y: Math.round(rect.y()),
    width: Math.round(rect.width()),
    height: Math.round(rect.height()),
    maxX: Math.round(rect.x() + rect.width()),
    maxY: Math.round(rect.y() + rect.height()),
  }
}

function addVGuide(position) {
  var artBoardHRuler = artboard.horizontalRulerData();
  artBoardHRuler.addGuideWithValue(position);
}

function removeAllGuides(context) {
  removeHorizontalGuides(context);
  removeVerticalGuides(context);
}
function removeHorizontalGuides(context) {
  var doc = context.document;
  var page = doc.currentPage();
  var artBoard = page.currentArtboard();
  removeGuides(artBoard.horizontalRulerData());
}
function removeVerticalGuides(context) {
  var doc = context.document;
  var page = doc.currentPage();
  var artBoard = page.currentArtboard();
  removeGuides(artBoard.verticalRulerData());
}
function removeGuides(guideData) {
  while (guideData.numberOfGuides() > 0) {
    guideData.removeGuideAtIndex(0);
  }
}

function isSelectionAllowed(selectionType) {
  var allowedTypes = ["MSShapeGroup", "MSTextLayer", "MSLayerGroup", "MSArtboardGroup", "MSBitmapLayer", "MSSliceLayer", "MSSymbolInstance"];
  //var index = allowedTypes.indexOf(selectionType);
  //return index;

  for (var j=0; j<allowedTypes.length; j++) {
        if (allowedTypes[j].match(selectionType)) return j;
    }
  return -1
}

function isValidInput(data) {
  if (data === parseInt(data, 10) && data > 0) {
  //if (data >= 0) {
    return 1;
  }
  return 0;
}

function hasParentArtboard(context, layer) {
  // Check if any layers were passed in to the function
  if (layer == undefined) {
		return -1;
	}

  var currentLayer = layer;

  while (true) {
    var className = currentLayer.className();
    if (className == 'MSPage') {
      //If it's an MSPage, then there was no artboard selected to begin with
      return 2;
    } else if (className == 'MSArtboardGroup') {
      //If it's an MSArtboardGroup, we've found it and we can just return the currentLayer.
      return 1;
    } else {
      //Otherwise, we're still nested deep inside an artboard
      currentLayer = currentLayer.parentGroup();
    }
  }
  return -2;
}
