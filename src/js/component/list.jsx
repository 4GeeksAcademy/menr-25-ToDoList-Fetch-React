import React from "react";

const List = ({ inputValue, setInputValue, todos, addTodo, deleteTodo, deleteAllTodos, showAlert }) => {
    return (
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
    );
};

export default List;