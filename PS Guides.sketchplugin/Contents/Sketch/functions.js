/*----------------------------------------------------------

author: Pratik Shah
Homepage: https://github.com/pratikjshah/PS-Guides
license: MIT

----------------------------------------------------------*/

@import "main.js"

function setGuides(selectedLayers) {

  // Load the window
  var window = createGuidesWindow(configData.guidesConfig.column, configData.guidesConfig.gutter, configData.guidesConfig.lOffset, configData.guidesConfig.rOffset);
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

    drawGuides(selectedLayers, column, gutter, lOffset, rOffset);

  }
}

function getLayerProps (selectedLayers) {
  var rect;
  var selectedCount = selectedLayers.count();
  if (selectedCount == 1) {
    var layer = selectedLayers.firstObject();
    rect = layer.absoluteRect();
    return {
      x: Math.round(rect.x()),
      y: Math.round(rect.y()),
      width: Math.round(rect.width()),
      height: Math.round(rect.height()),
      maxX: Math.round(rect.x() + rect.width()),
      maxY: Math.round(rect.y() + rect.height()),
    }
  }
}

function addVGuide(position) {
  var artBoardHRuler = artboard.horizontalRulerData();
  artBoardHRuler.addGuideWithValue(position);
}

function drawGuides(selectedLayers, column, gutter, lOffset, rOffset) {

  var selectedLayerProps = getLayerProps(selectedLayers);

  //globalContext.document.showMessage("Column: "+column+" | Gutter: "+gutter + " | Layer: "+JSON.stringify(selectedLayerProps));
  var columnWidth = Math.round((selectedLayerProps.width - lOffset - rOffset - Math.round((gutter*(column-1))))/column);
  var artboardX = artboard.frame().x();
  var startPosition = ((artboardX - selectedLayerProps.x)*-1) + lOffset;

  //globalContext.document.showMessage("columnWidth: "+columnWidth+" | startPosition: "+startPosition);

  var frameCenter = startPosition + Math.round(selectedLayerProps.width / 2);
  var gutterCount = column + 1;
  var spaceForColumn = selectedLayerProps.width - (gutterCount * gutter);
  var rulerCount = column*2 + 2;
  var drawGuideAt = frameCenter - Math.round(selectedLayerProps.width / 2) - gutter;
  var total = (columnWidth*column)+(gutter*(gutterCount-2));
  //globalContext.document.showMessage("Total: "+total+" | selection width: "+selectedLayerProps.width);

  if (total != parseInt(selectedLayerProps.width)) {
    var message = "It is not possible to divide selected width of "+selectedLayerProps.width+" into "+column+" equal columns and gutter of "+gutter;
    var confirmButtonText = "Change config";
    var cancelButtonText = "Draw anyway";
    //createErrorWindow(message,confirmButtonText,cancelButtonText);
    var errorWindow = createErrorWindow(message,confirmButtonText,cancelButtonText);
    var errorAlert = errorWindow[0];
    // When “Ok” is clicked
    var errorResponse = errorAlert.runModal();
    //log("errorResponse: "+errorResponse);
    //globalContext.showMessage("errorResponse: "+errorResponse);
    if (errorResponse == "1000") {
      addGuides(globalContext);
      return;
    } else if (errorResponse == "1001") {
      plotGuides(drawGuideAt,column,gutter,columnWidth,rulerCount,lOffset,rOffset);
    }
    return;
  }

  plotGuides(drawGuideAt,column,gutter,columnWidth,rulerCount,lOffset,rOffset);
}

function plotGuides(drawGuideAt,column,gutter,columnWidth,rulerCount,lOffset,rOffset) {
  // Clear old guides
  //removeAllGuides();
  //clearGuides(globalContext);
  removeVerticalGuides();
  removeHorizontalGuides();

  //addVGuide(drawGuideAt);
  for (var i=0; i < rulerCount; i++) {
    addVGuide(drawGuideAt);
    if ((i % 2) == 0) {
      drawGuideAt = drawGuideAt + gutter;
    } else {
      drawGuideAt = drawGuideAt + columnWidth
    }
  }

  configData.guidesConfig.column = column;
  configData.guidesConfig.gutter = gutter;
  configData.guidesConfig.lOffset = lOffset;
  configData.guidesConfig.rOffset = rOffset;
  saveData(configData);

  if (!globalContext.document.isRulersVisible()) {
    globalContext.document.toggleRulers();
  }
}

function removeHorizontalGuides() {
  var doc = globalContext.document;
  var page = doc.currentPage();
  var artBoard = page.currentArtboard();
  removeGuides(artBoard.horizontalRulerData());
}
function removeVerticalGuides() {
  var doc = globalContext.document;
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

function hasParentArtboard(layer) {
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

function showErrorAlertWithSound(msg) {
  var errorAlertFile = plugin.urlForResourceNamed("alert.mp3").path();
  var sound = NSSound.alloc().initWithContentsOfFile_byReference(errorAlertFile,true);
  sound.play();
  globalContext.document.showMessage(msg);
}

function isSelectionValid(selectedLayers) {
  //globalContext.document.showMessage("IN isSelectionValid");
  var selectedCount = selectedLayers.count();
  var msg = "";

  if (selectedCount <= 0) {
    msg = "Please select at least one element.";
    showErrorAlertWithSound(msg);
    return false;
  }

  var layer = selectedLayers.firstObject();
  var layerType = layer.className();
  var hasArtboard = hasParentArtboard(layer);

  if (hasArtboard < 0) {
    msg = "Soemthing is wrong";
    showErrorAlertWithSound(msg);
    return false;
  } else if (hasArtboard == 2) {
    msg = "Please select an element inside an Artboard.";
    showErrorAlertWithSound(msg);
    return false;
  } else if (isSelectionAllowed(layerType) < 0) {
    msg = "Currently "+layerType+" selection is not allowed.";
    showErrorAlertWithSound(msg);
    return false;
  } else if(selectedCount > 1) {
    msg = "Please select single layer";
    showErrorAlertWithSound(msg);
  }else {
    return true;
  }
}
