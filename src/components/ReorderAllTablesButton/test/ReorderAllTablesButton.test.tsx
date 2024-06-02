import {  ReorderAllTablesButton } from '../ReorderAllTablesButton';
import { render, screen, renderHook, fireEvent } from "@testing-library/react";
import { useStore } from '@/zustandStore';

let renderReadyComponent: JSX.Element;

beforeEach(() => {

  useStore.setState({
    reorderAllTables: jest.fn(),
  })

  renderReadyComponent = ( <ReorderAllTablesButton  /> );
});

describe('<ReorderAllTablesButton />', () => {
  it('renders a button to reorder all tables with inherited table', () => {

    render(renderReadyComponent );
    const { result } = renderHook(() => useStore());

    const ReorderAllTablesButton = screen.getByTitle(/Reorder all tables/i)
    expect(ReorderAllTablesButton).toBeInTheDocument();
    fireEvent.click(ReorderAllTablesButton)
    expect(result.current.reorderAllTables).toHaveBeenCalledTimes(1);
  });

  it('renders correctly', () => {
    const renderedContainer = render(renderReadyComponent );
    expect(renderedContainer).toMatchSnapshot();
  });

})
