import React, { useState } from "react";

interface CollapsibleProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-5 w-5 transition-transform ${
        open ? "rotate-90" : "rotate-0"
      }`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M6.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 11-1.414-1.414L11.586 10 6.293 4.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function Collapsible({
  title,
  subtitle,
  actions,
  defaultOpen = false,
  children,
  className = "",
  contentClassName = "",
}: CollapsibleProps) {
  const [open, setOpen] = useState<boolean>(defaultOpen);
  const toDisplay = (node: React.ReactNode): React.ReactNode => {
    if (node instanceof Date) {
      try {
        return node.toLocaleString();
      } catch {
        return String(node);
      }
    }
    return node;
  };

  return (
    <div
      className={`border border-neutral-700 rounded-lg bg-neutral-800 ${className}`}
    >
      <div className="flex items-center justify-between px-4 py-3 select-none">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center space-x-3 text-left text-white hover:text-yellow-400 focus:outline-none"
          aria-expanded={open}
        >
          <Chevron open={open} />
          <div>
            <div className="font-semibold">{toDisplay(title)}</div>
            {subtitle && (
              <div className="text-sm text-neutral-300">
                {toDisplay(subtitle)}
              </div>
            )}
          </div>
        </button>
        {actions && (
          <div className="ml-4 flex items-center space-x-2">{actions}</div>
        )}
      </div>
      {open && (
        <div className={`px-4 pb-4 ${contentClassName}`}>{children}</div>
      )}
    </div>
  );
}

export default Collapsible;
