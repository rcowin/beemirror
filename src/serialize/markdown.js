import {Youtube} from "../model"

//![:youtube](AysWsbrtzMU)
Youtube.prototype.serializeMarkdown = (state, node) => {
  state.write("![:youtube]" + "(" + state.esc(node.attrs.videoId) + ")")
}
