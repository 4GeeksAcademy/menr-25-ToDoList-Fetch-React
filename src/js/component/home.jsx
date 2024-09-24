import React, { useState, useEffect } from "react";

const Home = () => {
    const [inputValue, setInputValue] = useState("");
    const [todos, setTodos] = useState([]);
	const [showAlert, setShowAlert] = useState(false);
    const [newUser, setNewUser] = useState("");
    const [user, setUser] = useState("");
    const [logStatus, setLogStatus] = useState("Log-in as:");
    
    const usersUrl = "https://playground.4geeks.com/todo/users/";
    const todosUrl = "https://playground.4geeks.com/todo/todos/";

    useEffect(() => {
        createNewUser("miguel_navas");
    },[])

    const deleteUser = () => {
        if (todos.length > 0) {
            deleteAllTodos()
            eliminarUsuario();
        }
    };

    const eliminarUsuario = () => {
        fetch(usersUrl + user, { 
            method: "DELETE",
        })
        .then(response => {
            if (response.ok) {
                setUser("");
                setNewUser("");
            } else {
                console.error("Error al eliminar el usuario");
            }
        })
        .catch(error => console.error("Error eliminando el usuario:", error));
    };


    const createNewUser = (user) => {
        fetch(usersUrl + user, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: user }),
        })
            .then(response => response.json())
            .then(data => {
                setUser(user);
            })
            .catch(error => {
                console.error("Error al crear usuario:", error);
            });
    };

	const loadTodos = () => {
        fetch(usersUrl + user)
            .then(response => response.json())
            .then(data => {
                setTodos(data.todos || []);
            })
            .catch(error => {
                console.error("Error al cargar todos:", error);
            });
    };
    
    useEffect(() => {
        if (user) {
            loadTodos();
        }
    }, [user]);

    const addTodo = () => {
		if (inputValue.trim() === "") {
            setShowAlert(true);
            return;
        }

        setShowAlert(false); 

        const newTodo = { label: inputValue, is_done: false };
        fetch(todosUrl + user, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTodo),
        })
            .then(response => response.json())
            .then(data => {
                setTodos([...todos, data]);
                setInputValue("");
            })
    };

    const deleteTodo = (id) => {
        fetch(`${todosUrl}${id}`, {
            method: 'DELETE',
            headers: {
                'accept': 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    setTodos(todos.filter(todo => todo.id !== id));
                } else {
                    console.error('Error deleting todo:', response);
                }
            })
    };

    const deleteAllTodos = () => {
        const deletePromises = todos.map(todo =>
            fetch(`${todosUrl}${todo.id}`, {
                method: 'DELETE',
                headers: {
                    'accept': 'application/json'
                }
            })
        );

        Promise.all(deletePromises)
            .then(() => setTodos([]))
            .catch(error => console.error('Error deleting all todos:', error));
    };

    return (
        <div>
            <h1>to-do's</h1>

            <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">{logStatus}</span>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="New Username"

                    onChange={(e) => setNewUser(e.target.value)}
                    value={newUser}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            createNewUser(newUser);
                            setLogStatus("Logged as")
                        }
                    }}
                />

            <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => {
                deleteUser();
                setLogStatus("Log-in");
            }}
            >Log-out</button>
            </div>

            <div className="shadow">

			{showAlert && (
                    <div className="alert alert-danger" role="alert">
                        Sorry, this field cannot be empty.
                    </div>
                )}

                <ul>
                    <li>
                        <input
                            type="text"
                            onChange={(e) => setInputValue(e.target.value)}
                            value={inputValue}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    addTodo();
                                }
                            }}
                            placeholder="What needs to be done?"
                        />
                    </li>

                    {todos.map((item, index) => (
                        <li key={index} className="inputSize">
                            {item.label}{" "}
                            <i
                                className="fa-solid fa-x"
                                onClick={() => deleteTodo(item.id)}
                            ></i>
                        </li>
                    ))}
                </ul>

                <div className="footer">
                    {todos.length} item left
                </div>

				<div className="button d-flex justify-content-center">
					<button className="btn btn-danger" onClick={deleteAllTodos}>Delete All</button>
				</div>
            </div>
        </div>
    );
};

export default Home;