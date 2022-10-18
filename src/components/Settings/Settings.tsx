import useCustomizationStore from '@/zustandStore/customizationStore';
import { memo } from 'react';
import { MainColorDropdown } from '@/components';
export const Settings = memo(() => {
  
  const locationSidebar = useCustomizationStore(store => store.locationSidebar)
  const showTextOnEdges = useCustomizationStore(store => store.showTextOnEdges)
  const toggleLocationSidebar = useCustomizationStore(store => store.toggleLocationSidebar)
  const toggleTextMode = useCustomizationStore(store => store.toggleTextMode)
  const toggleDarkMode = useCustomizationStore(store => store.toggleDarkMode)

  return (
    <details open className='mt-8 [&>summary>span:nth-child(1)]:open:hidden [&>summary>span:nth-child(2)]:open:inline '>
      <summary className='btn-third'>
        <span>Show menu</span>
        <span className='hidden'>Hide menu</span> 
      </summary>
      <div className='mt-8 flex-col flex'>
        <label className='flex mb-5 cursor-pointer'>
          <input className='mr-6' type="checkbox" checked={ showTextOnEdges} onChange={toggleTextMode}/>
          Show Association Names
        </label>
        <label className='flex mb-5 cursor-pointer'>
          <input className='mr-6' type="checkbox" checked={ locationSidebar === "right"} onChange={toggleLocationSidebar}/>
          Show the sidebar at the right of the window
        </label>
        <MainColorDropdown />
        <button className="btn-second rounded-md my-2 p-2" onClick={toggleDarkMode}>
          Dark Mode
        </button>
      </div>
    </details>
  )
})