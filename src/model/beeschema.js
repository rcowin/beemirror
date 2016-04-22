import {SchemaSpec, Schema, Block, Textblock, Inline, Text, Attribute, MarkType} from "prosemirror/src/model/schema"
import {Doc, BlockQuote, OrderedList, BulletList, ListItem,
        HorizontalRule, Paragraph, Heading, CodeBlock, Image, HardBreak,
        CodeMark, EmMark, StrongMark, LinkMark} from "prosemirror/src/model"


export class Youtube extends Inline {
  get attrs() {
    return {
      videoId: new Attribute({default:""})
    }
  }
  get draggable() { return true }
}



// :: SchemaSpec
// The specification for the default schema.
const beeSpec = new SchemaSpec({
  doc: Doc,
  blockquote: BlockQuote,
  ordered_list: OrderedList,
  bullet_list: BulletList,
  list_item: ListItem,
  horizontal_rule: HorizontalRule,

  paragraph: Paragraph,
  heading: Heading,
  code_block: CodeBlock,

  text: Text,
  image: Image,
  hard_break: HardBreak,

  video: Youtube
}, {
  em: EmMark,
  strong: StrongMark,
  link: LinkMark,
  code: CodeMark
})

// :: Schema
// ProseMirror's default document schema.
export const beeSchema = new Schema(beeSpec)
