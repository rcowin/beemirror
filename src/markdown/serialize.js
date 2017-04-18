import {Youtube, Table, TableHead, TableBody, TableRow, TableH, TableD} from "../model"

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

export const beeSerializerNodes = {
  video(state, node){
    state.write(`\n@[${node.attrs.service}]` + "(" + state.esc(node.attrs.videoID) + ")\n")
  },
  table(state, node) {
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
  },
  table_head(state, node) {
    renderRows(state, node)
    renderHeadDelim(state, node)
  },
  table_body(state, node) {
    renderRows(state, node)
  },
  table_row(state, node) {
    renderCells(state, node)
  },
  table_cell(state, node) {
    const text = node.content.content[0];
    if (text)  state.renderInline(node);
  },
  // table_header_cell(state, node) {
  //   const text = node.content.content[0];
  //   if (text)  state.renderInline(node);
  // },
}

