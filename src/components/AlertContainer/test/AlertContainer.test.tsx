import { AlertContainer } from '../AlertContainer';
import { render } from "@testing-library/react";
import { useStore } from '@/zustandStore';

let renderReadyComponent: JSX.Element;

beforeEach(() => {
  
  useStore.setState({ 
    alertMessages: {"2222": {type: "success", message: "success message"}},
  })
  
  renderReadyComponent = (
    <AlertContainer />
  );
});

describe('<AlertContainer />', () => {
  it('renders correctly', () => {
    const renderedContainer = render(renderReadyComponent );
    expect(renderedContainer).toMatchSnapshot();
  });
    
});