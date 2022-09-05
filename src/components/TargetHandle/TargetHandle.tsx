import { Handle, Position } from "react-flow-renderer"
import useStore from '@/zustandStore/store';

export const TargetHandle = ({nodeId} : {nodeId: string}) => {
  
  const visibleTargetHandle = useStore(store => (
    store.isConnectContinue && 
    store.connectionStartNodeId !== nodeId && 
    (
      store.associationType !== "through" || 
      (
        store.selectedNodeIdForThrough && 
        store.selectedNodeIdForThrough !== nodeId
      )
    )
  ))

  return (
    <Handle 
      id="top"
      className={`border-none w-full h-full my-1 rounded-none opacity-20 hover:bg-first-500 z-10 ${(visibleTargetHandle) ? "visible" : "hidden"}`} 
      type="target" 
      position={Position.Top} 
    />
  )
}
