import { useState, useMemo } from "react"
import PlusIcon from "../icons/Plusicon"
import { Column, Id, Task } from "../type"
import ColumnContainer from "./ColumnContainer"
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext } from "@dnd-kit/sortable"
import { createPortal } from "react-dom"
import TaskCard from "./TaskCard"

function KanbanBoard(){
    const[column, setcolumn] = useState<Column[]>([])
    const columnsId = useMemo(()=> column.map((col)=> col.id),[column])
    const [activeColumn, setactiveColumn] = useState<Column | null>(null)
    const [tasks, setTasks] = useState<Task[]>([])
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 10,
        },
      })
    );

    return (
        <div className="flex items-center m-auto min-h-screen w-full overflow-x-auto overflow-y-hidden px-[40px]">
          <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} sensors={sensors} onDragOver={onDragOver}>
            <div className="m-auto flex gap-2">
                <div className="flex gap-2">
                  <SortableContext items={columnsId}>
                  {column.map((col)=> <ColumnContainer key={col.id} 
                  column={col} deleteColumn={deleteColumn}
                   updateColumn={updateColumn}
                   createTask={createTask}
                   deleteTask={deleteTask}
                   updateTask={updateTask}
                   tasks = {tasks.filter((task)=> task.columnId === col.id)}
                   />)}
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
                    column={activeColumn} deleteColumn={deleteColumn}
                     updateColumn={updateColumn}
                    createTask={createTask}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                    tasks={tasks.filter(
                      (task) => task.columnId === activeColumn.id
                    )}
                    />
                )}
                {activeTask && <TaskCard task={activeTask} deleteTask={deleteTask} updateTask={updateTask}/>}
              </DragOverlay>,
              document.body
            )}
            </DndContext>

            </div>     
    )

function updateTask(id: Id, content: string) {
  const newTasks = tasks.map((task)=> {
    if (task.id !== id) return task
        return {...task, content}
       })
      setTasks(newTasks)
}

 function deleteTask(id: Id){
      const newTasks = tasks.filter((task)=> task.id !== id)
       setTasks(newTasks)

    }

  function createTask(columnId : Id){
    const newTasks: Task = {
      id : generateId(),
      columnId,
      content : `Task ${tasks.length + 1}`  
    }
    setTasks([...tasks, newTasks])
  }

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
    if(event.active.data.current?.type === "Task"){
      setActiveTask(event.active.data.current?.task)
      return
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          // Fix introduced after video recording
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;
        console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setactiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    console.log("DRAG END");

    setcolumn((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }


  function updateColumn(id: Id, title: string) {
    const newColumns = column.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });
  
    setcolumn(newColumns);
  }
 


  
  function generateId(){
   return  Math.floor(Math.random()*10001)
  }

  function deleteColumn(id: Id){
   const filteredColumns = column.filter((col)=> col.id != id)
   setcolumn(filteredColumns)

   const newTasks = tasks.filter((t)=> t.columnId !== id)
   setTasks(newTasks)
  }
  
}

export default KanbanBoard




