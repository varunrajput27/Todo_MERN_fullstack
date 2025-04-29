import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router';
import axios from 'axios'


const Todoapp = () => {
    const [username, setUsername] = useState(() => localStorage.getItem('username') || '');
    const [data, setData] = useState("");
    const [tasks, setTasks] = useState([]);
    const [deletecolor, setDeleteColor] = useState(null);
    const [showloader, setShowLoader] = useState(false);
    const navigate = useNavigate();

    // to get all field automatically
    useEffect(() => {
        if (username) {
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/field?username=${username}`)
                .then(response => {

                    setTasks(response.data.tasks || []);
                })
                .catch(error => {
                    console.error('Error fetching tasks:', error);
                });
        }
    }, [username]);


    // to delete the task
    const handlesubmit = (e) => {
        if (data.trim() !== '') {
            axios.post(`${import.meta.env.VITE_BACKEND_URL}/field`, { username, tasks: [{ text: data, completed: false }] })
                .then(() => {
                    setTasks(prev => [...prev, { text: data, completed: false }]);
                    setData('');

                })
                .catch((error) => {
                    console.log("Error adding task");
                });
        }
    };

    // to complete the taks and occur line on task
    const taskComplete = (index) => {
        const newTasks = [...tasks];
        const task = newTasks[index];

        // Toggle the completed status
        task.completed = !task.completed;

        // Update the tasks state (Frontend)
        setTasks(newTasks);

        // Send the updated task completion status to the backend
        axios.put(`${import.meta.env.VITE_BACKEND_URL}/field/update-task`, {
            username: username,  // Pass username to identify the user
            taskText: task.text,  // Pass task text to identify the task
            completed: task.completed,  // Send the new completed status
        })
            .then(response => {
                console.log("Task completion status updated");
            })
            .catch((error) => {
                console.log("Error updating task completion status:", error);
            });
    };



    // to delete the task
    const taskdelete = (index) => {
        const taskToDelete = tasks[index];
        axios.delete(`${import.meta.env.VITE_BACKEND_URL}/field`, {
            data: {
                username: username,
                taskText: taskToDelete.text,
            }
        })
            .then(() => {

                setDeleteColor(index);
                setTimeout(() => {
                    const newTasks = [...tasks];
                    newTasks.splice(index, 1);
                    setTasks(newTasks);
                    setDeleteColor(null);
                }, 200);
            })
            .catch((error) => {
                console.log("Error deleting task:", error);
            });
    };



    // to enter and get task 
    const handlekeydown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            handlesubmit();
        }
    }

    const exit = () => {
        setShowLoader(true);
        setTimeout(() => {
            navigate('/');
            setShowLoader(false)
        }, 2000)
    }

    return (
        <>
            <div className='bg-zinc-950 h-screen flex justify-center items-start'>



                <div className='w-96  h-150 p-6  mt-7 shadow-lg rounded-2xl bg-gray-900/50 border border-gray-800 relative '>
                    {showloader && (
                        <div className='absolute inset-0 bg-black/80 rounded-2xl flex flex-col justify-center items-center'>
                            <div className='w-16 h-16 rounded-full border-4 border-dashed border-purple-700 border-t-transparent animate-spin'>
                            </div>
                            <p className="mt-4 text-purple-400 text-lg font-semibold">Logging out...</p>
                        </div>

                    )}
                    <p className='text-2xl font-semibold text-purple-700 text-center mb-4'>welcome ,{username}</p>
                    <h1 className='text-2xl font-semibold text-white text-center mb-3'>Todo List</h1>



                    <div className='flex gap-2  mb-4  justify-center items-center'>
                        <input
                            type="text"
                            value={data}
                            placeholder="Enter task.."
                            className='w-full text-gray-400 bg-gray-800 px-3 py-2 text-base rounded-md'
                            onKeyDown={(e) => { handlekeydown(e, "handlesubmit") }}
                            onChange={(e) => { setData(e.target.value) }}

                        />
                        <div

                            className='text-2xl p-2 rounded-full w-10 h-10 flex items-center justify-center mt-1 bg-purple-700 cursor-pointer'
                            onClick={(e) => { handlesubmit(e) }}

                        >
                            <i className="fa-solid fa-plus text-white" id='add'></i>
                        </div>

                    </div>

                    <ul className="space-y-2 pr-1 flex-1 max-h-[58vh] overflow-y-auto custom-scrollbar">
                        {tasks.map((task, index) => (
                            <li key={index} className='bg-gray-800 text-gray-200 px-4 py-2 rounded-md flex justify-between items-center'>

                                <span className={`${task.completed ? 'line-through text-gray-500' : ''} break-words`}>
                                    {task.text}
                                </span>
                                <div className="flex gap-3 items-center">
                                    <i
                                        className={`fa-solid fa-check  cursor-pointer ${task.completed ? 'text-green-500' : 'text-gray-300'} `}
                                        onClick={() => taskComplete(index)}

                                    ></i>
                                    <i
                                        className={`fa-solid fa-trash ${deletecolor === index ? 'text-red-500' : 'text-gray-300'} cursor-pointer`}
                                        onClick={() => taskdelete(index)}
                                    ></i>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div >

                    </div>

                    <div className='text-xl font-semibold text-center absolute bottom-2 left-35 right-35  '>
                        <button className='bg-purple-700 rounded-md  text-white p-1 w-full cursor-pointer'
                            onClick={exit}>
                            Logout
                        </button>

                    </div>


                </div>
            </div>
           
           

        </>
    )
}

export default Todoapp





