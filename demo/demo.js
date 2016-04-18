//get data
var te = document.querySelector("#content");
te.style.display = "none";

var format = "markdown";
var content = te.value;

// load model
var place = document.querySelector("#editor");

place.textContent = "";
pm = new BeeMirror({
  place: place,
  doc: te.value,
  docFormat: format,
  // tooltipMenu: true
  autoInput: true,
  tooltipMenu: {selectedBlockMenu: true},
  menuBar: {float: true}
});
pm.focus();
