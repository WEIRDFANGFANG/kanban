import {data} from "../consts";
import {useState, useRef} from "react";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export const DragNDrop = () => {

    //const tasks and dragging tasks
    const [tasks, setTasks] = useState(data)
    console.log(tasks)
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
        if (e.target !== dragNode.current) {
            setTasks(oldList => {
                let newList = JSON.parse(JSON.stringify(oldList))
                newList[params.groupIndex].items.splice(params.taskIndex, 0, newList[currentItem.groupIndex].items
                    .splice(currentItem.taskIndex, 1)[0])
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
    // add task
    const [task, setTask] = useState('')
    console.log(task)
    const addTask = (newTask) => {

        newTask ? setTasks(oldList => {
                let newList = JSON.parse(JSON.stringify(oldList))
                newList[0].items.push(task)
                return newList

            }
        ) : alert('please input a valid task name')
    }
    const inputNewTask = (e, newTask) => {

        e.code === 'Enter' && setTasks(oldList => {
                let newList = JSON.parse(JSON.stringify(oldList))
                newList[0].items.push(task)
                return newList

            }
        )
        e.code === 'Enter' && !newTask && alert('please input a valid task name')
    }
    //delete item
    const deleteItem = (params) => {
        setTasks(oldList => {
            let newList = JSON.parse(JSON.stringify(oldList))
            newList[params.groupIndex].items.splice(params.taskIndex, 1)


            return newList
        })
    }


    return (
        <div className="app">
            <div className="addTask">

                <input type="text" name="task" placeholder="add a new task here"
                       onChange={e => setTask(e.target.value)} onKeyDown={(e) => inputNewTask(e, task)}/>
                <button onClick={() => addTask(task)}>Add task</button>
            </div>
            <div className="appHeader">
                {/*add tack*/}

                {/*kanban board*/}
                {tasks.map((item, groupIndex) =>
                    <div className='dndGroup'

                         onDragEnter={
                             dragging && !item.items.length ? (e) => draggingEnter(e, {
                                 groupIndex,
                                 taskIndex: 0
                             }) : null}
                    >
                        <div className='title'> {item.title}</div>
                        <div className='dndItems'>
                            {
                                item.items.map((task, taskIndex) =>
                                    <div
                                        draggable
                                        onDragStart={(e) => {
                                            dragStartHandler(e, {groupIndex, taskIndex})
                                        }}
                                        onDragEnter={dragging ? (e) => {
                                            draggingEnter(e, {groupIndex, taskIndex})
                                        } : null}
                                        className={dragging ? draggingStyle({
                                            groupIndex,
                                            taskIndex
                                        }) : `dndItem group${groupIndex}`}
                                    >


                                        <div>{task}</div>
                                        <div><DeleteForeverIcon color= 'grey' onClick={() => deleteItem({groupIndex, taskIndex})}/></div>
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