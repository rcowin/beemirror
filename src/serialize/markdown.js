import {Youtube, Table, TableHead, TableBody, TableRow, TableH, TableD} from "../model"

//![:youtube](AysWsbrtzMU)
Youtube.prototype.serializeMarkdown = (state, node) => {
  state.write("@[youtube]" + "(" + state.esc(node.attrs.videoId) + ")")
}


function renderCells(state, node) {
  if (state.closed && state.closed.type == node.type)
    state.flushClose(3)

  state.write("|")
  for (let i = 0; i < node.childCount; i++) {
    state.write(" ")
    state.render(node.child(i));
    state.write(" |")
  }
}

function renderRows(state, node) {
  if (state.closed && state.closed.type == node.type)
    state.flushClose(3)

  for (let i = 0; i < node.childCount; i++) {
    state.write("\n")
    state.render(node.child(i));
  }
}


Table.prototype.serializeMarkdown = (state, node) => {
  state.render(node.child(0));
  state.write("\n")
  state.write("---------------")
  state.render(node.child(1));
  state.write("\n")
}

TableHead.prototype.serializeMarkdown = (state, node) => {
  renderRows(state, node)
}

TableBody.prototype.serializeMarkdown = (state, node) => {
  renderRows(state, node)
}

TableRow.prototype.serializeMarkdown = (state, node) => {
  renderCells(state, node)
}

TableH.prototype.serializeMarkdown = (state, node) => {
  state.render(node.child(0));

}
TableD.prototype.serializeMarkdown = (state, node) => {
  state.render(node.child(0));

}
