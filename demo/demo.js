import {ProseMirror} from "prosemirror/src/edit/main"
import {Pos, Node, LinkStyle} from "prosemirror/src/model"

import {fromDOM} from "prosemirror/src/format"

// import {fromDOM} from "../src/dom"
// import {defaultSchema as schema} from "../src/model"
import "prosemirror/src/markdown"

import "../src/parse/dom"
import "../src/serialize/dom"
import "../src/parse/markdown"
import "../src/serialize/markdown"

import {beeSchema as schema} from "../src/model"

import "prosemirror/src/inputrules/autoinput"
import "prosemirror/src/menu/tooltipmenu"
import "prosemirror/src/menu/menubar"
import "prosemirror/src/collab"

import "prosemirror/src/menu/tooltipmenu"

import {elt} from "prosemirror/src/dom"


let te = document.querySelector("#content")
te.style.display = "none"

let dummy = document.createElement("div")
dummy.innerHTML = te.value
let doc = fromDOM(schema, dummy)

class DummyServer {
  constructor() {
    this.version = 0
    this.pms = []
  }

  attach(pm) {
    pm.mod.collab.on("mustSend", () => this.mustSend(pm))
    this.pms.push(pm)
  }

  mustSend(pm) {
    let toSend = pm.mod.collab.sendableSteps()
    this.send(pm, toSend.version, toSend.steps)
    pm.mod.collab.confirmSteps(toSend)
  }

  send(pm, version, steps) {
    this.version += steps.length
    for (let i = 0; i < this.pms.length; i++)
      if (this.pms[i] != pm) this.pms[i].mod.collab.receive(steps)
  }
}

function makeEditor(where, collab) {
  return new ProseMirror({
    place: document.querySelector(where),
    autoInput: true,
    tooltipMenu: {selectedBlockMenu: true},
    menuBar: {float: true},
    doc: doc,
    schema: schema
    // collab: collab
  })
}

window.pm = window.pm2 = null
function createCollab() {
  let server = new DummyServer
  pm = makeEditor(".left", {version: server.version})
  server.attach(pm)
  pm2 = makeEditor(".right", {version: server.version})
  server.attach(pm2)
}

let collab = document.location.hash != "#single"
let button = document.querySelector("#switch")
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

addEventListener("hashchange", () => {
  let newVal = document.location.hash != "#single"
  if (newVal != collab) choose(collab = newVal)
})

document.querySelector("#mark").addEventListener("mousedown", e => {
  pm.markRange(pm.selection.from, pm.selection.to, {className: "marked"})
  e.preventDefault()
})


/////

let place = document.querySelector("#editor")
let pmplace = document.querySelector("#content")

let getContent

function addMDIcon(menu){
  //path d="M30 98v-68h20l20 25 20-25h20v68h-20v-39l-20 25-20-25v39zM155 98l-30-33h20v-35h20v35h20z

}

function toTextArea(content, focus) {
  let rep = document.querySelector(".ProseMirror-content")
  let menu = document.querySelector(".ProseMirror-menubar");

  rep.textContent = ""
  let te = rep.appendChild(elt("textarea", {style: "font-family: inherit; font-size: inherit; margin: 0 0 0 -12px; border: 0;outline:0"}))

  let mdmenu = menu.appendChild(elt("div", {'class': "ProseMirror-menubar-inner", style: "border: 0;height: 24px; background: rgba(250,250,250, .8);"}))
  addMDIcon(mdmenu);

  te.value = content
  if (focus !== false) te.focus()
  getContent = () => te.value

  document.body.scrollTop = 0
  te.scrollTop = 0
}
function toProseMirror(content, format) {
  place.textContent = ""
  pm = new ProseMirror({
    place: place,
    doc: content,
    docFormat: format,
    // tooltipMenu: true
    autoInput: true,
    tooltipMenu: {selectedBlockMenu: true},
    menuBar: {float: true},
    schema: schema
  })
  pm.focus()
  addMDIcon(document.querySelector(".ProseMirror-menubar-inner"));
  getContent = () => pm.getContent("markdown")
}
// toTextArea(document.querySelector("#markdown_content").textContent, false)
toProseMirror(doc, null)

// getContent = () => pm.getContent("markdown")

function change() {
  let content = getContent()
  if (document.querySelector("#inputformat").checked) toTextArea(content)
  else toProseMirror(content, "markdown")
}
let radios = document.querySelectorAll("[name=inputformat]")
for (let i = 0; i < radios.length; i++) radios[i].addEventListener("change", change)
