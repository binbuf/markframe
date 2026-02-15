import { Editor } from "@monaco-editor/react";
import { useRef, useState, useEffect } from "react";

interface EditorPaneProps {
  value: string;
  onChange: (value: string) => void;
}

export default function EditorPane({ value, onChange }: EditorPaneProps) {
  const [localValue, setLocalValue] = useState(value);
  const [prevPropValue, setPrevPropValue] = useState(value);
  const [lastEmittedValue, setLastEmittedValue] = useState(value);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Derived state pattern: Sync local state with prop if external change detected
  if (value !== prevPropValue) {
    setPrevPropValue(value);
    // If the new prop is different from what we last told the parent,
    // it must be an external change (e.g. file loaded, or another user).
    // So we accept it.
    if (value !== lastEmittedValue) {
      setLocalValue(value);
      setLastEmittedValue(value); 
    }
  }

  const handleEditorChange = (newValue: string | undefined) => {
    const val = newValue || "";
    setLocalValue(val);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setLastEmittedValue(val);
      onChange(val);
    }, 200);
  };

  return (
    <div className="h-full w-full overflow-hidden bg-[#1e1e1e]">
      <Editor
        height="100%"
        defaultLanguage="plaintext"
        theme="vs-dark"
        value={localValue}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: true },
          wordWrap: "on",
          folding: true,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
        }}
      />
    </div>
  );
}