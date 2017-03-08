// const markdownit = require("markdown-it")
// const {Mark} = require("prosemirror-model")

const beeTokens = {
  blockquote: {block: "blockquote"},
  paragraph: {block: "paragraph"},
  list_item: {block: "list_item"},
  bullet_list: {block: "bullet_list"},
  ordered_list: {block: "ordered_list", attrs: tok => ({order: +tok.attrGet("order") || 1})},
  heading: {block: "heading", attrs: tok => ({level: +tok.tag.slice(1)})},
  code_block: {block: "code_block"},

  table: {block: "table", attrs: (tok) => (
    {collumns: tok.children ? tok.children[0].collumns : 3}
  )},
  thead: {block: "table_head", attrs: (tok) => (
    {collumns: tok.children ? tok.children[0].collumns : 3}
  )},
  tbody: {block: "table_body", attrs: (tok) => (
    {collumns: tok.children ? tok.children[0].collumns : 3}
  )},
  tr: {block: "table_row",  attrs: (tok) => (
    { tableCellStyle: [], collumns: tok.children ? tok.children.length : 3}
  )},
  th: {block: "table_cell"},
  td: {block: "table_cell"},

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
