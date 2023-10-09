import {  Sidebar } from '../Sidebar';
import { render, screen, renderHook, fireEvent, cleanup } from "@testing-library/react";
import { DragDirection, useStore } from '@/zustandStore';
import { useCustomizationStore } from '@/zustandStore/customizationStore';

let renderReadyComponent: JSX.Element;

beforeEach(() => {
    
  useStore.setState({ 
    tables: {
      "1": {
        "name": "MockFirstTable",
        "attributes": {
        }, 
        "superclassId": ""
      },
      "2": {
        "name": "MockSecondTable",
        "attributes": {
        },
        "superclassId": ""
      },
    },
    orderedTables: ["1", "2"],
    removeTable: jest.fn(),
    onTableNameChange: jest.fn(),
    moveTable: jest.fn(),
  })
    
  renderReadyComponent = (
    <Sidebar />
  );
});

describe('<Sidebar />', () => {
  
  describe('if the sidebar is visible', () => {

    beforeEach(() => {
      useCustomizationStore.setState({ 
        sidebarVisible: true
      })
    });

    it('renders all tables', () => {
      render(renderReadyComponent );

      expect(screen.getByDisplayValue(/MockFirstTable/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/MockSecondTable/i)).toBeInTheDocument();
    });

    it('renders a button to call removeTable function', () => {
      render(renderReadyComponent );
      const { result } = renderHook(() => useStore());

      const deleteTableButtons = screen.getAllByTitle(/Delete the table/i)
      expect(deleteTableButtons.length).toBe(2);
      fireEvent.click(deleteTableButtons[0])
      expect(result.current.removeTable).toHaveBeenCalledTimes(1);

    });

    it('renders an input and it calls removeTable function when the input is changed', () => {
      render(renderReadyComponent );
      const { result } = renderHook(() => useStore());

      const inputElement = screen.getByDisplayValue(/MockFirstTable/i) as HTMLInputElement
      expect(result.current.onTableNameChange).toHaveBeenCalledTimes(0);

      fireEvent.change(inputElement, {target: {value: "MockNewTable"}})

      expect(result.current.onTableNameChange).toHaveBeenCalledTimes(1);

    });

    describe('provides drag and drop feature to change the order of tables', () => {
      beforeAll(() => {
        const data: any = {};
        
        const mockDataTransfer = {
          setData: (key: string, value: string) => {data[key] = value},
          getData: (key: string) => data[key],
          setDragImage: jest.fn(),
        };
  
        Object.defineProperty(global.Event.prototype, 'dataTransfer', {
          value: mockDataTransfer,
        });
      })
      
      it('calls the function "moveTable" if the dragged table is dropped on above another table', () => {
        render(renderReadyComponent );
        const { result } = renderHook(() => useStore());
        
        let tableElements =  document.querySelectorAll('[draggable]')
        let table1 = tableElements[0];
        let table2 = tableElements[1];
        
        expect(result.current.moveTable).toHaveBeenCalledTimes(0);

        fireEvent.click(table1);
        fireEvent.dragStart(table1); 
        fireEvent.dragOver(table2);

        const dragOverUpperArea = table2.querySelector("[title='Drag over to locate above']") as HTMLDivElement;
        fireEvent.dragOver(dragOverUpperArea);
        fireEvent.drop(table2);

        expect(result.current.moveTable).toHaveBeenCalledTimes(1);
        expect(result.current.moveTable).toHaveBeenCalledWith("1", "2", DragDirection.upper);
      });

      it('calls the function "moveTable" if the dragged table is dropped on below another table', () => {
        render(renderReadyComponent );
        const { result } = renderHook(() => useStore());
        
        let tableElements =  document.querySelectorAll('[draggable]')
        let table1 = tableElements[0];
        let table2 = tableElements[1];
        
        expect(result.current.moveTable).toHaveBeenCalledTimes(0);

        fireEvent.click(table1);
        fireEvent.dragStart(table1); 
        fireEvent.dragOver(table2);

        const dragOverlowerArea = table2.querySelector("[title='Drag over to locate below']") as HTMLDivElement;
        fireEvent.dragOver(dragOverlowerArea);
        fireEvent.drop(table2);

        expect(result.current.moveTable).toHaveBeenCalledTimes(1);
        expect(result.current.moveTable).toHaveBeenCalledWith("1", "2", DragDirection.lower);
      });

      it('doesn"t call the function "moveTable" if the dragged table exits a drop area', () => {
        render(renderReadyComponent );
        const { result } = renderHook(() => useStore());
        
        let tableElements =  document.querySelectorAll('[draggable]')
        let table1 = tableElements[0];
        let table2 = tableElements[1];
        
        expect(result.current.moveTable).toHaveBeenCalledTimes(0);

        fireEvent.click(table1);
        fireEvent.dragStart(table1); 
        fireEvent.dragOver(table2);
        fireEvent.dragExit(table2);

        expect(result.current.moveTable).toHaveBeenCalledTimes(0);
      });

      it('doesn"t call the function "moveTable" if the dragged table drags on over itself', () => {
        render(renderReadyComponent );
        const { result } = renderHook(() => useStore());
        
        let tableElements =  document.querySelectorAll('[draggable]')
        let table1 = tableElements[0];
        let table2 = tableElements[1];
        
        expect(result.current.moveTable).toHaveBeenCalledTimes(0);

        fireEvent.click(table1);
        fireEvent.dragStart(table1); 
        fireEvent.dragOver(table1);

        expect(result.current.moveTable).toHaveBeenCalledTimes(0);
      });

    });

    it('renders another components', () => {
      render(renderReadyComponent );
      
      expect(screen.getAllByText(/MockTableAttributes/i).length).toBe(2);
      expect(screen.getAllByText(/MockSidebarOptions/i).length).toBe(2);
      expect(screen.getAllByText(/MockAddTableButton/i).length).toBe(1);
    });
    
    it('renders correctly', () => {
      const renderedContainer = render(renderReadyComponent );
      expect(renderedContainer).toMatchSnapshot();
    });


  })  

  describe('if the sidebar is invisible', () => {


    beforeEach(() => {
      useCustomizationStore.setState({ 
        sidebarVisible: false
      })
    });

    it('has a "hidden" class', () => {
      render(renderReadyComponent );

      const asideElement = screen.getAllByText("")[0].getElementsByTagName("aside")[0]
      
      expect(asideElement.classList).toContain("hidden");
    });


    it('renders correctly', () => {
      const renderedContainer = render(renderReadyComponent );
      expect(renderedContainer).toMatchSnapshot();
    });
  })

});