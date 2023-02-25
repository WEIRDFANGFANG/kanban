import {data} from "../consts";
import {useState, useRef} from "react";

export const DragNDrop = () => {

    //const tasks and dragging tasks
    const [tasks, setTasks] = useState(data)
    const dragItem = useRef()
    const dragNode = useRef()
    //dragging item

    const [dragging, setDragging] = useState(false)
    const dragStartHandler = (e, params) => {


        dragItem.current = params
        dragNode.current = e.target
        dragNode.current.addEventListener('dragend', handleDragEnd)
        setTimeout(() => {
            setDragging(true)
        }, 0)
    }
    const draggingEnter = (e, params) => {
        const currentItem = dragItem.current
        if(e.target !== dragNode.current){
            setTasks(oldList => {
                let newList = JSON.parse(JSON.stringify(oldList))
                newList[params.groupIndex].items.splice(params.taskIndex,0,newList[currentItem.groupIndex].items
                    .splice(currentItem.taskIndex,1)[0])
                dragItem.current = params
                return newList
            })
        }
    }
    const handleDragEnd = () => {
        setDragging(false)
        dragNode.current.removeAddEventListener('dragend', handleDragEnd)
        dragItem.current = null
        dragNode.current = null

    }

    //dragging item style
    const draggingStyle = (params) => {

        const currentItem = dragItem.current
        if (currentItem.groupIndex === params.groupIndex && currentItem.taskIndex === params.taskIndex) {
            console.log(params)
            return `currentDndItem `
        }

        return `dndItem group${params.groupIndex}`

    }
    return (
        <div className="app">
            <div className="appHeader">

                {tasks.map((item, groupIndex) =>
                    <div className= 'dndGroup'

                    onDragEnter={
                        dragging && !item.items.length? (e) => draggingEnter(e, {groupIndex, taskIndex: 0}):null}
                    >
                        <div className= 'title'> {item.title}</div>
                        <div className='dndItems'>
                            {
                                item.items.map((task, taskIndex) =>
                                    <div
                                        draggable
                                         onDragStart={(e) => {
                                             dragStartHandler(e, {groupIndex, taskIndex})
                                         }}
                                        onDragEnter={dragging? (e) => {draggingEnter(e, {groupIndex, taskIndex})}: null}
                                         className={dragging ? draggingStyle({groupIndex, taskIndex}) : `dndItem group${groupIndex}`}
                                        >


                                        {task}
                                    </div>)


                            }
                        </div>
                    </div>
                )
                }
            </div>

        </div>

    );
}