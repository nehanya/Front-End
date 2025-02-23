"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { todoService } from "@/app/services/todo-services";
import Header from "@/app/components/Header";

interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

const Events = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [newTodo, setNewTodo] = useState("");
  const [status, setStatus] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await todoService.getTodos("");
        setTodos(data?.todos);
      } catch (err) {
        setError("Failed to fetch todos. Please try again.");
        console.error("Error fetching todos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      const data = await todoService.createTodo({
        todo: newTodo,
        completed: false,
        userId: 5,
      });
      setTodos([...todos, data]);
      setShowModal(false);
      setNewTodo("");
      setEditTodo(null);
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await todoService.deleteTodo(id.toString());
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  const updateTodo = async () => {
    if (!editTodo) return;
    try {
      await todoService.updateTodo(editTodo.id.toString(), {
        todo: newTodo, // Use newTodo instead of editTodo.todo
        completed: status,
      });
  
      setTodos(
        todos.map((todo) =>
          todo.id === editTodo.id
            ? { ...todo, todo: newTodo, completed: status } 
            : todo
        )
      );
      setShowModal(false);
      setEditTodo(null);
      setNewTodo(""); 
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };
  
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
       {todos.length > 0 &&   
       <>
       <h2 className="text-2xl font-bold text-center mb-4">Todo List</h2>
          <div className="flex justify-end">

          <button
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => {
              setShowModal(true);
              setEditTodo(null);
              setNewTodo("");
              setStatus(false);
            }}
          >
            + Add Todo
          </button>
</div>
</>
}
          {loading && <p className="text-center text-gray-500">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {!loading && !error && (
            <div className="space-y-4">
              {todos.length > 0 ? (
                todos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`relative p-4 rounded-lg shadow-md border-l-4 flex items-center transition hover:shadow-xl ${
                      todo.completed
                        ? "border-green-500 bg-green-100"
                        : "border-red-500 bg-red-100"
                    }`}
                  >
                    <div
                      className="max-h-[100px] overflow-y-auto flex-1 cursor-pointer"
                      onClick={() => router.push(`todo-details/${todo.id}`)}
                    >
                      <p className="text-lg font-semibold">{todo.todo}</p>
                      <p className="text-sm text-gray-700">
                        User ID: {todo.userId}
                      </p>
                      <p
                        className={`text-sm font-bold ${
                          todo.completed ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {todo.completed ? "Completed" : "Pending"}
                      </p>
                    </div>

                    {/* Sticky edit button */}
                    <button
                      onClick={() => {
                        setEditTodo(todo);
                        setNewTodo(todo.todo);
                        setStatus(todo.completed);
                        setShowModal(true);
                      }}
                      className="absolute right-10 top-1/2 transform -translate-y-1/2 text-blue-600 font-bold text-lg"
                    >
                      ✎
                    </button>

                    {/* Sticky delete button */}
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-600 font-bold text-lg"
                    >
                      ✖
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400">No todos available.</p>
              )}
            </div>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-xl font-semibold mb-4">
                {editTodo ? "Edit Todo" : "Add New Todo"}
              </h3>
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                className="w-full p-2 border rounded-lg mb-4"
                placeholder="Enter todo"
              />
              {editTodo && (
                <select
                  value={status.toString()}
                  onChange={(e) => setStatus(e.target.value === "true")}
                  className="w-full p-2 border rounded-lg mb-4"
                >
                  <option value="false">Pending</option>
                  <option value="true">Completed</option>
                </select>
              )}
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                  onClick={() => {
                    setShowModal(false);
                    setNewTodo("");
                    setStatus(false);
                    setEditTodo(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  onClick={editTodo ? updateTodo : addTodo}
                >
                  {editTodo ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Events;

