import { HasOneHandle } from '../HasOneHandle';
import { render, screen } from "@testing-library/react";

let renderReadyComponent: JSX.Element;

beforeEach(() => {
  renderReadyComponent = (
    <HasOneHandle nodeId="1" />
  );
});

describe('<HasOneHandle />', () => {
  it('calls another component with a prop with value "hasOne"', () => {
    render(renderReadyComponent);
    expect(screen.getByText(/MockCustomHandle/i)).toBeInTheDocument();
    expect(screen.getByText(/hasOne/i)).toBeInTheDocument();
  });


  it('renders correctly', () => {
    const renderedContainer = render(renderReadyComponent );
    expect(renderedContainer).toMatchSnapshot();
  });

});