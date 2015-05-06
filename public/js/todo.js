var TodoBox = React.createClass({
  loadTodosFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: "json",
      cache: false,
      success: function(todos) {
        this.setState({todos: todos});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleTodoSubmit: function(todo) {
    $.ajax({
      url: this.props.url,
      dataType: "json",
      type: "POST",
      data: todo,
      success: function(todos) {
        this.setState({todos: todos});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleTodoUpdate: function(todoId) {
    $.ajax({
      url: this.props.url,
      dataType: "json",
      type: "PUT",
      data: {
        todoId: todoId,
      },
      success: function(todos) {
        this.setState({todos: todos});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleTodoDelete: function(todoId) {
    $.ajax({
      url: this.props.url,
      dataType: "json",
      type: "DELETE",
      data: {
        todoId: todoId,
      },
      success: function(todos) {
        this.setState({todos: todos});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {todos: []};
  },
  componentDidMount: function() {
    this.loadTodosFromServer();
    setInterval(this.loadTodosFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div id="todoBox">
        <h1>Todo List</h1>
        <TodoForm onTodoSubmit={this.handleTodoSubmit} />
        <TodoList onTodoDelete={this.handleTodoDelete} onTodoUpdate={this.handleTodoUpdate} todos={this.state.todos} />
      </div>
    );
  }
});

var TodoForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var task = this.refs.task.getDOMNode().value.trim();
    if (!task) {
      return;
    }

    this.props.onTodoSubmit({key: Number(new Date()), task: task, completed: false});
    this.refs.task.getDOMNode().value = '';
    return;
  },
  render: function() {
    return (
      <form className="todoFrom" onSubmit={this.handleSubmit}>
        <input type="text" ref="task" placeholder="Please Input New Task" />
        <input type="submit" value="Submit" />
      </form>
    );
  }
});

var TodoList = React.createClass({
  render: function() {
    var todoNodes = this.props.todos.map(function(todo) {
      return (
        <Todo onTodoDelete={this.props.onTodoDelete} onTodoUpdate={this.props.onTodoUpdate} completed={todo.completed} key={todo.key} id={todo.key}>
          {todo.task}
        </Todo>
      );
    }.bind(this));
    return (
      <div id="todoList">
        {todoNodes}
      </div>
    );
  }
});

var Todo = React.createClass({
  handleUpdate: function(e) {
    e.preventDefault();
    this.props.onTodoUpdate(this.props.id);
    return;
  },
  handleDelete: function(e) {
    e.preventDefault();
    this.props.onTodoDelete(this.props.id);
    return;
  },
  render: function() {
    var task = this.props.completed ?
      <span style={{textDecoration: 'line-through', color: '#b2b2b2'}}>
      {this.props.children} </span> : this.props.children;
    return (
      <div id="todo">
      <input type="checkbox" checked={this.props.completed} onChange={this.handleUpdate} />
      {' '}
      {task}
      <a style={{textDecoration: 'underline'}} onClick={this.handleDelete}> Delete</a>
      </div>
    );
  }
});

React.render(
  <TodoBox url="todos.json" pollInterval={10000} />,
  document.getElementById('todo')
);
