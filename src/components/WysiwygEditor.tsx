import { forwardRef, useImperativeHandle, useRef } from "react";



export type WysiwygEditorHandle = {
  getContent: () => string;
  setContent: (html: string) => void;
  focus: () => void;
};

/* loosely based on https://cruip.com/build-a-wysiwyg-editor-with-tailwind-css/ */
const WysiwygEditor = forwardRef<WysiwygEditorHandle>((props, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    getContent: () => editorRef.current?.innerHTML ?? "",
    setContent: (html: string) => {
      if (editorRef.current) editorRef.current.innerHTML = html;
    },
    focus: () => editorRef.current?.focus(),
  }));
  
  const exec = (command: string) => {
    document.execCommand(command, false, undefined);
    editorRef.current?.focus();
  };

  

  return (
    <div className="w-full max-w-xl mx-auto text-center bg-white dark:bg-gray-900 rounded border border-gray-700 dark:border-gray-400 p-2 focus:outline-none focus:ring-2 focus:ring-col1">
      {/* Header */}
      <header>
        <div className="h-12 border-b [border-image:linear-gradient(to_right,transparent,theme(colors.slate.200),transparent)1]">
          <div className="h-full flex justify-between items-center sm:gap-1 overflow-x-scroll [scrollbar-width:none] px-3">
            <div className="flex-1 flex sm:gap-1">
              {/* Bold */}
              <button
                onClick={() => exec("bold")}
                className="flex justify-center items-center size-8 text-slate-400 hover:text-slate-500 hover:bg-slate-100 rounded focus-visible:outline-none focus-visible:ring focus-visible:ring-col1"
                aria-label="Bold"
                title="Bold"
              >
                <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="10" height="14">
                  <path d="M8.443 6.242c.45-.649.724-1.442.724-2.304C9.167 1.767 7.484 0 5.417 0H1.25C.56 0 0 .587 0 1.313v11.374C0 13.413.56 14 1.25 14h4.583C8.131 14 10 12.037 10 9.625c0-1.37-.615-2.58-1.557-3.383ZM2.5 2.625h2.917c.689 0 1.25.589 1.25 1.313 0 .723-.561 1.312-1.25 1.312H2.5V2.625Zm3.333 8.75H2.5v-3.5h3.333c.92 0 1.667.785 1.667 1.75s-.747 1.75-1.667 1.75Z" />
                </svg>
              </button>

              {/* Underline */}
              <button
                onClick={() => exec("underline")}
                className="flex justify-center items-center size-8 text-slate-400 hover:text-slate-500 hover:bg-slate-100 rounded focus-visible:outline-none focus-visible:ring focus-visible:ring-col1"
                aria-label="Underline"
                title="Underline"
              >
                <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="14" height="16">
                  <path d="M2 7c0 2.757 2.243 5 5 5s5-2.243 5-5V1a1 1 0 1 0-2 0v6c0 1.654-1.346 3-3 3S4 8.654 4 7V1a1 1 0 1 0-2 0v6Zm-2 8a1 1 0 0 0 1 1h12a1 1 0 1 0 0-2H1a1 1 0 0 0-1 1Z" />
                </svg>
              </button>

              {/* Italic */}
              <button
                onClick={() => exec("italic")}
                className="flex justify-center items-center size-8 text-slate-400 hover:text-slate-500 hover:bg-slate-100 rounded focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300"
                aria-label="Italic"
                title="Italic"
              >
                <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="8" height="14">
                  <path d="M7.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM3.75 4.648a1.002 1.002 0 0 1 1.287-.584h.001c.518.194.778.77.585 1.287l-3.006 8a1.004 1.004 0 0 1-1.289.585 1.001 1.001 0 0 1-.585-1.288l3.006-8Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="w-full text-sm text-gray-600 dark:text-gray-200 placeholder:text-slate-400 px-3 sm:px-5 py-4 text-left min-h-[7rem] focus:outline-none before:content-[attr(data-placeholder)] before:text-slate-400 before:pointer-events-none empty:before:block"
      ></div>
    </div>
  );
});


export default WysiwygEditor;