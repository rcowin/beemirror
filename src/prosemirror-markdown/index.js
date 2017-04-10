// Defines a parser and serializer for [CommonMark](http://commonmark.org/) text.

exports.schema = require("../model/beeschema").schema
;({defaultMarkdownParser: exports.defaultMarkdownParser, MarkdownParser: exports.MarkdownParser} = require("./from_markdown"))
;({MarkdownSerializer: exports.MarkdownSerializer, defaultMarkdownSerializer: exports.defaultMarkdownSerializer,
   MarkdownSerializerState: exports.MarkdownSerializerState} = require("./to_markdown"))
