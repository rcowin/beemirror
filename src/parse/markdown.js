import {Youtube} from "../model"

Youtube.register("parseMarkdown", {
  token: "image",
  rank: 25,
  parse: function (state, tok) {
    if (tok.children[0].content !== ":youtube") return false;

    state.addNode(this, { videoId: state.getAttr(tok, "src") })
  }
})
