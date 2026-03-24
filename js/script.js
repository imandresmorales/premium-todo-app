document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const emptyState = document.getElementById('empty-state');
    const totalTasksEl = document.getElementById('total-tasks');
    const completedTasksEl = document.getElementById('completed-tasks');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const currentDateEl = document.getElementById('current-date');

    // State
    let todos = [];
    try {
        const storedTodos = JSON.parse(localStorage.getItem('serenoTodos'));
        todos = Array.isArray(storedTodos) ? storedTodos : [];
    } catch (e) {
        todos = [];
    }
    let currentFilter = 'all';

    // Set Current Date
    const setDate = () => {
        const options = { weekday: 'long', month: 'short', day: 'numeric' };
        currentDateEl.textContent = new Date().toLocaleDateString('es-ES', options);
    };

    // Save to LocalStorage
    const saveTodos = () => {
        localStorage.setItem('serenoTodos', JSON.stringify(todos));
        updateStats();
    };

    // Update Stats
    const updateStats = () => {
        const total = todos.length;
        const completed = todos.filter(t => t.completed).length;
        
        // Add minimal animation effect for number changes
        if(totalTasksEl.textContent !== total.toString()) {
            animateValueChange(totalTasksEl, total);
        }
        if(completedTasksEl.textContent !== completed.toString()) {
            animateValueChange(completedTasksEl, completed);
        }
        
        // Show/Hide Empty State
        if (todos.length === 0) {
            emptyState.classList.add('visible');
            todoList.style.display = 'none';
        } else {
            const filteredTodos = getFilteredTodos();
            if (filteredTodos.length === 0) {
                emptyState.classList.add('visible');
                emptyState.querySelector('p').textContent = 'No hay tareas para este filtro.';
                todoList.style.display = 'none';
            } else {
                emptyState.classList.remove('visible');
                todoList.style.display = 'flex';
            }
        }
    };

    const animateValueChange = (element, newValue) => {
        element.style.transform = 'scale(1.2)';
        element.style.color = 'var(--accent-primary)';
        element.textContent = newValue;
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.color = 'var(--text-primary)';
        }, 200);
    };

    // Get Filtered Todos
    const getFilteredTodos = () => {
        switch (currentFilter) {
            case 'active':
                return todos.filter(t => !t.completed);
            case 'completed':
                return todos.filter(t => t.completed);
            default:
                return todos;
        }
    };

    // Render Todos
    const renderTodos = () => {
        const filteredTodos = getFilteredTodos();
        todoList.innerHTML = '';

        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.dataset.id = todo.id;

            li.innerHTML = `
                <div class="checkbox-wrapper">
                    <input type="checkbox" id="check-${todo.id}" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                    <label for="check-${todo.id}" class="checkbox-custom"></label>
                </div>
                <span class="todo-text">${escapeHTML(todo.text)}</span>
                <button class="delete-btn" aria-label="Eliminar tarea">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            `;

            // Event Listeners for Item Actions
            const checkbox = li.querySelector('.todo-checkbox');
            checkbox.addEventListener('change', () => toggleTodo(todo.id));

            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => deleteTodo(todo.id, li));

            todoList.appendChild(li);
        });

        updateStats();
    };

    // Add Todo
    const addTodo = (text) => {
        const newTodo = {
            id: window.crypto && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substring(2),
            text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        todos.unshift(newTodo);
        saveTodos();
        
        // If filtered list doesn't show new item, switch to 'all'
        if (currentFilter === 'completed') {
            document.querySelector('[data-filter="all"]').click();
        } else {
            renderTodos();
        }
    };

    // Toggle Todo
    const toggleTodo = (id) => {
        todos = todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveTodos();
        
        // Re-render if filter is active
        if (currentFilter !== 'all') {
            setTimeout(renderTodos, 300); // Wait for transition
        } else {
            renderTodos();
        }
    };

    // Delete Todo
    const deleteTodo = (id, element) => {
        element.classList.add('deleting');
        
        // Wait for animation to finish
        setTimeout(() => {
            todos = todos.filter(todo => todo.id !== id);
            saveTodos();
            renderTodos();
        }, 300);
    };

    // Filter Listeners
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Set current filter
            currentFilter = btn.dataset.filter;
            
            // Re-render
            renderTodos();
        });
    });

    // Form Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        
        if (text) {
            addTodo(text);
            input.value = '';
        }
    });

    // Utility to prevent XSS
    const escapeHTML = (str) => {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    };

    // Initialize
    setDate();
    renderTodos();
});
