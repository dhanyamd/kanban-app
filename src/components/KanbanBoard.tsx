import { useState, useMemo } from "react"
import PlusIcon from "../icons/Plusicon"
import { Column, Id } from "../type"
import ColumnContainer from "./ColumnContainer"
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext } from "@dnd-kit/sortable"
import { createPortal } from "react-dom"

function KanbanBoard(){
    const[column, setcolumn] = useState<Column[]>([])
    const columnsId = useMemo(()=> column.map((col)=> col.id),[column])
    const [activeColumn, setactiveColumn] = useState<Column | null>(null)

    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 10,
        },
      })
    );

    return (
        <div className="flex items-center m-auto min-h-screen w-full overflow-x-auto overflow-y-hidden px-[40px]">
          <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} sensors={sensors}>
            <div className="m-auto flex gap-2">
                <div className="flex gap-2">
                  <SortableContext items={columnsId}>
                  {column.map((col)=> <ColumnContainer key={col.id} column={col} deleteColumn={deleteColumn}/>)}
                  </SortableContext>
                  </div>
            <button  onClick={() => {
                createNewColumn()
            }} className="h-[60px] w-[300px] min-w-[300px] cursor-pointer text-md rounded-lg bg-mainBackgroundColour border-2 bg-columnBackgroundColour p-4
            ring-rose-500 hover:ring-2 flex gap-2"> 
            <PlusIcon/>
             Add column </button>
            </div>
            {createPortal (
              <DragOverlay>
                {activeColumn && (
                  <ColumnContainer
                    column={activeColumn} deleteColumn={deleteColumn} />
                )}
              </DragOverlay>,
              document.body
            )}
            </DndContext>

            </div>     
    )

  function createNewColumn(){
    const columnToadd : Column = {
    id : generateId(),
    title: `Column ${column.length + 1}`
    }
    setcolumn([...column, columnToadd])
  } 

  function onDragStart(event : DragStartEvent){
    console.log("drag start", event)
    if(event.active.data.current?.type === "Column"){
      setactiveColumn(event.active.data.current?.column)
      return
    }
  }

  function onDragEnd(event : DragEndEvent){
   const {active, over} = event;

   const ActiveColumnId = active?.id;
   const OverColumnId = over?.id;

   const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;


   if(ActiveColumnId === OverColumnId) return 

   setcolumn((columns) => {
    const activeColumnIndex = columns.findIndex((col) => col.id === ActiveColumnId);

    const overColumnIndex = columns.findIndex((col) => col.id === OverColumnId);

    return arrayMove(columns, activeColumnIndex, overColumnIndex);
  });

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


