import {Youtube} from "../model"



const YoutubeImage = RegExp("i.ytimg.com\/(vi|sb|vi_webp)/([a-zA-Z0-9_-]{11})\/")

Youtube.register("parseDOM", {
  tag: "img",
  rank: 25,
  parse: function(dom, state) {
    let src = dom.getAttribute("src")
    let data = src.match(YoutubeImage)
    if (!data) return false;

    state.insert(this, {videoId: data[2]})
  } 
})
