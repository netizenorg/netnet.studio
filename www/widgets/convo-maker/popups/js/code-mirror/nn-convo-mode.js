/* global CodeMirror */
CodeMirror.defineMode('nnConvoMode', function () {
  return {
    startState () {
      return { inTag: false }
    },
    token (stream, state) {
      // eat whitespace
      if (stream.eatSpace()) return null

      // 1) Twine links
      if (!state.inTag && stream.match(/\[\[[^\]]+\]\]/)) {
        return 'link'
      }

      // 2) Tag open
      if (!state.inTag && stream.match(/<\//)) {
        state.inTag = true
        return 'tag bracket'
      }
      if (!state.inTag && stream.match(/</)) {
        state.inTag = true
        return 'tag bracket'
      }

      // 3) Inside a tag: tag name, attributes, strings, close
      if (state.inTag) {
        // tag name
        if (stream.match(/^[A-Za-z][\w:-]*/)) {
          return 'tag'
        }
        // attribute name
        if (stream.match(/^[A-Za-z_:][\w:.-]*/)) {
          return 'attribute'
        }
        // equals
        if (stream.match(/^=/)) {
          return 'operator'
        }
        // quoted attribute value
        if (stream.match(/^"([^"\\]|\\.)*"/) ||
            stream.match(/^'([^'\\]|\\.)*'/)) {
          return 'string'
        }
        // tag close
        if (stream.match(/^\/?>/)) {
          state.inTag = false
          return 'tag bracket'
        }
      }

      // 4) Interpolation
      if (stream.match(/\$\{[^}]+\}/)) {
        return 'operator'
      }

      // fallback
      stream.next()
      return null
    }
  }
})
