import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadTodos = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetch(`${API_BASE_URL}/api/todos`)

      if (!response.ok) {
        throw new Error('Unable to fetch todos')
      }

      const data = await response.json()
      setTodos(data)
    } catch (err) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTodos()
  }, [loadTodos])

  const activeCount = useMemo(
    () => todos.filter((todo) => !todo.completed).length,
    [todos]
  )

  const completedCount = useMemo(
    () => todos.length - activeCount,
    [todos, activeCount]
  )

  const handleSubmit = async (event) => {
    event.preventDefault()
    const title = newTodo.trim()

    if (!title) {
      setError('Please enter a task')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')
      const response = await fetch(`${API_BASE_URL}/api/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })

      if (!response.ok) {
        throw new Error('Failed to add todo')
      }

      const created = await response.json()
      setTodos((prev) => [created, ...prev])
      setNewTodo('')
    } catch (err) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggle = async (todo) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/todos/${todo._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed }),
      })

      if (!response.ok) {
        throw new Error('Failed to update todo')
      }

      const updated = await response.json()
      setTodos((prev) => prev.map((item) => (item._id === updated._id ? updated : item)))
    } catch (err) {
      setError(err.message || 'An unexpected error occurred')
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete todo')
      }

      setTodos((prev) => prev.filter((todo) => todo._id !== id))
    } catch (err) {
      setError(err.message || 'An unexpected error occurred')
    }
  }

  const handleEdit = async (todo) => {
    const nextTitle = window.prompt('Update task', todo.title)

    if (nextTitle === null) {
      return
    }

    const trimmed = nextTitle.trim()

    if (!trimmed) {
      setError('Task cannot be empty')
      return
    }

    if (trimmed === todo.title) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/todos/${todo._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: trimmed }),
      })

      if (!response.ok) {
        throw new Error('Failed to update todo')
      }

      const updated = await response.json()
      setTodos((prev) => prev.map((item) => (item._id === updated._id ? updated : item)))
      setError('')
    } catch (err) {
      setError(err.message || 'An unexpected error occurred')
    }
  }

  return (
    <div className="app-container">
      <main className="todo-app">
        <header className="todo-header">
          <h1>Tasks</h1>
          <p>Track what needs doing and clear tasks as you go.</p>
        </header>

        <form className="todo-form" onSubmit={handleSubmit}>
          <input
            className="todo-input"
            type="text"
            placeholder="Add a new task"
            value={newTodo}
            onChange={(event) => setNewTodo(event.target.value)}
            disabled={isSubmitting}
          />
          <button className="todo-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding?' : 'Add'}
          </button>
        </form>

        <section className="todo-meta">
          <span>{activeCount} pending</span>
          <span>{completedCount} completed</span>
          <button className="refresh-button" type="button" onClick={loadTodos} disabled={loading}>
            {loading ? 'Refreshing?' : 'Refresh'}
          </button>
        </section>

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="loading">Loading tasks?</div>
        ) : todos.length === 0 ? (
          <div className="empty-state">Start by adding your first task.</div>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li
                key={todo._id}
                className={`todo-item${todo.completed ? ' completed' : ''}`}
              >
                <label className="todo-content">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo)}
                  />
                  <span className="todo-title">{todo.title}</span>
                </label>

                <div className="todo-actions">
                  <button type="button" onClick={() => handleEdit(todo)}>
                    Edit
                  </button>
                  <button type="button" className="danger" onClick={() => handleDelete(todo._id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}

export default App
