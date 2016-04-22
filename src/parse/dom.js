import {Youtube} from "../model"



const YoutubeImage = RegExp("i.ytimg.com\/(vi|sb|vi_webp)/([a-zA-Z0-9_-]{11})\/")
const YoutubeEmbed = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;

Youtube.register("parseDOM", 'img', {
  parse: function(dom, state) {
    let src = dom.getAttribute("src")
    let data = src.match(YoutubeImage) || src.match(YoutubeEmbed)
    if (!data) return false;

    state.insert(this, {videoId: data[2]})
  }
})
