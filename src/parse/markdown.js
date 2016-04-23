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


Table.register("parseMarkdown", "table", {parse: "block"})
TableHead.register("parseMarkdown", "thead", {parse: "block"})
TableBody.register("parseMarkdown", "tbody", {parse: "block"})
TableRow.register("parseMarkdown", "tr", {parse: "block"})

//th_open token contains attrs: ["style", "text-align:center"]
TableH.register("parseMarkdown", "th", {parse: "block"})
TableD.register("parseMarkdown", "td", {parse: "block"})
