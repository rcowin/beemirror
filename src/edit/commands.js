
import {elt} from "prosemirror/src/dom"

var isMarkDown = false;
var isFirst = true;
var mdBar;
var textArea;

export const MarkdownCommandSpec = {
  derive: true,
  label: "MarkDown",
  run: function(pm){
    var menu;

    if (isFirst){
      isFirst = false;

      var rep = document.querySelector(".ProseMirror");
      // rep.textContent = "";
      textArea = rep.appendChild(elt("textarea", {style: "font-family: inherit; font-size: inherit; box-sizing: border-box;;padding: 4px 8px 4px 14px;white-space: pre-wrap;line-height: 1.2;"}));
    }

    isMarkDown = !isMarkDown;
    pm.mod.menuBar.updater.force();

    if (isMarkDown){
      menu = document.querySelector(".ProseMirror-menubar");
      mdBar = menu.appendChild(elt("div", {'class': "ProseMirror-menubar-inner", style: "display:none;position: absolute;left:0; right: 50px;top:0;bottom:0;border: 0; background: rgba(250,250,250, .8);"}));


      textArea.value = pm.getContent("markdown");
      mdBar.style.display = 'block';
      textArea.style.display = 'block';
      document.querySelector(".ProseMirror-content").style.display = "none";
      if (focus !== false) textArea.focus();

      document.body.scrollTop = 0;
      textArea.scrollTop = 0;
      //hack
      // ProseMirror-menu-active
    } else {
      mdBar.style.display = "none";
      textArea.style.display = 'none';
      document.querySelector(".ProseMirror-content").style.display = "block";

      pm.setContent(textArea.value, "markdown");
      pm.focus();
    }
    pm.ensureOperation();

  },
  // select(pm) { return pm.history.redoDepth > 0 },
  active: function(){ return isMarkDown;},
  menu: {
    group: "markdown", rank: 61,
    display: {
      type: "icon",
      width: 208, height:128,
      // width: 585, height: 1024,
      path: "M30 98v-68h20l20 25 20-25h20v68h-20v-39l-20 25-20-25v39zM155 98l-30-33h20v-35h20v35h20z"
    }
  }
};
