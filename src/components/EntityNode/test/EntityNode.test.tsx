import { EntityNode } from '../EntityNode';
import { fireEvent, render, renderHook, screen } from "@testing-library/react";
import { useStore } from '@/zustandStore';
import { ReactNode } from 'react';

jest.mock('@xyflow/react',  () => ({
  NodeResizeControl: ({children}: {children: ReactNode}) => (
    <>
      MockNodeResizeControl
      {children}
    </>
  ), 
  Position: {
    Right: "right"
  },
  
}))

let renderReadyComponent: JSX.Element;

beforeEach(() => {
  
  useStore.setState({ 
    onNodeInputChange: jest.fn() 
  })
  
  renderReadyComponent = (
    <EntityNode 
      id="111"
      data={{name: "mockName", tableId: "mockTableId"}}
      selected
    />
  );
});

describe('<EntityNode />', () => {
  
  it('renders the necessary components correctly', () => {
    render(renderReadyComponent );

    expect(screen.getByText(/MockTargetHandle/i)).toBeInTheDocument();
    expect(screen.getByText(/MockTableName/i)).toBeInTheDocument();
    expect(screen.getByText(/MockAllHandlers/i)).toBeInTheDocument();
    expect(screen.getByText(/MockSelectThroughNode/i)).toBeInTheDocument();
    expect(screen.getByText(/MockNodeResizeControl/i)).toBeInTheDocument();
    expect(screen.getByText(/MockExpandToRight/i)).toBeInTheDocument();
  });

  it('renders an input with a placeholder "Entity"', () => {

    render(renderReadyComponent );
    const { result } = renderHook(() => useStore());

    const inputElement = screen.getByPlaceholderText(/Entity/i)

    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue("mockName");

    fireEvent.change(inputElement, {target: {value: 'mockInput'}});

    expect(result.current.onNodeInputChange).toHaveBeenCalledTimes(1);

  });

  it('renders correctly', () => {
    const renderedContainer = render(renderReadyComponent );
    expect(renderedContainer).toMatchSnapshot();
  });
  

});