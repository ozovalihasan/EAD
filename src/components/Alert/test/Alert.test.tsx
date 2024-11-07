import { Alert } from '../Alert';
import { render, screen, fireEvent } from '@testing-library/react';
import { useStore } from '@/zustandStore';
import { act } from 'react-dom/test-utils';

let renderReadyComponent: JSX.Element;
let deleteAlert: jest.Mock;

beforeAll(() => {
  jest.useFakeTimers();
});

beforeEach(() => {
  deleteAlert = jest.fn();

  useStore.setState({
    deleteAlert: deleteAlert,
  });

  renderReadyComponent = (
    <Alert id={'3333'} type={'error'} message="mock message" />
  );
});

describe('<Alert />', () => {
  it('renders the alert message', () => {
    render(<Alert id="3333" type="error" message="mock message" />);
    expect(screen.getByText('mock message')).toBeInTheDocument();
  });

  it('applies the correct styles based on the type', () => {
    const { rerender } = render(
      <Alert id="3333" type="error" message="mock message" />
    );
    expect(screen.getByText('mock message').parentElement).toHaveClass(
      'bg-error-500'
    );

    rerender(<Alert id="3333" type="success" message="mock message" />);
    expect(screen.getByText('mock message').parentElement).toHaveClass(
      'bg-success-500'
    );
  });

  it('transitions through the correct statuses', () => {
    render(renderReadyComponent);

    expect(screen.getByText('mock message').parentElement).toHaveClass(
      'translate-x-[110%]'
    );

    act(() => {
      jest.advanceTimersByTime(0);
    });
    expect(screen.getByText('mock message').parentElement).toHaveClass(
      'translate-x-0'
    );

    act(() => {
      jest.advanceTimersByTime(6000);
    });
    expect(screen.getByText('mock message').parentElement).toHaveClass(
      'translate-x-[110%]'
    );
  });

  it('calls deleteAlert after the transition ends', () => {
    render(renderReadyComponent);

    act(() => {
      jest.advanceTimersByTime(7000);
    });

    expect(deleteAlert).toHaveBeenCalledTimes(1);
    expect(deleteAlert).toHaveBeenCalledWith('3333');
  });

  it('calls deleteAlert when the button having XMark is clicked', () => {
    render(renderReadyComponent);

    fireEvent.click(screen.getByText('MockXMark'));

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(deleteAlert).toHaveBeenCalledTimes(1);
    expect(deleteAlert).toHaveBeenCalledWith('3333');
  });

  it('renders correctly', () => {
    const renderedContainer = render(renderReadyComponent);
    expect(renderedContainer).toMatchSnapshot();
  });
});
