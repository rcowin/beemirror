
var te = document.querySelector("#content");
te.style.display = "none";

var dummy = document.createElement("div");
dummy.innerHTML = te.value;
var doc = BeeMirror.fromDOM(dummy);

var DummyServer = function(){
  this.version = 0;
  this.pms = [];
};

  DummyServer.attach = function(pm) {
    pm.mod.collab.on("mustSend", function() {return this.mustSend(pm);});
    this.pms.push(pm);
  };

  DummyServer.mustSend = function(pm) {
    var toSend = pm.mod.collab.sendableSteps();
    this.send(pm, toSend.version, toSend.steps);
    pm.mod.collab.confirmSteps(toSend);
  };

  DummyServer.send = function(pm, version, steps) {
    this.version += steps.length;
    for (var i = 0; i < this.pms.length; i++)
      if (this.pms[i] != pm) this.pms[i].mod.collab.receive(steps);
  };


function makeEditor(where, collab) {
  return new BeeMirror({
    place: document.querySelector(where),
    autoInput: true,
    tooltipMenu: {selectedBlockMenu: true},
    menuBar: {float: true},
    doc: doc
    // collab: collab
  });
}

window.pm = window.pm2 = null
function createCollab() {
  var server = new DummyServer
  pm = makeEditor(".left", {version: server.version})
  server.attach(pm)
  pm2 = makeEditor(".right", {version: server.version})
  server.attach(pm2)
}

var collab = document.location.hash != "#single"
var button = document.querySelector("#switch")
function choose(collab) {
  if (pm) { pm.wrapper.parentNode.removeChild(pm.wrapper); pm = null }
  if (pm2) { pm2.wrapper.parentNode.removeChild(pm2.wrapper); pm2 = null }

  if (collab) {
    createCollab()
    button.textContent = "try single editor"
    document.location.hash = "#collab"
  } else {
    pm = makeEditor(".full", false)
    button.textContent = "try collaborative editor"
    document.location.hash = "#single"
  }
}
button.addEventListener("click", () => choose(collab = !collab))

// choose(null)

addEventListener("hashchange", function() {
  var newVal = document.location.hash != "#single";
  if (newVal != collab) choose(collab = newVal);
});

document.querySelector("#mark").addEventListener("mousedown", function(e) {
  pm.markRange(pm.selection.from, pm.selection.to, {className: "marked"});
  e.preventDefault();
});


/////

var place = document.querySelector("#editor");
var pmplace = document.querySelector("#content");

var getContent;

function addMDIcon(menu){
  //path d="M30 98v-68h20l20 25 20-25h20v68h-20v-39l-20 25-20-25v39zM155 98l-30-33h20v-35h20v35h20z

}

function toTextArea(content, focus) {
  var rep = document.querySelector(".ProseMirror-content");
  var menu = document.querySelector(".ProseMirror-menubar");

  rep.textContent = "";
  var te = rep.appendChild(BeeMirror.elt("textarea", {style: "font-family: inherit; font-size: inherit; margin: 0 0 0 -12px; border: 0;outline:0"}))

  var mdmenu = menu.appendChild(BeeMirror.elt("div", {'class': "ProseMirror-menubar-inner", style: "border: 0;height: 24px; background: rgba(250,250,250, .8);"}))
  addMDIcon(mdmenu);

  te.value = content;
  if (focus !== false) te.focus();
  getContent = function(){ return te.value; };

  document.body.scrollTop = 0;
  te.scrollTop = 0;
}
function toProseMirror(content, format) {
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
  pm.focus()
  addMDIcon(document.querySelector(".ProseMirror-menubar-inner"));
  getContent = () => pm.getContent("markdown");
}
// toTextArea(document.querySelector("#markdown_content").textContent, false)
toProseMirror(doc, null);

// getContent = () => pm.getContent("markdown")

function change() {
  var content = getContent()
  if (document.querySelector("#inputformat").checked) toTextArea(content)
  else toProseMirror(content, "markdown")
}
var radios = document.querySelectorAll("[name=inputformat]")
for (var i = 0; i < radios.length; i++) radios[i].addEventListener("change", change)
