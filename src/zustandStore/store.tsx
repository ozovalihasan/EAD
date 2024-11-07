import {
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  NodeRemoveChange,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
} from '@xyflow/react';
import create from 'zustand';

import { createOrderedTables, entityNodePartial, getProjectNameFromFile, hasManyEdgePartial, HasManyEdgePartialType, hasOneEdgePartial, HasOneEdgePartialType, throughEdgePartial, ThroughEdgePartialType, update_data } from '@/zustandStore';
import produce from "immer";
import { devtools } from 'zustand/middleware';
import initialEdges from './edges';
import initialNodes from './nodes';
import initialTables from './tables';

export const initialIdCounter = (initialTables: TablesType, initialNodes: Node[], initialEdges: Edge[]): number => {

  let ids = ["0"]
  ids = ids.concat(Object.keys(initialTables))
  Object.keys(initialTables).map(( tableId )=> ids = ids.concat( Object.keys(initialTables[tableId].attributes)))
  ids = ids.concat(Object.keys(initialNodes))
  ids = ids.concat(Object.keys(initialEdges))
  
  const integer_ids = ids.map(id => parseInt(id))
  const max = Math.max( ...integer_ids )
  
  return (max + 1)
}

export enum DragDirection {
  upper = "upper",
  lower = "lower"
}

export type AttributesType = Record<string, {
  name: string;
  type: string;
}>;

export interface TableValueType {
  name: string;
  attributes: AttributesType;
  superclassId: string;
  }

export type TablesType = Record<string, TableValueType>;

export type EntityNodeDataType = {
  tableId: string,
  name: string,
};

export type EntityNodeType = Node<EntityNodeDataType> & (typeof entityNodePartial);

export type HasOneEdgeDataType = { optional: boolean }; 
export type HasOneEdgeType = Pick<Edge<HasOneEdgeDataType>, "id" | "source" | "target" | "sourceHandle" | "targetHandle" | "selected"> & Required<Pick<Edge<HasOneEdgeDataType>, "data">> & HasOneEdgePartialType

export type HasManyEdgeDataType = { optional: boolean };
export type HasManyEdgeType = Pick<Edge<HasManyEdgeDataType>, "id" | "source" | "target" | "sourceHandle" | "targetHandle" | "selected"> & Required<Pick<Edge<HasManyEdgeDataType>, "data">> & HasManyEdgePartialType

export type ThroughEdgeDataType = { throughNodeId: string };
export type ThroughEdgeType = Pick<Edge<ThroughEdgeDataType>, "id" | "source" | "target" | "sourceHandle" | "targetHandle" | "selected"> & Required<Pick<Edge<ThroughEdgeDataType>, "data">> & ThroughEdgePartialType

export type HasAnyEdgeType = HasOneEdgeType | HasManyEdgeType
export type CustomEdgeType = HasAnyEdgeType | ThroughEdgeType;
export type  EdgeTypesType = CustomEdgeType["type"];
export type  EdgeBaseType = Omit<CustomEdgeType, "label" | "type" | "data">;

export type AlertType = {message: string, type: "success" | "error"};

