import {Schema, DOMParser} from 'prosemirror-model'
import {EditorState} from 'prosemirror-state'
import {schema, MarkdownParser, MarkdownSerializer, 
        defaultMarkdownSerializer} from './prosemirror-markdown'
const {beeTokens} = require("./markdown")

const {addListNodes} = require("prosemirror-schema-list")
const {addTableNodes} = require("./model/beetable")
const {addVideoNodes} = require("./model/video")

const {MenuBarEditorView, MenuItem} = require("prosemirror-menu")

const markdownit = require("markdown-it")
const videoMarkdown = require("./markdown-it/video");

const {exampleSetup, buildMenuItems} = require("./setup")
import {buildMarkdownCommandSpec} from "./edit/commands"

import { beeSerializerNodes } from "./markdown/serialize.js"


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

  let markdown = markdownit('default', {html: false}, beeTokens).use(videoMarkdown);
  let beeMarkdownParser = new MarkdownParser(beeSchema,  markdown, beeTokens);

  
  let beeMdNodes = {...defaultMarkdownSerializer.nodes, ...beeSerializerNodes};
  let beeMdMarks = defaultMarkdownSerializer.marks;
  let beeMarkdownSerializer = new MarkdownSerializer(beeMdNodes, beeMdMarks);
  
  let state = EditorState.create({
    doc: (content ? beeMarkdownParser.parse(content)
          : DOMParser.fromSchema(beeSchema).parse(document.querySelector("#content"))
        ),
    plugins: exampleSetup({schema: beeSchema})
  })


let markdownCommandSpec = buildMarkdownCommandSpec(beeMarkdownParser, beeMarkdownSerializer);

let menu = buildMenuItems(beeSchema)
menu.markdown = new MenuItem(markdownCommandSpec);
menu.fullMenu = menu.fullMenu.concat([[menu.markdown]])


  let view = window.view = new MenuBarEditorView(attrs.place, {
    state,
    menuContent: menu.fullMenu

    // onAction: action => view.updateState(view.editor.state.applyAction(action))
  })


}

//window.markdownit = markdown;
window.markdownit = markdownit('default', {}, beeTokens).use(videoMarkdown)

window.BeeMirror.prototype.focus = function(){};
window.BeeMirror.prototype.getMDContent = function(){
  return beeMarkdownSerializer.serialize()
}
// window.BeeMirror.prototype = {}//ProseMirror.prototype;
