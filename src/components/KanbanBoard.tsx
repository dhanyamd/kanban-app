import { useState } from "react"
import PlusIcon from "../icons/Plusicon"
import { Column, Id } from "../type"
import ColumnContainer from "./ColumnContainer"

function KanbanBoard(){
    const[column, setcolumn] = useState<Column[]>([])
    console.log(column)
    return (
        <div className="flex items-center m-auto min-h-screen w-full overflow-x-auto overflow-y-hidden px-[40px]">
            <div className="m-auto flex gap-2">
                <div className="flex gap-2">{column.map((col)=> <ColumnContainer key={col.id} column={col} deleteColumn={deleteColumn}/>)}</div>
            <button  onClick={() => {
                createNewColumn()
            }} className="h-[60px] w-[300px] min-w-[300px] cursor-pointer text-md rounded-lg bg-mainBackgroundColour border-2 bg-columnBackgroundColour p-4
            ring-rose-500 hover:ring-2 flex gap-2"> 
            <PlusIcon/>
             Add column </button>
            </div>

            </div>     
    )

  function createNewColumn(){
    const columnToadd : Column = {
    id : generateId(),
    title: `Column ${column.length + 1}`
    }
    setcolumn([...column, columnToadd])
  } 
  
  function generateId(){
   return  Math.floor(Math.random()*10001)
  }

  function deleteColumn(id: Id){
   const filteredColumns = column.filter((col)=> col.id != id)
   setcolumn(filteredColumns)
  }
}

export default KanbanBoard