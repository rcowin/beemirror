
// import {elt} from "prosemirror/src/dom"

// function blockTypeItem(nodeType, options) {
//   var command = setBlockType(nodeType, options.attrs);
//   var passedOptions = {
//     run: command,
//     select: function select(state) {
//       return command(state);
//     },
//     active: function active(state) {
//       var ref = state.selection;
//       var $from = ref.$from;
//       var to = ref.to;
//       var node = ref.node;
//       if (node) {
//         return node.hasMarkup(nodeType, options.attrs);
//       }
//       return to <= $from.end() && $from.parent.hasMarkup(nodeType, options.attrs);
//     }
//   };
//   for (var prop in options) {
//     passedOptions[prop] = options[prop];
//   }
//   return new MenuItem(passedOptions);
// }
// exports.blockTypeItem = blockTypeItem;

export const buildMarkdownCommandSpec = function (parser, serializer) {
  let mdBar;
  let textArea;
  let isBeeMarkDown;

  return {
    // derive: true,
    label: "MarkDown",
    title: "MarkDown",

    run: function (state, dispatch, view) {
      var menu;

      if (!textArea) {
        var rep = document.querySelector(".ProseMirror-menubar-wrapper");
        // rep.textContent = "";
        textArea = document.createElement("textarea");
        textArea.style = "font-family: inherit; box-sizing: border-box;padding: 4px 8px 4px 14px;white-space: pre-wrap;line-height: 1.2;"
        rep.appendChild(textArea);
      }

      isBeeMarkDown = !isBeeMarkDown;
      // this.updateMenu();
      // pm.mod.menuBar.updater.force();

      if (isBeeMarkDown) {
        menu = document.querySelector(".ProseMirror-menubar");
        mdBar = document.createElement("div");
        mdBar.class = "ProseMirror-menubar-inner ";
        mdBar.style = "position:absolute;white-space:pre-wrap;top:0px;bottom:0px;left:0px;right:44px;background-color:rgba(255,255,255,0.8);"
        mdBar = menu.appendChild(mdBar);

        // mdBar = menu.appendChild(elt("div", {'class': "ProseMirror-menubar-inner", style: "display:none;position: absolute;left:0; right: 50px;top:0;bottom:0;border: 0; background: rgba(250,250,250, .8);"}));

        textArea.value = serializer.serialize(state.doc)

        mdBar.style.display = 'block';
        textArea.style.display = 'block';
        document.querySelector(".ProseMirror").style.display = "none";
        textArea.focus();
        textArea.scrollTop = 0;
        document.body.scrollTop = 0;
      } else {
        mdBar.style.display = "none";
        textArea.style.display = 'none';
        document.querySelector(".ProseMirror").style.display = "block";

        state.doc = parser.parse(textArea.value)
        view.updateState(view.state)
        // pm.focus();
      }
      // pm.ensureOperation();
    },
    // select(pm) { return pm.history.redoDepth > 0 },
    active: function (pm) { return pm.isBeeMarkDown; },
    group: "markdown",
    icon: {
      width: 208,
      height: 128,
      path: "M30 98v-68h20l20 25 20-25h20v68h-20v-39l-20 25-20-25v39zM155 98l-30-33h20v-35h20v35h20z"
    },

    getMDContent: function(){
      if (isBeeMarkDown)
        return textArea.value;
      else
        return serializer.serialize(view.editor.state.doc);
    }
  };
}

