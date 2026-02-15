import { render, act, fireEvent } from '@testing-library/react';

// Mock Monaco Editor since it requires a browser environment
vi.mock('@monaco-editor/react', () => ({
  Editor: ({ value, onChange }: { value: string; onChange: (val: string | undefined) => void }) => (
    <textarea
      data-testid="mock-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

import EditorPane from './EditorPane';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('EditorPane', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(
      <EditorPane value="hello" onChange={() => {}} />,
    );
    expect(getByTestId('mock-editor')).toBeInTheDocument();
  });

  it('displays the initial value', () => {
    const { getByTestId } = render(
      <EditorPane value="initial content" onChange={() => {}} />,
    );
    expect(getByTestId('mock-editor')).toHaveValue('initial content');
  });

  it('debounces onChange calls by 200ms', () => {
    const onChange = vi.fn();
    const { getByTestId } = render(
      <EditorPane value="" onChange={onChange} />,
    );

    const editor = getByTestId('mock-editor');

    act(() => {
      fireEvent.change(editor, { target: { value: 'new text' } });
    });

    // Should not have called onChange yet
    expect(onChange).not.toHaveBeenCalled();

    // Advance past debounce
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('accepts external value changes', () => {
    const onChange = vi.fn();
    const { getByTestId, rerender } = render(
      <EditorPane value="first" onChange={onChange} />,
    );

    expect(getByTestId('mock-editor')).toHaveValue('first');

    rerender(<EditorPane value="second" onChange={onChange} />);

    expect(getByTestId('mock-editor')).toHaveValue('second');
  });
});
