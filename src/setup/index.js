const {blockQuoteRule, orderedListRule, bulletListRule, codeBlockRule, headingRule,
       inputRules, allInputRules} = require("prosemirror-inputrules")
const {keymap} = require("prosemirror-keymap")
const {history} = require("prosemirror-history")
const {baseKeymap} = require("prosemirror-commands")
const {Plugin} = require("prosemirror-state")
const {dropCursor} = require("prosemirror-dropcursor")

const {buildMenuItems} = require("./menu")
exports.buildMenuItems = buildMenuItems
const {buildKeymap} = require("./keymap")
exports.buildKeymap = buildKeymap

// !! This module exports helper functions for deriving a set of basic
// menu items, input rules, or key bindings from a schema. These
// values need to know about the schema for two reasons—they need
// access to specific instances of node and mark types, and they need
// to know which of the node and mark types that they know about are
// actually present in the schema.
//
// The `exampleSetup` plugin ties these together into a plugin that
// will automatically enable this basic functionality in an editor.

// :: (Object) → [Plugin]
// A convenience plugin that bundles together a simple menu with basic
// key bindings, input rules, and styling for the example schema.
// Probably only useful for quickly setting up a passable
// editor—you'll need more control over your settings in most
// real-world situations.
//
//   options::- The following options are recognized:
//
//     schema:: Schema
//     The schema to generate key bindings and menu items for.
//
//     mapKeys:: ?Object
//     Can be used to [adjust](#example-setup.buildKeymap) the key bindings created.
function exampleSetup(options) {
  let plugins = [
    inputRules({rules: allInputRules.concat(buildInputRules(options.schema))}),
    keymap(buildKeymap(options.schema, options.mapKeys)),
    keymap(baseKeymap),
    dropCursor()
  ]
  if (options.history !== false) plugins.push(history())

  return plugins.concat(new Plugin({
    props: {
      attributes: {class: "ProseMirror-example-setup-style"},
      menuContent: buildMenuItems(options.schema).fullMenu,
      floatingMenu: true
    }
  }))
}
exports.exampleSetup = exampleSetup

// :: (Schema) → [InputRule]
// A set of input rules for creating the basic block quotes, lists,
// code blocks, and heading.
function buildInputRules(schema) {
  let result = [], type
  if (type = schema.nodes.blockquote) result.push(blockQuoteRule(type))
  if (type = schema.nodes.ordered_list) result.push(orderedListRule(type))
  if (type = schema.nodes.bullet_list) result.push(bulletListRule(type))
  if (type = schema.nodes.code_block) result.push(codeBlockRule(type))
  if (type = schema.nodes.heading) result.push(headingRule(type, 6))
  return result
}
exports.buildInputRules = buildInputRules
