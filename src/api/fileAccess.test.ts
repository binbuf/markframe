import { openFile, saveFile } from './fileAccess';

// ===========================================================================
// openFile
// ===========================================================================
describe('openFile', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    // Clean up any showOpenFilePicker mock
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).showOpenFilePicker;
  });

  it('uses File System Access API when available', async () => {
    const mockFile = { name: 'test.mf', text: vi.fn().mockResolvedValue('hello world') };
    const mockHandle = {
      getFile: vi.fn().mockResolvedValue(mockFile),
      name: 'test.mf',
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).showOpenFilePicker = vi.fn().mockResolvedValue([mockHandle]);

    const result = await openFile();

    expect(result.handle).toBe(mockHandle);
    expect(result.content).toBe('hello world');
    expect(result.name).toBe('test.mf');
  });

  it('passes .mf file filter to showOpenFilePicker', async () => {
    const mockFile = { name: 'test.mf', text: vi.fn().mockResolvedValue('') };
    const mockHandle = { getFile: vi.fn().mockResolvedValue(mockFile), name: 'test.mf' };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockPicker = vi.fn().mockResolvedValue([mockHandle]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).showOpenFilePicker = mockPicker;

    await openFile();

    expect(mockPicker).toHaveBeenCalledWith(
      expect.objectContaining({
        types: expect.arrayContaining([
          expect.objectContaining({
            accept: { 'text/plain': ['.mf'] },
          }),
        ]),
      }),
    );
  });

  it('falls back to input element when API is not available', async () => {
    // showOpenFilePicker is not defined — fallback path
    const createElementSpy = vi.spyOn(document, 'createElement');

    // We can't fully test the fallback without user interaction,
    // but we can verify it creates an input element
    const openPromise = openFile();

    // The function should have created an input element
    expect(createElementSpy).toHaveBeenCalledWith('input');

    // Simulate cancel by dispatching focus
    window.dispatchEvent(new Event('focus'));

    // Wait for the timeout in the fallback
    await vi.waitFor(async () => {
      const result = await openPromise;
      expect(result.handle).toBeNull();
    }, { timeout: 1000 });
  });
});

// ===========================================================================
// saveFile
// ===========================================================================
describe('saveFile', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).showSaveFilePicker;
  });

  it('writes to existing handle when available', async () => {
    const mockWritable = {
      write: vi.fn().mockResolvedValue(undefined),
      close: vi.fn().mockResolvedValue(undefined),
    };

    const mockHandle = {
      createWritable: vi.fn().mockResolvedValue(mockWritable),
      name: 'test.mf',
    } as unknown as FileSystemFileHandle;

    const result = await saveFile(mockHandle, 'file content');

    expect(mockHandle.createWritable).toHaveBeenCalled();
    expect(mockWritable.write).toHaveBeenCalledWith('file content');
    expect(mockWritable.close).toHaveBeenCalled();
    expect(result).toBe(mockHandle);
  });

  it('shows save picker when no handle but API is available', async () => {
    const mockWritable = {
      write: vi.fn().mockResolvedValue(undefined),
      close: vi.fn().mockResolvedValue(undefined),
    };

    const newHandle = {
      createWritable: vi.fn().mockResolvedValue(mockWritable),
      name: 'project.mf',
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).showSaveFilePicker = vi.fn().mockResolvedValue(newHandle);

    const result = await saveFile(null, 'content');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((window as any).showSaveFilePicker).toHaveBeenCalled();
    expect(mockWritable.write).toHaveBeenCalledWith('content');
    expect(result).toBe(newHandle);
  });

  it('falls back to download when no API available', async () => {
    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
    const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    const mockAnchor = {
      href: '',
      download: '',
      click: vi.fn(),
    };
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as unknown as HTMLElement);

    const result = await saveFile(null, 'download content');

    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(mockAnchor.click).toHaveBeenCalled();
    expect(mockAnchor.download).toBe('project.mf');
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:test');
    expect(result).toBeNull();
  });

  it('uses handle name for download filename when available', async () => {
    const mockAnchor = {
      href: '',
      download: '',
      click: vi.fn(),
    };
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as unknown as HTMLElement);

    // Pass a handle that doesn't have createWritable (so it falls to download),
    // but has a name
    const handleWithName = { name: 'custom-name.mf' } as unknown as FileSystemFileHandle;
    await saveFile(handleWithName, 'content');

    expect(mockAnchor.download).toBe('custom-name.mf');
  });
});
