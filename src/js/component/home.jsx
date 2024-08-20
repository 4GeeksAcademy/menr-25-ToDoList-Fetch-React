import React, { useState, useEffect } from "react";

const Home = () => {
    const [inputValue, setInputValue] = useState("");
    const [todos, setTodos] = useState([]);
	const [showAlert, setShowAlert] = useState(false);

	const loadTodos = () => {
        fetch('https://playground.4geeks.com/todo/users/miguel_navas')
            .then(response => response.json())
            .then(data => {
                setTodos(Array.isArray(data) ? data : []);
            })
    };

    useEffect(() => {
        loadTodos();
    }, []);

    const addTodo = () => {
		if (inputValue.trim() === "") {
            setShowAlert(true);
            return;
        }

        setShowAlert(false); 

        const newTodo = { label: inputValue, is_done: false };
        fetch('https://playground.4geeks.com/todo/todos/miguel_navas', {
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
        fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
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
            fetch(`https://playground.4geeks.com/todo/todos/${todo.id}`, {
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
            <h1>todos</h1>
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

