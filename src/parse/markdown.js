import {Youtube} from "../model"
import {Image} from "prosemirror/src/model"

Youtube.register("configureMarkdown", "video", parser => {
  return parser.use(require("./markdown-it"))
})


Youtube.register("parseMarkdown", "video", {
  parse: function (state, tok) {
    // state.addNode(this, { src: state.getAttr(tok, "src"),
      // title: state.getAttr(tok, "title") || null,
      // alt: tok.children[0] && tok.children[0].content || null });

    if (tok.service === "youtube"){
      state.addNode(this, { videoId: tok.videoID});
    } else {
      return false;
      // state.addNode(this, {src: state.getAttr(tok, "src"),
      //                      title: state.getAttr(tok, "title") || null,
      //                      alt: tok.children[0] && tok.children[0].content || null});
    }
  }
})
