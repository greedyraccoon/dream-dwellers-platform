import { useEffect, useRef } from "react";
import { Bold, Italic, Underline, List, ListOrdered, Heading2, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

/** Minimal rich-text editor (contentEditable + execCommand) — no extra deps, SSR-safe. */
export function RichTextEditor({ value, onChange, placeholder }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
  }, [value]);

  function exec(cmd: string, arg?: string) {
    ref.current?.focus();
    document.execCommand(cmd, false, arg);
    onChange(ref.current?.innerHTML ?? "");
  }

  const tools = [
    { icon: Bold, label: "Bold", run: () => exec("bold") },
    { icon: Italic, label: "Italic", run: () => exec("italic") },
    { icon: Underline, label: "Underline", run: () => exec("underline") },
    { icon: Heading2, label: "Heading", run: () => exec("formatBlock", "<h2>") },
    { icon: List, label: "Bullet list", run: () => exec("insertUnorderedList") },
    { icon: ListOrdered, label: "Numbered list", run: () => exec("insertOrderedList") },
    {
      icon: Link2,
      label: "Link",
      run: () => {
        const url = window.prompt("Link URL");
        if (url) exec("createLink", url);
      },
    },
  ];

  return (
    <div className="rounded-md border border-input bg-background">
      <div className="flex flex-wrap items-center gap-1 border-b border-border p-1">
        {tools.map(t => (
          <Button
            key={t.label}
            type="button"
            variant="ghost"
            size="sm"
            aria-label={t.label}
            title={t.label}
            className="h-8 w-8 p-0"
            onMouseDown={e => e.preventDefault()}
            onClick={t.run}
          >
            <t.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder ?? "Write your post…"}
        onInput={e => onChange((e.target as HTMLDivElement).innerHTML)}
        className="prose-editor min-h-52 w-full px-3 py-2 text-sm outline-none [&_h2]:mt-3 [&_h2]:text-lg [&_h2]:font-semibold [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5 empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]"
      />
    </div>
  );
}
