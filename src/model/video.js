const {Fragment, Slice} = require("prosemirror-model")
const {Step, StepResult, StepMap, ReplaceStep} = require("prosemirror-transform")
const {Selection} = require("prosemirror-state")

const YoutubeImage = RegExp("i.ytimg.com\/(vi|sb|vi_webp)/([a-zA-Z0-9_-]{11})\/")
const YoutubeEmbed = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
const YoutubePageUrl = RegExp("youtube.com");
const YoutubeQuery = RegExp("v=([a-zA-Z0-9_-]{11})");
const videoServices = {
  youtube: {
    parseDOM(dom){
      let src = dom.getAttribute("src");
      let data;
      switch (dom.tagName) {
	    case 'VIDEO':
        if (document.location.host.match(YoutubePageUrl)) {
          data = document.location.search.match(YoutubeQuery);
          if (data) return data[1];
        }
        return false;
      default:
        let data = src.match(YoutubeImage) || src.match(YoutubeEmbed)
        if (!data) return false;

        return data[2];
      }
      return false;
    },
    toDOM(videoID){
      return ['div', {'class': "video-holder gened", 'data-video-id': videoID}, 
              ['div', {'class': "placeHolder"},
                ['img', {src:"https://i.ytimg.com/vi/" + videoID + "/mqdefault.jpg" }],
                ['div', {'class': "fa fa-youtube-play youtube-start"}],
                ['div', {'class': "fa fa-youtube youtube-icon"}]
              ]
      ];
    }
  },

}


const video = {  
  attrs: {
    service: {default: ''},
    videoID: {default: ''}
  },
  parseDOM: [{tag: "img,video", getAttrs: (dom) => {
    let val = false;
    for (const service of Object.keys(videoServices)){
      val = videoServices[service].parseDOM(dom);
      if (val) { 
        return {
          videoID: val,
          service: service,
        };
      }
    }
    return false;
  }}],
  toDOM(node) { 
    return videoServices[node.attrs.service].toDOM(node.attrs.videoID);
  }
}


  // result.addEventListener('click', function(){
  //   let holder = this;//$(this).parents(".video-holder");
  //   let idData = holder.attributes['data-video-id'];
  //   let iframe = s.elt("iframe", {
  //                         width: "100%", height: "100%",
  //                         src: 'https://www.youtube.com/embed/' + (idData && idData.value) + '?rel=0&autoplay=1',
  //                         frameborder: '0', allowfullscreen: ""
  //   })


  //   holder.appendChild(iframe);

  //   result.className = "video-holder gened playingVideo"
  //   setTimeout(function(){content.style.display='none'}, 2000);
  // })


function add(obj, props) {
  let copy = {}
  for (let prop in obj) copy[prop] = obj[prop]
  for (let prop in props) copy[prop] = props[prop]
  return copy
}

function addVideoNodes(nodes) {
  return nodes.prepend({
    video: add(video, { inline: true, group: "inline",})
 })
}

exports.addVideoNodes = addVideoNodes;