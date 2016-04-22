import {Youtube} from "../model"


Youtube.prototype.serializeDOM = (node, s) => {
  let img = s.elt("img", {src:"https://i.ytimg.com/vi/" + node.attrs.videoId + "/mqdefault.jpg" })
  let play = s.elt("div", {'class': "fa fa-youtube-play youtube-start"})
  let icon = s.elt("div", {'class': "fa fa-youtube youtube-icon"})
  let content = s.elt("div", {'class': "placeHolder"}, img, play, icon)
  let result = s.elt("div", {'class': "video-holder gened", 'data-video-id': node.attrs.videoId}, content)

  result.addEventListener('click', function(){
    let holder = this;//$(this).parents(".video-holder");
    let idData = holder.attributes['data-video-id'];
    let iframe = s.elt("iframe", {
                          width: "100%", height: "100%",
                          src: 'https://www.youtube.com/embed/' + (idData && idData.value) + '?rel=0&autoplay=1',
                          frameborder: '0', allowfullscreen: ""
    })

    holder.appendChild(iframe);

    result.className = "video-holder gened playingVideo"
    setTimeout(function(){content.style.display='none'}, 2000);
  })
  return result
}
