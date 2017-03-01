const {Schema, DOMParser} = require("prosemirror-model")
const {EditorState} = require("prosemirror-state")
// const {insertPoint} = require("prosemirror-transform")
const {schema, MarkdownParser, defaultMarkdownSerializer} = require("./prosemirror-markdown")
const {beeTokens} = require("./markdown/index.js")

const {addListNodes} = require("prosemirror-schema-list")
const {addTableNodes} = require("./model/beetable")
const {MenuBarEditorView, MenuItem} = require("prosemirror-menu")

const markdownit = require("markdown-it")

const {exampleSetup, buildMenuItems} = require("./setup")
// const {InputRule, inputRules} = require("prosemirror-inputrules")
// import {MarkdownCommandSpec} from "../src/edit/commands"

// var menu = buildMenuItems(beeSchema)

window.BeeMirror = function(attrs){
  var content = attrs.doc;

  const beeSchema = new Schema({
    nodes: addListNodes(addTableNodes(schema.nodeSpec, "text*", "block"), "paragraph block*", "block"),
    marks: schema.markSpec
  })

  let beeMarkdownParser = new MarkdownParser(beeSchema,  markdownit('default', {html: false}), beeTokens);

  let state = EditorState.create({
    doc: (content ? beeMarkdownParser.parse(content)
          : DOMParser.fromSchema(beeSchema).parse(document.querySelector("#content"))
        ),
    plugins: exampleSetup({schema: beeSchema})
  })


  // let view = window.view = new MenuBarEditorView(document.querySelector(".full"), {
  //   state,
  //   onAction: action => view.updateState(view.editor.state.applyAction(action))
  // })

  let view = window.view = new MenuBarEditorView(attrs.place, {
    state,
    // onAction: action => view.updateState(view.editor.state.applyAction(action))
  })

  // view.editor.focus()
  // var getContent = function(){
  //   defaultMarkdownSerializer.serialize(view.editor.state.doc)
  // };
}

window.BeeMirror.prototype = {}//ProseMirror.prototype;
