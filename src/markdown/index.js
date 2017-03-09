// const markdownit = require("markdown-it")
// const {Mark} = require("prosemirror-model")

let columnsState = [];
let columnsCount = 0;

const beeTokens = {
  blockquote: {block: "blockquote"},
  paragraph: {block: "paragraph"},
  list_item: {block: "list_item"},
  bullet_list: {block: "bullet_list"},
  ordered_list: {block: "ordered_list", attrs: tok => ({order: +tok.attrGet("order") || 1})},
  heading: {block: "heading", attrs: tok => ({level: +tok.tag.slice(1)})},
  code_block: {block: "code_block"},

  table: {block: "table", attrs: (tok) => {
    let value =  {columns: 0};
    columnsState = [value];
    columnsCount = 0;
    return value;
  }},
  thead: {block: "table_head", attrs: (tok) => {
    let value =  {columns: 0};
    columnsState.push(value);
    return value;
  }},
  tbody: {block: "table_body", attrs: (tok) => {
    let value =  {columns: columnsCount};
    return value;
  }},
  tr: {block: "table_row",  attrs: (tok) => {
    let value = { tableCellStyle: [], columns: columnsCount };
    if (columnsCount === 0) columnsState.push(value);
    return value;
  }},
  th: {block: "table_cell", attrs: (tok) => {
    columnsCount += 1;
    for (var i=0; i< columnsState.length; i++) columnsState[i].columns = columnsCount;
        
    if (tok.attrs && tok.attrs[0].length > 1) return {style: tok.attrs[0][1]};
    return {};
  }},
  td: {block: "table_cell", attrs: (tok) => {
    if (tok.attrs && tok.attrs[0].length > 1) return {style: tok.attrs[0][1]};
    return {};
  }},

  video: {node: 'video', attrs: (tok) => ({
    videoID: tok.videoID,
    service: tok.service,
  })},

  fence: {block: "code_block"},
  hr: {node: "horizontal_rule"},
  image: {node: "image", attrs: tok => (
    {
    src: tok.attrGet("src"),
    title: tok.attrGet("title") || null,
    alt: tok.children[0] && tok.children[0].content || null
    }
  )},
  hardbreak: {node: "hard_break"},
  em: {mark: "em"},
  strong: {mark: "strong"},
  link: {mark: "link", attrs: tok => ({
    href: tok.attrGet("href"),
    title: tok.attrGet("title") || null
  })},
  code_inline: {mark: "code"}
}


exports.beeTokens = beeTokens
