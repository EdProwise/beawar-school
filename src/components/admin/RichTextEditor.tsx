import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// ── Register custom font families ─────────────────────────────────────────────
const Font = Quill.import('formats/font') as any;
Font.whitelist = [
  'sans-serif', 'serif', 'monospace',
  'arial', 'georgia', 'poppins', 'roboto',
  'times-new-roman', 'courier-new', 'verdana', 'trebuchet-ms',
];
Quill.register(Font, true);

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  label?: string;
}

export function RichTextEditor({ value, onChange, placeholder, label }: RichTextEditorProps) {
  const modules = {
    toolbar: [
      [{ font: Font.whitelist }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'font', 'size', 'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'align',
    'list', 'bullet', 'indent',
    'blockquote', 'code-block',
    'link', 'image',
  ];

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      <div className="rich-text-editor bg-background rounded-md border border-input overflow-hidden">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
        />
        <style>{`
          /* ── Font family definitions ─────────────────────────────────────── */
          .ql-font-arial       { font-family: Arial, Helvetica, sans-serif; }
          .ql-font-georgia     { font-family: Georgia, 'Times New Roman', serif; }
          .ql-font-poppins     { font-family: 'Poppins', sans-serif; }
          .ql-font-roboto      { font-family: 'Roboto', sans-serif; }
          .ql-font-times-new-roman  { font-family: 'Times New Roman', Times, serif; }
          .ql-font-courier-new { font-family: 'Courier New', Courier, monospace; }
          .ql-font-verdana     { font-family: Verdana, Geneva, sans-serif; }
          .ql-font-trebuchet-ms { font-family: 'Trebuchet MS', Helvetica, sans-serif; }
          .ql-font-serif       { font-family: Georgia, serif; }
          .ql-font-monospace   { font-family: 'Courier New', monospace; }

          /* ── Font picker labels in the dropdown ─────────────────────────── */
          .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="arial"]::before,
          .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="arial"]::before { content: 'Arial'; font-family: Arial, sans-serif; }
          .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="georgia"]::before,
          .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="georgia"]::before { content: 'Georgia'; font-family: Georgia, serif; }
          .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="poppins"]::before,
          .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="poppins"]::before { content: 'Poppins'; font-family: 'Poppins', sans-serif; }
          .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="roboto"]::before,
          .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="roboto"]::before { content: 'Roboto'; font-family: 'Roboto', sans-serif; }
          .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="times-new-roman"]::before,
          .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="times-new-roman"]::before { content: 'Times New Roman'; font-family: 'Times New Roman', serif; }
          .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="courier-new"]::before,
          .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="courier-new"]::before { content: 'Courier New'; font-family: 'Courier New', monospace; }
          .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="verdana"]::before,
          .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="verdana"]::before { content: 'Verdana'; font-family: Verdana, sans-serif; }
          .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="trebuchet-ms"]::before,
          .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="trebuchet-ms"]::before { content: 'Trebuchet MS'; font-family: 'Trebuchet MS', sans-serif; }
          .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
          .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before { content: 'Serif'; font-family: Georgia, serif; }
          .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
          .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before { content: 'Monospace'; font-family: 'Courier New', monospace; }

          /* ── Toolbar styles ──────────────────────────────────────────────── */
          .rich-text-editor .ql-toolbar.ql-snow {
            border: none;
            border-bottom: 1px solid hsl(var(--border));
            background: hsl(var(--secondary) / 0.5);
            padding: 8px 12px;
            flex-wrap: wrap;
            gap: 4px;
          }
          .rich-text-editor .ql-toolbar.ql-snow .ql-formats {
            margin-right: 8px;
          }
          .rich-text-editor .ql-container.ql-snow {
            border: none;
            min-height: 200px;
          }
          .rich-text-editor .ql-editor {
            font-size: 1rem;
            line-height: 1.6;
            padding: 1rem;
            min-height: 200px;
          }
          .rich-text-editor .ql-editor.ql-blank::before {
            color: hsl(var(--muted-foreground));
            font-style: normal;
          }

          /* ── Dark mode ───────────────────────────────────────────────────── */
          .dark .rich-text-editor .ql-snow .ql-stroke { stroke: hsl(var(--foreground)); }
          .dark .rich-text-editor .ql-snow .ql-fill { fill: hsl(var(--foreground)); }
          .dark .rich-text-editor .ql-snow .ql-picker { color: hsl(var(--foreground)); }
          .dark .rich-text-editor .ql-snow .ql-picker-options {
            background-color: hsl(var(--background));
            border-color: hsl(var(--border));
          }
          .dark .rich-text-editor .ql-editor { color: hsl(var(--foreground)); }

          /* ── Font picker width ───────────────────────────────────────────── */
          .rich-text-editor .ql-snow .ql-picker.ql-font { width: 130px; }
        `}</style>
      </div>
    </div>
  );
}
