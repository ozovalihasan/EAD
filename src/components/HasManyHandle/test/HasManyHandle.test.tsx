import { HasManyHandle } from '../HasManyHandle';
import { render, screen } from "@testing-library/react";

let renderReadyComponent: JSX.Element;

beforeEach(() => {
  renderReadyComponent = (
    <HasManyHandle nodeId="1" />
  );
});

describe('<HasManyHandle />', () => {
  it('calls another component with a prop with value "hasMany"', () => {
    render(renderReadyComponent);
    expect(screen.getByText(/MockCustomHandle/i)).toBeInTheDocument();
    expect(screen.getByText(/hasMany/i)).toBeInTheDocument();
  });
  

  it('renders correctly', () => {
    const renderedContainer = render(renderReadyComponent );
    expect(renderedContainer).toMatchSnapshot();
  });

});