import {ProseMirror} from "prosemirror/src/edit/main"
import {Pos, Node, LinkStyle} from "prosemirror/src/model"

import {fromDOM} from "prosemirror/src/format"

import {renderGrouped, inlineGroup, insertMenu, textblockMenu, blockGroup, historyGroup, MenuCommandGroup} from "prosemirror/src/menu/menu"

import {CommandSet} from "prosemirror/src/edit"


// import {fromDOM} from "../src/dom"
// import {defaultSchema as schema} from "../src/model"
import "prosemirror/src/markdown"

import "../src/parse/dom"
import "../src/serialize/dom"
import "../src/parse/markdown"
import "../src/serialize/markdown"

import {MarkdownCommandSpec} from "../src/edit/commands"

import {beeSchema as schema} from "../src/model"

import "prosemirror/src/inputrules/autoinput"
import "prosemirror/src/menu/tooltipmenu"
import "prosemirror/src/menu/menubar"
import "prosemirror/src/collab"

import "prosemirror/src/menu/tooltipmenu"

import {elt} from "prosemirror/src/dom"

export const markDownGroup = new MenuCommandGroup("markdown")

const defaultMenu = [
  inlineGroup,
  insertMenu,
  [textblockMenu, blockGroup],
  historyGroup,
  markDownGroup
]

const beeCommands = CommandSet.default.update({
    markdown: MarkdownCommandSpec
})

window.BeeMirror = function(attrs){
  attrs.schema = schema;
  attrs.menuBar.content = defaultMenu;
  attrs.commands = beeCommands;
  ProseMirror.apply(this, [attrs]);
};
window.BeeMirror.prototype = ProseMirror.prototype;

window.BeeMirror.fromDOM = function(node){return fromDOM(schema, node);};

window.BeeMirror.prototype.getMDContent = function(format){
  if (format === "markdown" && this.isBeeMarkDown)
    return this.beeTextArea.value;
  else
    return this.getContent(format || "markdown");
};

window.BeeMirror.elt = elt;
