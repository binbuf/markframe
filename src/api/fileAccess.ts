export async function openFile(): Promise<{ handle: FileSystemFileHandle | null, content: string, name: string }> {
  if ('showOpenFilePicker' in window) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [handle] = await (window as any).showOpenFilePicker({
      types: [{ description: 'markframe Files', accept: { 'text/plain': ['.mf'] } }],
    });
    const file = await handle.getFile();
    const content = await file.text();
    return { handle, content, name: file.name };
  } else {
    // Fallback for Firefox/Safari
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.mf';
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const content = await file.text();
          resolve({ handle: null, content, name: file.name });
        }
      };
      input.oncancel = () => {
        resolve({ handle: null, content: '', name: '' });
      };
      // Handle cancel via focus event (fallback for browsers without oncancel)
      const handleFocus = () => {
        setTimeout(() => {
          if (!input.files?.length) {
            resolve({ handle: null, content: '', name: '' });
          }
          window.removeEventListener('focus', handleFocus);
        }, 300);
      };
      window.addEventListener('focus', handleFocus);
      input.click();
    });
  }
}

export async function saveFile(handle: FileSystemFileHandle | null, content: string): Promise<FileSystemFileHandle | null> {
  // If we have a valid handle and API support, write to it
  if (handle && 'createWritable' in handle) {
    const writable = await handle.createWritable();
    await writable.write(content);
    await writable.close();
    return handle;
  }

  // If we have API support but no handle, show "Save As" picker
  if ('showSaveFilePicker' in window) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newHandle = await (window as any).showSaveFilePicker({
      suggestedName: 'project.mf',
      types: [{ description: 'markframe Files', accept: { 'text/plain': ['.mf'] } }],
    });

    const writable = await newHandle.createWritable();
    await writable.write(content);
    await writable.close();
    return newHandle;
  }

  // Fallback: Download file
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  a.download = (handle as any)?.name || 'project.mf';
  a.click();
  URL.revokeObjectURL(url);

  return null;
}

