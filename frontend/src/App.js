// import { useEffect, useState } from 'react';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// const api_base = 'http://localhost:3001';

// const  App = () => {
// 	const [todos, setTodos] = useState([]);
// 	const [popupActive, setPopupActive] = useState(false);
// 	const [newTodo, setNewTodo] = useState("");

// 	useEffect(() => {
// 		getTodos();
// 	}, []);

//   const getTodos = async () => {
//     try {
//       const response = await fetch(`${api_base}/todos`);
//       const data = await response.json();
//       setTodos(data);
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   }

// 	const completeTodo = async id => {
// 		const data = await fetch(api_base + '/todo/complete/' + id).then(res => res.json());

// 		setTodos(todos => todos.map(todo => {
// 			if (todo._id === data._id) {
// 				todo.complete = data.complete;
// 			}

// 			return todo;
// 		}));

// 	}

// 	const addTodo = async () => {
// 		const data = await fetch(api_base + "/todo/new", {
// 			method: "POST",
// 			headers: {
// 				"Content-Type": "application/json"
// 			},
// 			body: JSON.stringify({
// 				text: newTodo
// 			})
// 		}).then(res => res.json());

// 		setTodos([...todos, data]);

// 		setPopupActive(false);
// 		setNewTodo("");
// 	}

// 	const deleteTodo = async id => {
// 		const data = await fetch(api_base + '/todo/delete/' + id, { method: "DELETE" }).then(res => res.json());

// 		setTodos(todos => todos.filter(todo => todo._id !== data.result._id));
// 	}

// 	return (
// 		<div className="App">
// 			<h1>Welcome</h1>
// 			<h4>Your tasks</h4>

// 			<div className="todos">
// 				{todos.length > 0 ? todos.map(todo => (
// 					<div className={
// 						"todo" + (todo.complete ? " is-complete" : "")
// 					} key={todo._id} onClick={() => completeTodo(todo._id)}>
// 						<div className="checkbox"></div>

// 						<div className="text">{todo.text}</div>

// 						<div className="delete-todo" onClick={() => deleteTodo(todo._id)}>x</div>
// 					</div>
// 				)) : (
// 					<p>You currently have no tasks</p>
// 				)}
// 			</div>

// 			<div className="addPopup" onClick={() => setPopupActive(true)}>+</div>

// 			{popupActive ? (
// 				<div className="popup">
// 					<div className="closePopup" onClick={() => setPopupActive(false)}>X</div>
// 					<div className="content">
// 						<h3>Add Task</h3>
// 						<input type="text" className="add-todo-input" onChange={e => setNewTodo(e.target.value)} value={newTodo} />
// 						<div className="button" onClick={addTodo}>Create Task</div>
// 					</div>
// 				</div>
// 			) : ''}
// 		</div>
// 	);
// }

// export default App;

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const api_base = "http://localhost:3001";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = async () => {
    try {
      const response = await fetch(`${api_base}/todos`);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const completeTodo = async (id) => {
    const data = await fetch(api_base + "/todo/complete/" + id).then((res) =>
      res.json()
    );

    setTodos((todos) =>
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo.complete = data.complete;
        }

        return todo;
      })
    );
  };

  const addTodo = async () => {
    const data = await fetch(api_base + "/todo/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newTodo,
      }),
    }).then((res) => res.json());

    setTodos([...todos, data]);

    setPopupActive(false);
    setNewTodo("");
  };

  const deleteTodo = async (id) => {
    const data = await fetch(api_base + "/todo/delete/" + id, {
      method: "DELETE",
    }).then((res) => res.json());

    setTodos((todos) => todos.filter((todo) => todo._id !== data.result._id));
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
  
    const { source, destination } = result;
  
    const updatedTodos = Array.from(todos);
    const [removed] = updatedTodos.splice(source.index, 1);
    updatedTodos.splice(destination.index, 0, removed);
  
    try {
      const response = await fetch(api_base + "/todos/updateOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          todos: updatedTodos,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update todo order");
      }
  
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error(error);
    }
  };
  
  
  

  return (
    <div className="App">
      <h1>Welcome</h1>
      <h4>Your tasks</h4>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <div
              className="todos"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {todos.length > 0 ? (
                todos.map((todo, index) => (
                  <Draggable
                    key={todo._id}
                    draggableId={todo._id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        className={
                          "todo" + (todo.complete ? " is-complete" : "")
                        }
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        onClick={() => completeTodo(todo._id)}
                      >
                        <div className="checkbox"></div>
                        <div className="text">{todo.text}</div>
                        <div
                          className="delete-todo"
                          onClick={() => deleteTodo(todo._id)}
                        >
                          x
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))
              ) : (
                <p>You currently have no tasks</p>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div className="addPopup" onClick={() => setPopupActive(true)}>
        +
      </div>
      {popupActive ? (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopupActive(false)}>
            X
          </div>
          <div className="content">
            <h3>Add Task</h3>
            <input
              type="text"
              className="add-todo-input"
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
            />
            <div className="button" onClick={addTodo}>
              Create Task
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default App;
