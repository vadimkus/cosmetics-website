'use client'

import { useRef, useEffect } from 'react'
import { Bold, Italic, Underline, Palette, Highlighter, AlignLeft, AlignCenter, AlignRight, Eraser } from 'lucide-react'

const placeholderStyle = `
  [contenteditable][data-placeholder]:empty:before {
    content: attr(data-placeholder);
    color: #9ca3af;
    pointer-events: none;
  }
`

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  dir?: 'ltr' | 'rtl'
}

export default function RichTextEditor({ value, onChange, placeholder, dir = 'ltr' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const isComposingRef = useRef(false)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || ''
    }
  }, [value])

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    updateContent()
  }

  const updateContent = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const escapeHtml = (s: string) =>
    s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')

  const clearFormatting = () => {
    if (!editorRef.current) return
    // Convert to plain text, keep line breaks, and remove all bold/italic/heading formatting.
    const text = String(editorRef.current.innerText || '').replace(/\r\n/g, '\n')
    const html = escapeHtml(text).replace(/\n/g, '<br />')
    editorRef.current.innerHTML = html
    editorRef.current.focus()
    updateContent()
  }

  const handleInput = () => {
    if (!isComposingRef.current) {
      updateContent()
    }
  }

  const handleCompositionStart = () => {
    isComposingRef.current = true
  }

  const handleCompositionEnd = () => {
    isComposingRef.current = false
    updateContent()
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
    updateContent()
  }

  const applyColor = (type: 'foreColor' | 'backColor') => {
    const color = prompt(`Enter ${type === 'foreColor' ? 'text' : 'background'} color (e.g., #ff0000 or red):`)
    if (color) {
      execCommand(type, color)
    }
  }

  return (
    <div className="border rounded-lg bg-white overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('underline')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={clearFormatting}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Clear formatting"
        >
          <Eraser className="h-4 w-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => applyColor('foreColor')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Text Color"
        >
          <Palette className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => applyColor('backColor')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Highlight Color"
        >
          <Highlighter className="h-4 w-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => execCommand('justifyLeft')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyCenter')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyRight')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<h2>')}
          className="px-2 py-1 text-xs rounded hover:bg-gray-200 transition-colors"
          title="Heading"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<h3>')}
          className="px-2 py-1 text-xs rounded hover:bg-gray-200 transition-colors"
          title="Subheading"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<p>')}
          className="px-2 py-1 text-xs rounded hover:bg-gray-200 transition-colors"
          title="Paragraph"
        >
          P
        </button>
      </div>

      {/* Editor */}
      <style dangerouslySetInnerHTML={{ __html: placeholderStyle }} />
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        dir={dir}
        className="min-h-[120px] p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
        style={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
    </div>
  )
}

