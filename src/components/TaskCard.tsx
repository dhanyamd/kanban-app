import { useState } from "react"
import TrashIcon from "../icons/TrashIcon"
import { Id, Task } from "../type"

interface Props{
    task : Task
    deleteTask : (id : Id) => void
}

export const TaskCard = ({task, deleteTask}: Props) => {
    const[MouseIsOver, setMouseIsOver] = useState(false)
    const[editmode, setEditMode] = useState(false)
  
    const toggleEdits = () => {
        setEditMode((prev)=> !prev)
        setMouseIsOver(false)
    }

  return <div
    onClick={toggleEdits}
   className="bg-mainBackgroundColour p-2.5 h-[100px] min-h-[100px] flex text-left items-center
    rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative"
    onMouseEnter={()=> {
        setMouseIsOver(true)
    }}
    onMouseLeave={() => {
        setMouseIsOver(false)
    }}
    >
                {task.content}
        {MouseIsOver && ( 
        <button onClick={() => {
            deleteTask(task.id)
        }} className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBackgroundColour
         p-2 rounded opacity-60 hover:opacity-100">
            <TrashIcon/>
        </button>
        )}
       </div>
}

