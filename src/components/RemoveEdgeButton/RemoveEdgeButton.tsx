import { useStore } from '@/zustandStore';
import { XMark } from "@/icons";

export interface RemoveEdgeButtonType {
  edgeId: string
}

export const RemoveEdgeButton = ({edgeId}: RemoveEdgeButtonType) => {

  const onEdgesChange = useStore(store => store.onEdgesChange);
  
  
  return (
    <button className="btn-first w-6 h-6 border-none rounded-full" onClick={() => onEdgesChange(
      [
        {
          id: edgeId,
          type: 'remove',
        }
      ]
    )} >
      <div className="absolute stroke-[40] w-3 h-3">
        <XMark />
      </div>
    </button>
  )
}