
import { Schema, DOMParser } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'
import { addListNodes } from 'prosemirror-schema-list'
import { addTableNodes } from './model/beetable'
import { addVideoNodes } from './model/video'

import {
  schema, MarkdownParser, MarkdownSerializer,
  defaultMarkdownSerializer
} from './prosemirror-markdown'
const markdownit = require("markdown-it")
const videoMarkdown = require("./markdown-it/video");
import { beeTokens } from './markdown'
import { beeSerializerNodes } from "./markdown/serialize.js"

import { exampleSetup, buildMenuItems } from './setup'
import { MenuBarEditorView, MenuItem } from 'prosemirror-menu'
import { buildMarkdownCommandSpec } from './edit/commands'


let nodes = schema.nodeSpec;

nodes = addTableNodes(nodes, "text<_>*", "block");
nodes = addListNodes(nodes, "paragraph block*", "block");
nodes = addVideoNodes(nodes);

const beeSchema = new Schema({
  nodes: nodes,
  marks: schema.markSpec
})

let beeDOMParser = DOMParser.fromSchema(beeSchema);

let markdown = markdownit('default', { html: false }, beeTokens).use(videoMarkdown);
let beeMarkdownParser = new MarkdownParser(beeSchema, markdown, beeTokens);

let beeMdNodes = { ...defaultMarkdownSerializer.nodes, ...beeSerializerNodes };
let beeMdMarks = defaultMarkdownSerializer.marks;
let beeMarkdownSerializer = new MarkdownSerializer(beeMdNodes, beeMdMarks);

window.BeeMirror = function (attrs) {
  let content = attrs.doc;

  let state = EditorState.create({
    doc: ((typeof content === 'string') ? beeMarkdownParser.parse(content)
      : beeDOMParser.parse(document.querySelector("#content"))
    ),
    plugins: exampleSetup({ schema: beeSchema })
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

  this.view = view;

  this.focus = function(){}
  this.getMDContent = function(){
    return markdownCommandSpec.getMDContent();
  }
  this.lastAddedAt = function(){
    return !!view.editor.state.history$.prevTime
  }
}

window.unmarkdown = function(dom){
  let node = beeDOMParser.parse(dom);
  return beeMarkdownSerializer.serialize(node);
}
window.markdownit = markdownit('default', {}, beeTokens).use(videoMarkdown)
