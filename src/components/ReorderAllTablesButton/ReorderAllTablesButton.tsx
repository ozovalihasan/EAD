import { useStore } from '@/zustandStore';
import { AlignItems } from "@/icons";

export const ReorderAllTablesButton = () => {
  const reorderAllTables = useStore(store => store.reorderAllTables)

  return (
    <button
      className="p-1 mt-2 btn-first rounded-full aspect-square h-10"
      title="Reorder all tables"
      onClick={reorderAllTables}
    >
      <div className="stroke-[40] w-5 h-5 fill-first-400">
        <AlignItems />
      </div>
    </button>
  );

}
