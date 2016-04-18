//get data
var te = document.querySelector("#content");
te.style.display = "none";

var content = te.value;
var format = "markdown";

// load model
var place = document.querySelector("#editor");
place.textContent = "";

var pm = new BeeMirror({
  place: place,
  doc: te.value,
  docFormat: format,
  // tooltipMenu: true
  autoInput: true,
  tooltipMenu: {selectedBlockMenu: true},
  menuBar: {float: true}
});
pm.focus();
