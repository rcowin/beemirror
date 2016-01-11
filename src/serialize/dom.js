import {Youtube} from "../model"


Youtube.prototype.serializeDOM = (node, s) => {
  let img = s.elt("img", {src:"https://i.ytimg.com/vi/" + node.attrs.videoId + "/mqdefault.jpg" })
  let play = s.elt("div", {'class': "fa fa-youtube-play youtube-start"})
  let icon = s.elt("div", {'class': "fa fa-youtube youtube-icon"})
  let content = s.elt("div", {'class': "placeHolder"}, img, play, icon)
  return s.elt("div", {'class': "video-holder gened", 'data-video-id': node.attrs.videoId}, content)
}
