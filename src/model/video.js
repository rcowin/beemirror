const {Fragment, Slice} = require("prosemirror-model")
const {Step, StepResult, StepMap, ReplaceStep} = require("prosemirror-transform")
const {Selection} = require("prosemirror-state")

const YoutubeImage = RegExp("i.ytimg.com\/(vi|sb|vi_webp)/([a-zA-Z0-9_-]{11})\/")
const YoutubeEmbed = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
const YoutubePageUrl = RegExp("youtube.com");
const YoutubeQuery = RegExp("v=([a-zA-Z0-9_-]{11})");
const YoutubeLink = RegExp('\/watch.v=([a-zA-Z0-9_-]{11})');

// const Image = RegExp("i.ytimg.com\/(vi|sb|vi_webp)/([a-zA-Z0-9_-]{11})\/")
const VimeoEmbed = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
const VimeoSimple = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(video\/)?(\d+)(?:$|\/|\?)/;
const VimeoVideo = /https?:\/\/(?:www\.|player\.)?vimeo.com/;

import {loadVimeoThumbnail} from '../markdown-it/vimeo_thumbnail';

// https://player.vimeo.com/video/6942731
const VimeoPageUrl = RegExp("youtube.com");
// const YoutubeQuery = RegExp("v=([a-zA-Z0-9_-]{11})");
const VimeoLink = RegExp('\/watch.v=([a-zA-Z0-9_-]{11})');

const videoServices = {
  youtube: {
    parseDOM(dom){
      let src = dom.getAttribute("src");
      let data;
      switch (dom.tagName) {
	    case 'VIDEO':
        if (pagehref.match(YoutubePageUrl)) {
          data = pagehref.match(YoutubeQuery);
          if (data) return data[1];
        }
        return false;
      // case 'IMG':
      default:
        if (!src) return false;
        
        data = src.match(YoutubeImage) || src.match(YoutubeEmbed)
        if (!data) return false;

        return data[2];
      // default:
      //   return false;
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
  vimeo: {
    parseDOM(dom){
      let src = dom.getAttribute("src");
      let data;
      switch (dom.tagName) {
	    case 'VIDEO':
        data = src.match(VimeoVideo);
        if (data){
          data = pagehref.match(VimeoSimple);
          if (data) return data[2];
        }
        return false;
      case 'IFRAME':
        data = src.match(VimeoEmbed);
        if (data && data[3] === 'string') return data[3];

        data = src.match(VimeoSimple);
        if (data) return data[2];
        return false;
      case 'A':
        var href = dom.getAttribute("href");
        if (!href) return false;
        data = href.match(VimeoSimple);
        if (data) return data[2];

        return false;
      case 'IMG':
        data = src.match(VimeoSimple);
        if (data) return data[2];

        return false;

      default:
        return false;
      }
    },
    toDOM(videoID){
      loadVimeoThumbnail(videoID);
      return ['div', {'class': "video-holder gened", 'data-video-id': videoID}, 
              ['div', {'class': "placeHolder"},
                ['img', {src:""}],
                ['div', {'class': "fa fa-youtube-play vimeo-start"}],
                ['div', {'class': "fa fa-vimeo-square vimeo-icon"}]
              ]
      ];
    }
  }
};

const videoMarks = {  
  parseDOM: [{tag: 'a[href*="watch"]', getAttrs: (dom) => {
    let href = dom.getAttribute("href");
    if (!href) return false;

    let data = href.match(YoutubeLink) 
    if (data) return {};
    else return false;
  }}],
  toDOM(node) { return 0; }
}


const video = {  
  attrs: {
    service: {default: ''},
    videoID: {default: ''}
  },
  parseDOM: [{tag: "img,video,iframe,a", getAttrs: (dom) => {
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

function addVideoMarks(marks) {
  return marks.prepend({
    videoLink: add(videoMarks, { inline: true, group: "inline",})
 })
}

let pagehref = document.location.href;

function setPagehref(href) {
  pagehref = href;
}


export {addVideoNodes, addVideoMarks, setPagehref};
