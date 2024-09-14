import Header from "./components/Header";
import Tasks from "./components/Tasks";
import { useState, useEffect } from "react"
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import About from "./components/About";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])
  
  useEffect(() => {
  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:5000/tasks');
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.statusText}`);
      }
      const data = await res.json();
      setTasks(data);  // Make sure you're setting the tasks to the fetched data
      console.log(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };
  fetchTasks();
}, []);

  // Delete Task  
  // const deleteTask = (id) => {
  //   setTasks(tasks.filter((task) => task.id !== id))
  // }
  const deleteTask = async (id) => {
    // Send a DELETE request to the server
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE',
    });  
    // Check if the request was successful
    if (res.status === 200) {
      // If the deletion was successful, update the state
      setTasks(tasks.filter((task) => task.id !== id));
    } else {
      alert('Error deleting this task');
    }
  };

  // remainder 
  // const toggleReminder = (id) => {
  //   setTasks(
  //     tasks.map((task) => task.id === id ? {...task, reminder: !task.reminder} : task
  //     )
  //   )
  // }
  const toggleReminder = async (id) => {
    // Find the task to update
    const taskToToggle = tasks.find((task) => task.id === id);
    
    // Update the task reminder field by flipping its current value
    const updatedTask = { ...taskToToggle, reminder: !taskToToggle.reminder };
  
    // Send a PATCH request to update the task on the server
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ reminder: updatedTask.reminder }),  // Only update the reminder field
    });
  
    // Check if the request was successful
    if (res.ok) {
      // If successful, update the tasks in the state
      setTasks(
        tasks.map((task) => 
          task.id === id ? { ...task, reminder: updatedTask.reminder } : task
        )
      );
    } else {
      alert('Error updating the task reminder');
    }
  };
  
  // // Add Task
  // const addTask = (task) => {
  //   const id = Math.floor(Math.random() * 1000) +1
  //   const newTask = {id, ...task}
  //   setTasks([...tasks, newTask])
  // }
  
  const addTask = async (task) => {
    // Send a POST request to add the new task to the server
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(task),  // Convert the task object to a JSON string
    });
    // Get the response data (which will contain the new task with an ID)
    const newTask = await res.json();
    // Add the new task to the state
    setTasks([...tasks, newTask]);
  };

  return (
    <Router>
    <div className="container">
      <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
      <Routes>
        <Route path='/' element={
          <>
            {showAddTask && <AddTask onAdd={addTask} />}
            {tasks.length > 0 ? (
              <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} />
            ) : (
              'No Tasks To Show'
            )}
          </>
        } />
        <Route path='/about' element={<About />} />
      </Routes>
      <Footer />
    </div>
  </Router>
  );
}

export default App;