export interface State {
  version: string;
  idCounter: number;
  nodes: EntityNodeType[];
  edges: CustomEdgeType[];
  tables: TablesType;
  orderedTables: (keyof TablesType)[];
  connectionStartNodeId: string | null;
  isConnectContinue: boolean;
  isMouseOnNode: boolean;
  isMouseOnEdge: boolean;
  selectedNodeIdForThrough: string | null;
  mouseOnEdgeId: string | null;
  mouseOnNodeId: string | null;
  associationType: CustomEdgeType["type"];
  needFitView: boolean,
  projectName: string;
  alertMessages: {[id: string]: AlertType};
  onNodeMouseEnter: (_: React.MouseEvent, node: Node) => void;
  onEdgeMouseEnter: (_: React.MouseEvent, edge: Edge) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onMouseEnterThrough: (nodeId: string) => void;
  onChangeAssociationType: (associationType: CustomEdgeType["type"], id: string) => void;
  onTableNameChange: (event: React.ChangeEvent<HTMLInputElement>, tableId: string) => void;
  onAttributeNameChange: (event: React.ChangeEvent<HTMLInputElement>, tableId: string, attributeId: string) => void;
  onAttributeTypeChange: (event: React.ChangeEvent<HTMLSelectElement>, tableId: string, attributeId: string) => void;
  addNode: (node: EntityNodeType) => void;
  changeTableSuperClass: (event: React.ChangeEvent<HTMLSelectElement>, tableId: string) => void;
  addTable: () => void;
  addAttribute: (tableId: string ) => void;
  removeAttribute: (tableId: string, attributeId: string ) => void;
  removeTable: (tableId: string ) => void;
  increaseIdCounter: () => void;
  onConnectStart: () => void;
  onConnectEnd: () => void;
  onNodeMouseLeave: () => void;
  onEdgeMouseLeave: () => void;
  onNodeTableChange: (value: string, nodeId: string) => void;
  onNodeInputChange: (event: React.ChangeEvent<HTMLInputElement>, nodeId: string) => void;
  resetStore: () => void;
  uploadStore: (event: React.ChangeEvent<HTMLInputElement>) => void;
  toggleNeedFitView: () => void;
  moveTable: (draggedTableId: string, tableId: string, dragDirection: DragDirection) => void;
  reorderAllTables: () => void;
  toggleOptional: (edgeId: string) => void;
  onChangeProjectName: (val: string) => void;
  addAlert: (message: string, type: "success" | "error") => void;
  deleteAlert: (id: string) => void;

}

