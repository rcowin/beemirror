import {SchemaSpec, Schema, Block, Textblock, Inline, Text, Attribute, MarkType, NodeKind} from "prosemirror/src/model/schema"
import {Doc, BlockQuote, OrderedList, BulletList, ListItem,
        HorizontalRule, Paragraph, Heading, CodeBlock, Image, HardBreak,
        CodeMark, EmMark, StrongMark, LinkMark} from "prosemirror/src/model"


NodeKind.table_row_container = new NodeKind("table_row_container")
NodeKind.table_row = new NodeKind("table_row")
NodeKind.table_cell = new NodeKind("table_cell")

export class Youtube extends Inline {
  get attrs() {
    return {
      videoId: new Attribute({default:""})
    }
  }
  get draggable() { return true }
}

export class Table extends Block {
  get contains() { return NodeKind.table_row_container }
}
export class TableHead extends Block {
  get kind() { return NodeKind.table_row_container }
  get contains() { return NodeKind.table_row }
}
export class TableBody extends Block {
  get kind() { return NodeKind.table_row_container}
  get contains() { return NodeKind.table_row }
}
export class TableRow extends Block {
  get kind() { return NodeKind.table_row }
  get contains() { return NodeKind.table_cell }
}
export class TableH extends Block {
  get kind() { return NodeKind.table_cell }
  get contains() { return NodeKind.inline }
}
export class TableD extends Block {
  get kind() { return NodeKind.table_cell }
  get contains() { return NodeKind.inline }
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

  video: Youtube,
  table: Table,
  thead: TableHead,
  tbody: TableBody,
  tr: TableRow,
  th: TableH,
  td: TableD
}, {
  em: EmMark,
  strong: StrongMark,
  link: LinkMark,
  code: CodeMark
})

// :: Schema
// ProseMirror's default document schema.
export const beeSchema = new Schema(beeSpec)
