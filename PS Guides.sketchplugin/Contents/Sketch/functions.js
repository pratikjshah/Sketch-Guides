@import "main.js"

function setGuides(context, layer) {
  // Get all the things
  initPlugin(context);

  // Load the window
  var window = createGuidesWindow(12,16,0,0);
  var alert = window[0];

  // When “Ok” is clicked
  var response = alert.runModal()
  if (response == "1000") {

    // Clear old guides
    clearGuides(context);
    
    // Get the user’s values
    // The replace strips any non-numeric (and non-slash for radius) characters
    // e.g. `px`
    var column = parseInt(columnTextfield.stringValue().replace(/[^0-9.,]/g, ''));
    var gutter = parseInt(gutterTextfield.stringValue().replace(/[^0-9.,]/g, ''));
    var lOffset = parseInt(lOffsetTextfield.stringValue().replace(/[^0-9.,]/g, ''));
    var rOffset = parseInt(rOffsetTextfield.stringValue().replace(/[^0-9.,]/g, ''));

    //context.document.showMessage("Column: "+column+" | Gutter: "+gutter + " | Layer: "+JSON.stringify(layerProps));

    var layerProps = getLayerProps(layer);
    var columnWidth = Math.round((layerProps.width - lOffset - rOffset - Math.round((gutter*(column-1))))/column);
    var startPosition = lOffset + layerProps.x;

    //context.document.showMessage("columnWidth: "+columnWidth+" | startPosition: "+startPosition);
    addVGuide(startPosition);

    for (var i =0; i< column; i++) {
      startPosition = startPosition + columnWidth;
      addVGuide(startPosition);
      if (i < column-1) {
        startPosition = startPosition + gutter;
        addVGuide(startPosition);
      }
    }
  }
}

function getLayerProps (layer) {
  var rect = layer.absoluteRect();
  return {
    x: Math.round(layer.frame().x()),
    y: Math.round(layer.frame().y()),
    width: Math.round(rect.width()),
    height: Math.round(rect.height()),
    maxX: Math.round(layer.frame().x() + rect.width()),
    maxY: Math.round(layer.frame().y() + rect.height()),
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
