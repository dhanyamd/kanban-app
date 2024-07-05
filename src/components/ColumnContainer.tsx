import TrashIcon from "../icons/TrashIcon";
import { Column, Id } from "../type";
  
interface Props{
    column : Column;
    deleteColumn : (id : Id) => void
}

export default function ColumnContainer(props : Props){
 const {column, deleteColumn} = props 

    return <div className="bg-columnBackgroundColour w-[350px] h-[500px] max-h-[500px] rounded-lg flex flex-col">
        <div className="bg-mainBackgroundColour text-md h-[60px] cursor-grab rounded-md rounded-b-none
         p-3 font-semibold border-columnBackgroundColour border-4 flex items-center justify-between">
        <div className="flex gap-2">
        <div className="flex justify-center items-center bg-columnBackgroundColour px-2 py-1 text-sm rounded-full ">0</div>
        {column.title}
        </div>
        <button onClick={()=>{
            deleteColumn(column.id)
        }} className="stroke-gray-500 hover:stroke-white hover:bg-mainBackgroundColour
        rounded px-1 py-2"><TrashIcon/></button>
        </div>
        <div className="flex flex-grow">
            content
        </div>
        <div>
            footer
        </div>
   </div>

}