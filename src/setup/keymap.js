const {wrapIn, setBlockType, chainCommands, newlineInCode, toggleMark} = require("prosemirror-commands")
const {selectNextCell, selectPreviousCell} = require("../model/beetable.js")
const {wrapInList, splitListItem, liftListItem, sinkListItem} = require("prosemirror-schema-list")
const {undo, redo} = require("prosemirror-history")

const mac = typeof navigator != "undefined" ? /Mac/.test(navigator.platform) : false

// :: (Schema, ?Object) → Object
// Inspect the given schema looking for marks and nodes from the
// basic schema, and if found, add key bindings related to them.
// This will add:
//
// * **Mod-KeyB** for toggling [strong](#schema-basic.StrongMark)
// * **Mod-KeyI** for toggling [emphasis](#schema-basic.EmMark)
// * **Mod-Backquote** for toggling [code font](#schema-basic.CodeMark)
// * **Ctrl-Shift-Digit0** for making the current textblock a paragraph
// * **Ctrl-Shift-Digit1** to **Ctrl-Shift-Digit6** for making the current
//   textblock a heading of the corresponding level
// * **Ctrl-Shift-Backslash** to make the current textblock a code block
// * **Ctrl-Shift-Digit8** to wrap the selection in an ordered list
// * **Ctrl-Shift-Digit9** to wrap the selection in a bullet list
// * **Ctrl-Shift-Period** to wrap the selection in a block quote
// * **Enter** to split a non-empty textblock in a list item while at
//   the same time splitting the list item
// * **Mod-Enter** to insert a hard break
// * **Mod-Shift-Minus** to insert a horizontal rule
//
// You can suppress or map these bindings by passing a `mapKeys`
// argument, which maps key names (say `"Mod-B"` to either `false`, to
// remove the binding, or a new key name string.
function buildKeymap(schema, mapKeys) {
  let keys = {}, type
  function bind(key, cmd) {
    if (mapKeys) {
      let mapped = mapKeys[key]
      if (mapped === false) return
      if (mapped) key = mapped
    }
    keys[key] = cmd
  }

  bind("Mod-Z", undo)
  bind("Mod-Y", redo)

  if (type = schema.marks.strong)
    bind("Mod-KeyB", toggleMark(type))
  if (type = schema.marks.em)
    bind("Mod-KeyI", toggleMark(type))
  if (type = schema.marks.code)
    bind("Mod-Backquote", toggleMark(type))

  if (type = schema.nodes.bullet_list)
    bind("Shift-Ctrl-Digit8", wrapInList(type))
  if (type = schema.nodes.ordered_list)
    bind("Shift-Ctrl-Digit9", wrapInList(type))
  if (type = schema.nodes.blockquote)
    bind("Shift-Ctrl-Period", wrapIn(type))
  if (type = schema.nodes.hard_break) {
    let br = type, cmd = chainCommands(newlineInCode, (state, onAction) => {
      onAction(state.tr.replaceSelection(br.create()).scrollAction())
      return true
    })
    bind("Mod-Enter", cmd)
    bind("Shift-Enter", cmd)
    if (mac) bind("Ctrl-Enter", cmd)
  }
  if (type = schema.nodes.list_item) {
    bind("Enter", splitListItem(type))
    bind("Mod-BracketLeft", liftListItem(type))
    bind("Mod-BracketRight", sinkListItem(type))
  }
  if (type = schema.nodes.paragraph)
    bind("Shift-Ctrl-Digit0", setBlockType(type))
  if (type = schema.nodes.code_block)
    bind("Shift-Ctrl-Backslash", setBlockType(type))
  if (type = schema.nodes.heading) for (let i = 1; i <= 6; i++)
    bind("Shift-Ctrl-Digit" + i, setBlockType(type, {level: i}))
  if (type = schema.nodes.horizontal_rule) {
    let hr = type
    bind("Mod-Shift-Minus", (state, onAction) => {
      onAction(state.tr.replaceSelection(hr.create()).scrollAction())
      return true
    })
  }

  if (schema.nodes.table_row) {
    bind("Tab", selectNextCell)
    bind("Shift-Tab", selectPreviousCell)
  }
  return keys
}
exports.buildKeymap = buildKeymap
