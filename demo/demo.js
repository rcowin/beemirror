
var te = document.querySelector("#content");
te.style.display = "none";

var dummy = document.createElement("div");
dummy.innerHTML = te.value;
var doc = BeeMirror.fromDOM(dummy);

window.pm = null;

var place = document.querySelector("#editor");

var format = null;
var content = doc;
place.textContent = "";
pm = new BeeMirror({
  place: place,
  doc: content,
  docFormat: format,
  // tooltipMenu: true
  autoInput: true,
  tooltipMenu: {selectedBlockMenu: true},
  menuBar: {float: true}
});
pm.focus();
