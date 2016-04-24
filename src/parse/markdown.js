import {Youtube, Table, TableHead, TableBody, TableRow, TableH, TableD} from "../model"
import {Image} from "prosemirror/src/model"

Youtube.register("configureMarkdown", "video", parser => {
  return parser.use(require("./markdown-it"))
})

//table thead tr th td tbody (open/close)

Youtube.register("parseMarkdown", "video", {
  parse: function (state, tok) {
    if (tok.service === "youtube"){
      state.addNode(this, { videoId: tok.videoID});
    } else {
      return false;
    }
  }
})



Table.register("parseMarkdown", "table", {parse: "block", attrs: (state, tok) => {
  state.tableCellStyle = []
}})
TableHead.register("parseMarkdown", "thead", {parse: "block"})
TableBody.register("parseMarkdown", "tbody", {parse: "block"})
TableRow.register("parseMarkdown", "tr", {parse: "block", attrs: (state, tok) => {
  state.rowCellStyle = state.tableCellStyle.slice(0).reverse()
}})

//th_open token contains attrs: ["style", "text-align:center"]
TableH.register("parseMarkdown", "th", {parse: "block", attrs: (state, tok) => {
  var hStyles = state.getAttr(tok, "style") || ""
  state.tableCellStyle.push(hStyles)
  return {style: hStyles}
}})
TableD.register("parseMarkdown", "td", {parse: "block", attrs: (state, tok) => {
  var hStyles = state.rowCellStyle.pop() || "";
  return {style: hStyles}
}})
