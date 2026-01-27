import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  label?: string;
}

export function RichTextEditor({ value, onChange, placeholder, label }: RichTextEditorProps) {
  const modules = {
    toolbar: [
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean'],
    ],
  };

  const formats = [
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'list',
    'bullet',
  ];

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</label>}
      <div className="rich-text-editor bg-background rounded-md border border-input overflow-hidden min-h-[200px]">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className="h-full"
        />
        <style>{`
          .rich-text-editor .ql-toolbar.ql-snow {
            border: none;
            border-bottom: 1px solid hsl(var(--border));
            background: hsl(var(--secondary) / 0.5);
          }
          .rich-text-editor .ql-container.ql-snow {
            border: none;
            min-height: 150px;
          }
          .rich-text-editor .ql-editor {
            font-size: 1rem;
            line-height: 1.5;
            padding: 1rem;
          }
          .rich-text-editor .ql-editor.ql-blank::before {
            color: hsl(var(--muted-foreground));
            font-style: normal;
          }
          .dark .rich-text-editor .ql-snow .ql-stroke {
            stroke: hsl(var(--foreground));
          }
          .dark .rich-text-editor .ql-snow .ql-fill {
            fill: hsl(var(--foreground));
          }
          .dark .rich-text-editor .ql-snow .ql-picker {
            color: hsl(var(--foreground));
          }
          .dark .rich-text-editor .ql-snow .ql-picker-options {
            background-color: hsl(var(--background));
            border-color: hsl(var(--border));
          }
        `}</style>
      </div>
    </div>
  );
}
