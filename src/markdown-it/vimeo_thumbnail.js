
let vimeoThumbnails = {};

function loadVimeoThumbnail(videoID){
  var cb = function(url){
    var img = document.querySelectorAll(`[data-video-id='${videoID}'] img`);
    for (var i=0; i< img.length; i++) img[i].src = url;
  };

  if (vimeoThumbnails[videoID]) return cb && setTimeout(() => {cb(vimeoThumbnails[videoID]);},50);

  const videoUrl = `https://www.vimeo.com/${videoID}`;
  const endpoint = 'https://www.vimeo.com/api/oembed.json';
  const callback = 'beevimeocb' + (new Date()).getTime() + Math.floor(Math.random() * 1000);
  const url = endpoint + '?url=' + encodeURIComponent(videoUrl) + '&callback=' + callback + '&width=640';

  window[callback] = function(video) {
    var url = video.thumbnail_url;
    vimeoThumbnails[videoID] = url;

    cb(url);

    window[callback] = undefined;
  }

  function load(url) {
      var js = document.createElement('script');
      js.setAttribute('type', 'text/javascript');
      js.setAttribute('src', url);
      document.getElementsByTagName('head').item(0).appendChild(js);
  }
  load(url);
}

export {loadVimeoThumbnail};