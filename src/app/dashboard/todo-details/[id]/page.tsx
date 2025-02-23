"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { todoService } from "@/app/services/todo-services";
import Header from "@/app/components/Header";
import Breadcrumb from "@/app/components/Breadcrumb";

interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

const TodoDetail = () => {
  const { id } = useParams();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodo = async () => {
      if (!id) return;
  
      try {
        const response = await todoService.getTodo(`${id}`);  
        if (!response) {
          throw new Error("Todo not found"); 
        }
  
        setTodo(response);
      } catch (err) {
        setError("Failed to fetch todo details.");
        console.error("Error fetching todos:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTodo();
  }, [id]);
  

  return (
    <>
    <Header/>
    <Breadcrumb />

    <div className="flex items-center justify-center min-h-screen to-blue-300 p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200 text-center">
        {loading && <p className="text-lg text-gray-600 font-semibold">Loading...</p>}
        {error && <p className="text-red-600 font-semibold">{error}</p>}

        {todo && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{todo.todo}</h2>
            <p className="text-sm text-gray-500 mb-2">
              User ID: <span className="font-medium">{todo.userId}</span>
            </p>
            <span
              className={`inline-block px-4 py-2 rounded-lg text-white font-semibold mt-4 ${
                todo.completed ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {todo.completed ? "Completed" : "Pending"}
            </span>
          </>
        )}
      </div>
    </div>
    </>
  );
};

export default TodoDetail;
