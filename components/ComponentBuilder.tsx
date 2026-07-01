"use client";

import { useCallback, useState } from "react";
import {
  Boxes,
  Download,
  GripVertical,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import { buildPreviewHtml, stripCodeFences } from "@/lib/landing-sections";
import {
  COMPONENT_LABELS,
  COMPONENT_TYPES,
  type CanvasComponentType,
  type CanvasItem,
  type GeneratedComponent,
} from "@/lib/component-schema";

const DEFAULT_DESCRIPTIONS: Record<CanvasComponentType, string> = {
  button: "A blue submit button that shows a spinner while loading",
  input: "An email input with label and validation error state",
  card: "A pricing card with title, price, feature list, and CTA button",
};

function createItem(type: CanvasComponentType, x: number, y: number): CanvasItem {
  return {
    id: crypto.randomUUID(),
    x,
    y,
    type,
  };
}

export function ComponentBuilder() {
  const [items, setItems] = useState<CanvasItem[]>([]);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [exportCopied, setExportCopied] = useState(false);

  const activeItem = items.find((i) => i.id === activeItemId);

  const addComponent = (type: CanvasComponentType) => {
    const offset = items.length * 24;
    setItems((prev) => [
      ...prev,
      createItem(type, 40 + offset, 40 + offset),
    ]);
  };

  const startDrag = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.preventDefault();
      const item = items.find((i) => i.id === id);
      if (!item) return;

      const startX = e.clientX - item.x;
      const startY = e.clientY - item.y;

      const onMove = (moveEvent: MouseEvent) => {
        setItems((prev) =>
          prev.map((i) =>
            i.id === id
              ? {
                  ...i,
                  x: moveEvent.clientX - startX,
                  y: moveEvent.clientY - startY,
                }
              : i
          )
        );
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener(
        "mouseup",
        () => window.removeEventListener("mousemove", onMove),
        { once: true }
      );
    },
    [items]
  );

  const openPopover = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    setActiveItemId(id);
    setDescription(DEFAULT_DESCRIPTIONS[item.type]);
  };

  const closePopover = () => {
    setActiveItemId(null);
    setDescription("");
  };

  const generateForItem = async () => {
    if (!activeItem || !description.trim()) return;

    setItems((prev) =>
      prev.map((i) =>
        i.id === activeItem.id ? { ...i, generating: true } : i
      )
    );

    try {
      const res = await fetch("/api/generate-component", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          componentType: activeItem.type,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");

      const generated: GeneratedComponent = {
        ...data,
        jsx: stripCodeFences(data.jsx),
      };

      setItems((prev) =>
        prev.map((i) =>
          i.id === activeItem.id
            ? { ...i, generated, generating: false }
            : i
        )
      );
      closePopover();
    } catch {
      setItems((prev) =>
        prev.map((i) =>
          i.id === activeItem.id ? { ...i, generating: false } : i
        )
      );
    }
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (activeItemId === id) closePopover();
  };

  const buildExport = () => {
    const components = items
      .filter((i) => i.generated)
      .map((item) => {
        const g = item.generated!;
        return `// ${g.componentName} (${item.type}) at (${item.x}, ${item.y})
${g.propsInterface}

${g.jsx}

// a11y: ${g.accessibilityNotes}
`;
      })
      .join("\n");

    return `// Generated page — AI Component Builder
${components}
export default function GeneratedPage() {
  return (
    <div className="relative min-h-screen bg-gray-50">
${items
  .filter((i) => i.generated)
  .map(
    (item) =>
      `      <div style={{ position: 'absolute', left: ${item.x}, top: ${item.y} }}>
        {/* ${item.generated!.componentName} */}
      </div>`
  )
  .join("\n")}
    </div>
  );
}
`;
  };

  const handleExport = async () => {
    await navigator.clipboard.writeText(buildExport());
    setExportCopied(true);
    setTimeout(() => setExportCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {COMPONENT_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => addComponent(type)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-gray-900 border border-gray-700 text-gray-300 hover:border-gray-600 hover:text-white transition"
            >
              <Plus className="w-3.5 h-3.5" />
              {COMPONENT_LABELS[type]}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleExport}
          disabled={!items.some((i) => i.generated)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold transition"
        >
          <Download className="w-3.5 h-3.5" />
          {exportCopied ? "Copied!" : "Export JSX"}
        </button>
      </div>

      <p className="text-xs text-gray-600">
        Drag to move · double-click to describe and generate with AI
      </p>

      <div className="relative min-h-[560px] rounded-2xl border-2 border-dashed border-gray-800 bg-gray-900/30 overflow-hidden">
        {items.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 gap-2 pointer-events-none">
            <Boxes className="w-10 h-10 opacity-40" />
            <p className="text-sm">Add components from the toolbar above</p>
          </div>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="absolute w-56 rounded-xl border border-gray-700 bg-gray-900 shadow-lg overflow-hidden select-none"
            style={{ left: item.x, top: item.y }}
            onDoubleClick={() => openPopover(item.id)}
          >
            <div
              className="flex items-center justify-between px-2 py-1.5 border-b border-gray-800 bg-gray-950 cursor-grab active:cursor-grabbing"
              onMouseDown={(e) => startDrag(e, item.id)}
            >
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-gray-500">
                <GripVertical className="w-3 h-3" />
                {COMPONENT_LABELS[item.type]}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(item.id);
                }}
                className="p-0.5 text-gray-600 hover:text-gray-400"
                aria-label="Remove"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            <div className="h-32 bg-white relative">
              {item.generating ? (
                <div className="flex items-center justify-center h-full bg-gray-900">
                  <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                </div>
              ) : item.generated ? (
                <iframe
                  title={item.generated.componentName}
                  srcDoc={buildPreviewHtml(item.generated.jsx)}
                  className="w-full h-full border-0 pointer-events-none"
                  sandbox="allow-scripts allow-same-origin"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-900 text-xs text-gray-600 text-center px-3">
                  Double-click to generate
                </div>
              )}
            </div>

            {item.generated && (
              <p className="px-2 py-1 text-[10px] text-gray-500 truncate border-t border-gray-800">
                {item.generated.componentName}
              </p>
            )}
          </div>
        ))}
      </div>

      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                Describe this {COMPONENT_LABELS[activeItem.type]}
              </h3>
              <button
                type="button"
                onClick={closePopover}
                className="text-gray-500 hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
              autoFocus
            />
            <button
              type="button"
              onClick={generateForItem}
              disabled={activeItem.generating || !description.trim()}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition"
            >
              {activeItem.generating ? "Generating…" : "Generate component"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
