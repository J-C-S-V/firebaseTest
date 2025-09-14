import { useEffect, useState } from "react";

import { db } from "../lib/firebase";
import {
  addDoc,
  getDocs,
  collection,
  deleteDoc,
  doc,
} from "firebase/firestore";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      const querySnapshot = await getDocs(collection(db, "todos"));
      setTodos(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    };

    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (newTodo.trim() === "") return;

    const docRef = await addDoc(collection(db, "todos"), {
      text: newTodo,
      completed: false,
    });

    setTodos([...todos, { id: docRef.id, text: newTodo, completed: false }]);
    setNewTodo("");
  };

  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <>
      <h2>Todo List</h2>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <button onClick={addTodo}>Add Todo</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Todo;
