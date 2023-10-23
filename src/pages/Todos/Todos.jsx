import { useForm } from "react-hook-form"
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from "react";
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'


const Todos = () => {
    const { refetch, data: todos = [], isError } = useQuery({
        queryKey: ['todo'],
        queryFn: async () => {
            const response = await fetch(`https://simple-todo-server-production.up.railway.app/todo`)
            return response.json()
        }
    })

    const {
        reset,
        register,
        handleSubmit,
    } = useForm()

    const onSubmit = (data) => {

        let todo = data.todo

        axios.post('https://simple-todo-server-production.up.railway.app/todo', {
            todo
        }).then((response) => {
            // console.log(response)
            if (response.data.insertedId) {
                toast.success('Successfully Added!')
                refetch()
            }
            reset()
        }).catch((error) => {
            console.log(error)
        })
    }

    const handleComplete = (item) => {
        let id = item?._id
        axios.patch(`https://simple-todo-server-production.up.railway.app/todo/${id}`)
            .then(res => {
                // console.log(res)
                if (res.data.modifiedCount > 0) {
                    if (item.done === true) {
                        toast.success('Mark Undone')
                    } else {
                        toast.success('Mark done')
                    }
                    refetch()
                }
            })
            .then(error => console.log(error))
    }

    const handleDelete = (id) => {
        axios.delete(`https://simple-todo-server-production.up.railway.app/todo/${id}`)
            .then((response) => {
                // console.log(response)
                if (response.data.deletedCount > 0) {
                    toast.success('Deleted')
                    refetch()
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }


    return (
        <div className="text-center mt-10">
            <div><Toaster /></div>
            <h1 className="font-bold text-3xl mb-3">Add Todo</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register("todo")} type="text" placeholder="Add Todo" className="input input-bordered input-primary w-full max-w-xs" />
                <input className="btn btn-active btn-primary ml-4 mt-5" type="submit" value="Add" />
            </form>

            <div className="mt-10 ml-60">

                {
                    todos.map((item) => <div
                        key={item._id}
                    >
                        <div className="flex gap-2 p-2">
                            <li className={`text-left ${item.done ? "line-through" : ""}`}> {item.todo}</li>
                            <button onClick={() => handleComplete(item)} className="btn btn-sm btn-primary ml-6">Done</button>
                            <button onClick={() => handleDelete(item._id)} className="btn btn-sm btn-primary ml-6">Delete</button>
                        </div>
                    </div>)
                }

            </div>
        </div>
    );
};

export default Todos;