import { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Node,
  ReactFlowInstance,
  Controls
} from 'react-flow-renderer';

import useStore from '@/zustandStore/store';
import useCustomizationStore from '@/zustandStore/customizationStore';

import {
  Sidebar, 
  EntityNode,
  EntityNodeDataType,
  HasManyEdge,
  HasOneEdge,
  ThroughEdge,
  ConnectionLine,
  Navbar,
  UpArrow,
  AngleDown,
  SidebarHandler,
} from "@/components"

const nodeTypes = {
  entity: EntityNode,
};
const edgeTypes = {
  hasMany: HasManyEdge,
  hasOne: HasOneEdge,
  through: ThroughEdge,
};

export const App = () => {
  
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect, 
    addNode, 
    onConnectStart, 
    onConnectEnd, 
    onNodeMouseEnter, 
    onNodeMouseLeave,
    onEdgeMouseEnter, 
    onEdgeMouseLeave,
  } = useStore();

  const {
    locationSidebar,
    navbarVisible,
    toggleNavbarVisibility,
  } = useCustomizationStore()
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<any, any> | null>(null);


  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      let reactFlowBounds: DOMRect = (reactFlowWrapper.current as HTMLDivElement).getBoundingClientRect();
      
      const type = event.dataTransfer.getData('application/reactflow');
      const tableId = event.dataTransfer.getData('tableId');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      let position: {x: number, y: number} = (reactFlowInstance as ReactFlowInstance).project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

      
      let name = useStore.getState().tables[tableId].name;

      const newNode: Node<EntityNodeDataType> = {
        id: useStore.getState().idCounter.toString(),
        type: "entity",
        position,
        data: { tableId, name },
      };
      

      addNode(newNode);
    },
    [reactFlowInstance]
  );

  return (

    <div className="text-first-500 font-default  bg-first-50 flex flex-col h-screen">
      <Navbar />
      <div  className={`h-[calc(100vh-5rem)] w-screen  flex flex-grow ${locationSidebar == "left" ? "flex-row" : "flex-row-reverse"}`}>
  
          
        <Sidebar />
        <SidebarHandler />
        <div className="h-full flex-grow relative" ref={reactFlowWrapper}>
          <ReactFlowProvider>      
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onConnectStart={onConnectStart}
              onConnectEnd={onConnectEnd}
              onNodeMouseEnter={onNodeMouseEnter}
              onNodeMouseLeave={onNodeMouseLeave}
              onEdgeMouseEnter={onEdgeMouseEnter}
              onEdgeMouseLeave={onEdgeMouseLeave}
              onDragOver={onDragOver}
              edgeTypes={edgeTypes}
              deleteKeyCode={"Delete"}
              connectionLineComponent={ConnectionLine }
              elevateEdgesOnSelect={true}
              fitView
              nodeTypes={nodeTypes}
              snapToGrid={true}
            >
              <Controls />
              
            </ReactFlow>
          </ReactFlowProvider>
          <button 
            title="Click to show/hide the navbar" 
            className="absolute left-0 top-0 h-3 w-3 z-50 m-2" 
            onClick={toggleNavbarVisibility} 
          >
            {
              navbarVisible ? <UpArrow /> : <AngleDown />
            }
          </button>
        </div>
      
      </div>
    </div>

  )
}