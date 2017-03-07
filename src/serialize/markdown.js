import {Youtube, Table, TableHead, TableBody, TableRow, TableH, TableD} from "../model"

//![:youtube](AysWsbrtzMU)
Youtube.prototype.serializeMarkdown = (state, node) => {
  state.write("@[youtube]" + "(" + state.esc(node.attrs.videoID) + ")")
}

function renderBlankCells(state, node){
  var tr = node.child(0);
  state.write("|")
  for (let i = 0; i < node.childCount; i++) {
    state.write(" ")
    state.write(" |")
  }
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

function renderHeadDelim(state, node){
  var tr = node.child(0);
  state.write("\n|")

  for (let i = 0; i < tr.childCount; i++) {
    let th = tr.child(i)
    if (th.attrs){
      if (th.attrs.style === 'text-align:center'){
        state.write(" :---: |")
      } else if (th.attrs.style === 'text-align:left'){
        state.write(" :--- |")
      } else if (th.attrs.style === 'text-align:right'){
        state.write(" ---: |")
      } else
        state.write(" --- |")
    } else
      state.write(" --- |")
  }
}

Table.prototype.serializeMarkdown = (state, node) => {
  if (node.childCount > 1){
    state.render(node.child(0));
    state.render(node.child(1));
  } else {
    renderBlankCells(state, node.child(0))
    renderHeadDelim(state, node.child(0))

    state.render(node.child(0));
  }

  state.write("\n")
  state.write("\n")
}

TableHead.prototype.serializeMarkdown = (state, node) => {
  renderRows(state, node)
  renderHeadDelim(state, node)
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