export const useStore = create(devtools<State>((set, get) => ({
    version: "0.4.7",
    idCounter: initialIdCounter(initialTables, initialNodes, initialEdges) ,
    associationType: hasOneEdgePartial.type as CustomEdgeType['type'],

    nodes: initialNodes,
    edges: initialEdges,
    tables: initialTables,
    orderedTables: createOrderedTables(initialTables),
    connectionStartNodeId: null,
    isConnectContinue: false,
    isMouseOnNode: false,
    isMouseOnEdge: false,
    mouseOnNodeId: null,
    mouseOnEdgeId: null,
    selectedNodeIdForThrough: null,
    needFitView: false,
    projectName: "",

    alertMessages: {},

    onConnectStart: (() => {
      set({
        isConnectContinue: true
      })
    }),

    onConnectEnd: (() => {
      set({
        isConnectContinue: false,
        selectedNodeIdForThrough: null
      })
    }),

    onEdgeMouseEnter: ((_: React.MouseEvent, edge: Edge) => {
      if (!get().isConnectContinue){
        set({
          isMouseOnEdge: true,
          mouseOnEdgeId: edge.id
        })
      }
    }),

    onEdgeMouseLeave: (() => {
      if (!get().isConnectContinue){
        set({
          isMouseOnEdge: false,
          mouseOnEdgeId: null
        })
      }
    }),

    onNodeMouseEnter: ((_: React.MouseEvent, node: Node) => {
      set({
        isMouseOnNode: true,
        mouseOnNodeId: node.id
      })
    }),

    onNodeMouseLeave: (() => {
      set({
        isMouseOnNode: false,
        mouseOnNodeId: null
      })
    }),

    onTableNameChange: ((event: React.ChangeEvent<HTMLInputElement>, tableId: string) => {
      set(
        produce((state: State) => {
          state.tables[tableId].name = event.target.value
        })
      );
    }),

    onAttributeNameChange: ((event: React.ChangeEvent<HTMLInputElement>, tableId: string, attributeId: string) => {
      set(
        produce((state: State) => {
          state.tables[tableId].attributes[attributeId].name = event.target.value
        })
      );
    }),

    onAttributeTypeChange: ((event: React.ChangeEvent<HTMLSelectElement>, tableId: string, attributeId: string) => {
      set(
        produce((state: State) => {
          state.tables[tableId].attributes[attributeId].type = event.target.value
        })
      );
    }),

    addTable: (() => {
      set(produce((state: State) => {
        state.tables[get().idCounter.toString()] = {name: "", attributes: {}, superclassId: ""};
        state.orderedTables.push(get().idCounter.toString());
        state.idCounter ++;

      }))
    }),

    changeTableSuperClass : ((event: React.ChangeEvent<HTMLSelectElement>, tableId: string) => {
      set(
        produce((state: State) => {
          state.tables[tableId].superclassId = event.target.value
        })
      )
    }),

    addAttribute: ((tableId: string ) => {
      set(produce((state: State) => {
        state.tables[tableId].attributes[get().idCounter.toString()] = {name: "", type: "string"},
        state.idCounter ++
      }))
    }),

    removeAttribute: ((tableId: string, attributeId: string ) => {
      set(produce((state: State) => {
        delete state.tables[tableId].attributes[attributeId]
      }))
    }),

    removeTable: ((tableId: string ) => {
      set(produce((state: State) => {
        delete state.tables[tableId]
        state.orderedTables = state.orderedTables.filter((checkedTableId) => checkedTableId !== tableId )

        state.nodes = state.nodes.filter((node) => {
          state.edges = state.edges.filter((edge: CustomEdgeType) => (

            node.data.tableId !== tableId ||
            (
              (edge.source !== node.id) &&
              (edge.target !== node.id) &&
              (edge.type !== "through" || (edge as ThroughEdgeType).data?.throughNodeId !== node.id)
            )

          ))
          return (node.data.tableId !== tableId)
        })

        Object.values(state.tables).forEach(table => {
          if (table.superclassId === tableId){
            table.superclassId = ""
          }
        })
      }))
    }),

    onNodeTableChange: (
      (value: string, nodeId: string) => {
        set(produce((state: State) => {
          const node: EntityNodeType = (state.nodes.find(node => node.id === nodeId))!
          node.data.tableId = value
        }))
      }

    ),
    increaseIdCounter: (() =>{
      set({
          idCounter: get().idCounter + 1
      })
    }),

    onNodeInputChange: (event: React.ChangeEvent<HTMLInputElement>, nodeId: string) =>{

      set(produce((state: State) => {
        const node: EntityNodeType = (state.nodes.find(node => node.id === nodeId))!
        node.data.name = event.target.value
      }))
    },

    addNode: (node: EntityNodeType) =>{
      set({
          nodes: get().nodes.concat(node),
      })
    },

    onNodesChange: (changes: NodeChange[]) => {
      let edges = get().edges
      if (changes[0].type === "remove"){
        edges = get().edges.filter((edge) => edge.type !== 'through' || (edge as ThroughEdgeType).data?.throughNodeId !== (changes[0] as NodeRemoveChange).id)
      }

      set({
        nodes: applyNodeChanges(changes, get().nodes) as EntityNodeType[],
        edges: edges,
      });
    },
    
    onEdgesChange: (changes: EdgeChange[]) => {

      set({
        edges: applyEdgeChanges(changes, get().edges) as CustomEdgeType[],
      });

    },

    onMouseEnterThrough: (nodeId: string) => {
      set({
        selectedNodeIdForThrough: nodeId
      })
    },

    onConnect: (connection: Connection) => {
      const id = get().idCounter
      const edgeBase: EdgeBaseType = {
        id: id.toString(),
        source: connection.source!,
        target: connection.target!,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
      }

      const addEdge = (edge: CustomEdgeType) => set({
        edges: get().edges.concat(edge),
        idCounter: get().idCounter + 1,
        selectedNodeIdForThrough: null,
      })

      if (get().associationType === hasOneEdgePartial.type){

        const edge: HasOneEdgeType = {
          ...edgeBase,
          ...hasOneEdgePartial,
          data:{
            optional: false
          }
        }

        addEdge(edge)

      } else if (get().associationType === hasManyEdgePartial.type) {
        const edge: HasManyEdgeType = {
          ...edgeBase,
          ...hasManyEdgePartial,
          data:{
            optional: false
          }
        }

        addEdge(edge)

      } else {
        const selectedNodeIdForThrough = get().selectedNodeIdForThrough
        if (selectedNodeIdForThrough === null){
          alert("It is necessary to select a node to define through association.");
          return
        }

        const edge: ThroughEdgeType = {
          ...edgeBase,
          ...throughEdgePartial,
          data: {
            throughNodeId: get().selectedNodeIdForThrough!
          },
        }

        addEdge(edge)

      }
    },

    onChangeAssociationType: (associationType, id) =>{
      set({
        associationType: associationType,
        connectionStartNodeId: id
      });
    },

    resetStore: () => {
      if (window.confirm("EAD will be reset permanently?")){

        set({
          idCounter: 1,
          tables: {},
          nodes: [],
          edges: [],
          orderedTables: []
        })
      }

    },

    toggleNeedFitView: () => {
      set({
        needFitView: !get().needFitView
      })
    },

    toggleOptional: (edgeId) => {
      const edges = get().edges;
      const edge: CustomEdgeType = (edges.find(edge => edge.id === edgeId))!;

      if (edge.type === throughEdgePartial.type) {
        return;
      }

      const index: number = edges.indexOf(edge);

      set(produce((state: State) => {

        (state.edges[index] as HasAnyEdgeType).data.optional = !edge.data.optional
      }))
    },

    moveTable: (draggedTableId, droppedTableId, dragDirection) => {
      set(produce((state: State) => {
        let orderedTables = state.orderedTables;

        const draggedTableIndex = orderedTables.findIndex((tableId) => tableId === draggedTableId);
        orderedTables.splice(draggedTableIndex, 1);

        const droppedTableIndex = orderedTables.findIndex((tableId) => tableId === droppedTableId);

        if (dragDirection === DragDirection.upper){
          orderedTables.splice(droppedTableIndex, 0, draggedTableId);
        } else {
          orderedTables.splice(droppedTableIndex + 1, 0, draggedTableId);
        }

        state.orderedTables = orderedTables
      }))
    },

    reorderAllTables: () => {
      const tables = get().tables
      const moveTable = get().moveTable
      Object.keys(get().tables).map((checkedTableId: string) => {
        if (tables[checkedTableId].superclassId === ""){ return }

        moveTable(checkedTableId, tables[checkedTableId].superclassId, DragDirection.lower)
      })
    },

    uploadStore: (event: React.ChangeEvent<HTMLInputElement>) => {
      
      const file = event.target.files?.[0];
      if (!file) {
        alert("No file selected.");
        return;
      }
      
      const projectName = getProjectNameFromFile(file);
      
      if (!projectName) {
        
        get().addAlert("It is not detected the name of your file. Please check your file.", "error");
        return;
      }
      
      const fileReader = new FileReader();
      fileReader.onload = (event: ProgressEvent<FileReader>) => {
        
        if (event.target && (typeof event.target.result === 'string')){
          let data: State = JSON.parse(event.target.result) as State;

          if (["0.4.0", "0.4.1", "0.4.2", "0.4.3", "0.4.4", "0.4.5", "0.4.6", "0.4.7"].includes(data.version)) {

            set( update_data(data) )
            set({
              needFitView: true,
              projectName: projectName
            })

          } else {
            get().addAlert(`The version of your file is v${data.version}. It is not compatible with the version used(v0.4.7).`, "error");
          }

        } else {

          get().addAlert("An invalid file is installed. Please check your file.", "error");
        }
      };
      
      fileReader.readAsText(file, 'UTF-8');
    },

    onChangeProjectName: (val) => {
      set({
        projectName: val
      })
    },

    addAlert: (message: string, type: "success" | "error") => {
      const id = get().idCounter.toString();
      set(produce((state: State) => {
        state.alertMessages[id] = {message, type}
      }));
      get().increaseIdCounter();
    },

    deleteAlert: (id: string) => {
      
      set(produce((state: State) => {
        delete state.alertMessages[id]
      }))

    }

  })
));
