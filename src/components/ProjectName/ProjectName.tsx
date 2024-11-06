import { useStore } from '@/zustandStore';
import { memo } from 'react';

export const ProjectName = memo(() => {
  const projectName = useStore(store => store.projectName)
  const onChangeProjectName = useStore(store => store.onChangeProjectName)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeProjectName(e.target.value)
  }

  return (
    <div className='flex flex-col'>
      <label htmlFor="projectName">Project Name </label>
      <input id="projectName" className="p-1 rounded-md ring-0 ring-offset-0 w-auto" placeholder='EAD(default)'  type="text" onChange={e => handleChange(e)} value={projectName}/>
    </div>
  )
})