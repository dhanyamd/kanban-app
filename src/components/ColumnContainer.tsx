import { SortableContext, useSortable } from "@dnd-kit/sortable";
import TrashIcon from "../icons/TrashIcon";
import { Column, Id, Task } from "../type";
import {CSS} from "@dnd-kit/utilities"
import { useMemo, useState } from "react";
import PlusIcon from "../icons/Plusicon";
import TaskCard from "./TaskCard";
  
interface Props{
    column : Column;
    deleteColumn : (id : Id) => void
    updateColumn : (id: Id, title : string) => void
    createTask : (columnId : Id) => void 
    tasks : Task[]
    deleteTask : (id : Id) => void
    updateTask : (id: Id, content : string) => void;
}

export default function ColumnContainer({
    column,
    deleteColumn,
    updateColumn,
    createTask,
    tasks,
    deleteTask,
    updateTask,
  }: Props) {
 const [editmode, setEditMode] = useState(false)

 const TasksIds = useMemo(() => {
    return tasks.map(task => task.id)
 },[tasks])

  const {setNodeRef, transition, attributes, listeners, transform, isDragging} =  useSortable({
        id : column.id,
        data : {
            type : "Column",
            column
        },
        disabled: editmode
     })

     const style = {
        transition,
        transform: CSS.Transform.toString(transform)
     }

     if(isDragging){
        return (
            <div ref={setNodeRef} style={style} 
            className="bg-columnBackgroundColour w-[350px] h-[500px] max-h-[500px]
             rounded-lg flex flex-col opacity-40 border-2 border-rose-500">
            </div>
        )
       
     }


    return <div ref={setNodeRef} style={style} className="bg-columnBackgroundColour w-[350px] h-[500px] max-h-[500px] rounded-lg flex flex-col">
        <div
        {...attributes}
        {...listeners}
        onClick={()=> {
            setEditMode(true)
        }}
         className="bg-mainBackgroundColour text-md h-[60px] cursor-grab rounded-md rounded-b-none
         p-3 font-semibold border-columnBackgroundColour border-4 flex items-center justify-between">
        <div className="flex gap-2">
        <div className="flex justify-center items-center bg-columnBackgroundColour px-2 py-1 text-sm rounded-full ">0</div>
              {!editmode &&  column.title}
              {editmode && <input className="bg-black border-rose-500 border-rounded outline-none px-2"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
               autoFocus
                onBlur={()=> {
                setEditMode(false)
              }}
              onKeyDown={(e)=> {
                if(e.key !== "Enter") return
                 setEditMode(false)
              }}
              />}
        </div>
        <button onClick={()=>{
            deleteColumn(column.id)
        }} className="stroke-gray-500 hover:stroke-white hover:bg-mainBackgroundColour
        rounded px-1 py-2"><TrashIcon/></button>
        </div>
        <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={TasksIds}>
            {tasks.map((task)=> (
                <TaskCard key={task.id} task={task} updateTask={updateTask} deleteTask={deleteTask}/>
            ))}
            </SortableContext>
        </div>
            <button className="flex gap-2 items-center border-columnBackgroundColor border-1 rounded-md p-4 
            border-x-columnBackgroundColor hover:bg-black hover:text-rose-500 active:bg-black" 
            onClick={()=> {
                createTask(column.id)
            }}>
                <PlusIcon/>
                Add Task
                </button>
   </div>

}

