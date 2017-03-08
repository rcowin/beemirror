const {Schema, DOMParser} = require("prosemirror-model")
const {EditorState} = require("prosemirror-state")
// const {insertPoint} = require("prosemirror-transform")
const {schema, MarkdownParser, defaultMarkdownSerializer} = require("./prosemirror-markdown")
const {beeTokens} = require("./markdown/index.js")

const {addListNodes} = require("prosemirror-schema-list")
const {addTableNodes} = require("./model/beetable")
const {addVideoNodes} = require("./model/video")

const {MenuBarEditorView, MenuItem} = require("prosemirror-menu")

const markdownit = require("markdown-it")
// const videoMarkdown = require("./parse/markdown-it");
const videoMarkdown = require("markdown-it-video");

const {exampleSetup, buildMenuItems} = require("./setup")
// const {InputRule, inputRules} = require("prosemirror-inputrules")
import {MarkdownCommandSpec} from "../src/edit/commands"

// var menu = buildMenuItems(beeSchema)

window.BeeMirror = function(attrs){
  let content = attrs.doc;

  let nodes = schema.nodeSpec;
  
  nodes = addTableNodes(nodes, "text*", "block");
  nodes = addListNodes(nodes, "paragraph block*", "block");
  nodes = addVideoNodes(nodes);

  const beeSchema = new Schema({
    nodes: nodes,
    marks: schema.markSpec
  })

  let beeMarkdownParser = new MarkdownParser(beeSchema,  markdownit('default', {html: false}, beeTokens).use(videoMarkdown), beeTokens);

  let state = EditorState.create({
    doc: (content ? beeMarkdownParser.parse(content)
          : DOMParser.fromSchema(beeSchema).parse(document.querySelector("#content"))
        ),
    plugins: exampleSetup({schema: beeSchema})
  })



let menu = buildMenuItems(beeSchema)
menu.markdown = new MenuItem(MarkdownCommandSpec);
// menu.inlineMenu = menu.inlineMenu.concat(menu.markdown)
menu.fullMenu = menu.fullMenu.concat([[menu.markdown]])

// ({
//     markdown: MarkdownCommandSpec
// })
// menu.insertMenu.content = dinos.map(name => new MenuItem({
//   title: "Insert " + name,
//   label: name.charAt(0).toUpperCase() + name.slice(1),
//   select(state) {
//     return insertPoint(state.doc, state.selection.from, dinoType) != null
//   },
//   run(state, dispatch) { dispatch(state.tr.replaceSelectionWith(dinoType.create({type: name}))) }
// })).concat(menu.insertMenu.content)

  // let view = window.view = new MenuBarEditorView(document.querySelector(".full"), {
  //   state,
  //   onAction: action => view.updateState(view.editor.state.applyAction(action))
  // })

  let view = window.view = new MenuBarEditorView(attrs.place, {
    state,
    menuContent: menu.fullMenu

    // onAction: action => view.updateState(view.editor.state.applyAction(action))
  })

  // view.editor.focus()
  // var getContent = function(){
  //   defaultMarkdownSerializer.serialize(view.editor.state.doc)
  // };
}

window.BeeMirror.prototype = {}//ProseMirror.prototype;
