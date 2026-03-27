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
    const themeToggleBtn = document.getElementById('theme-toggle');
    const btnDefault = document.getElementById('btn-default');
    const btnBootstrap = document.getElementById('btn-bootstrap');
    const btnMaterial = document.getElementById('btn-material');
    const btnChakra = document.getElementById('btn-chakra');
    const defaultCss = document.getElementById('default-css');
    const bootstrapCss = document.getElementById('bootstrap-css');
    const bootstrapExtrasCss = document.getElementById('bootstrap-extras-css');
    const materialCss = document.getElementById('material-css');
    const materialExtrasCss = document.getElementById('material-extras-css');
    const chakraExtrasCss = document.getElementById('chakra-extras-css');

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
            const completedClasses = todo.completed ? 'completed bg-body-tertiary text-muted' : '';
            li.className = `todo-item list-group-item d-flex align-items-center border-0 mb-2 rounded shadow-sm ${completedClasses}`;
            li.dataset.id = todo.id;

            let checkboxMarkup = `
                <div class="checkbox-wrapper">
                    <input type="checkbox" id="check-${todo.id}" class="todo-checkbox form-check-input mt-0" ${todo.completed ? 'checked' : ''}>
                    <label for="check-${todo.id}" class="checkbox-custom"></label>
                </div>
            `;
            
            li.innerHTML = `
                ${checkboxMarkup}
                <span class="todo-text text-break fw-semibold">${escapeHTML(todo.text)}</span>
                <button class="delete-btn btn btn-sm rounded" aria-label="Eliminar tarea">
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
            filterBtns.forEach(b => {
                b.classList.remove('active');
                if (document.body.classList.contains('bootstrap-mode')) {
                    b.classList.add('text-muted');
                    b.classList.remove('bg-dark', 'text-white');
                } else if (document.body.classList.contains('material-mode')) {
                    b.classList.add('text-muted');
                    b.classList.remove('bg-primary', 'text-white');
                } else if (document.body.classList.contains('chakra-mode')) {
                    b.classList.add('text-muted');
                    b.classList.remove('chakra-active');
                }
            });
            btn.classList.add('active');
            if (document.body.classList.contains('bootstrap-mode')) {
                btn.classList.remove('text-muted');
                btn.classList.add('bg-dark', 'text-white');
            } else if (document.body.classList.contains('material-mode')) {
                btn.classList.remove('text-muted');
                btn.classList.add('bg-primary', 'text-white');
            } else if (document.body.classList.contains('chakra-mode')) {
                btn.classList.remove('text-muted');
                btn.classList.add('chakra-active');
            }
            
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

    // Theme Management
    const initTheme = () => {
        const savedTheme = localStorage.getItem('serenoTheme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.body.classList.add('dark-theme');
            themeToggleBtn.setAttribute('aria-pressed', 'true');
            document.documentElement.setAttribute('data-bs-theme', 'dark');
        } else {
            themeToggleBtn.setAttribute('aria-pressed', 'false');
            document.documentElement.setAttribute('data-bs-theme', 'light');
        }
    };

    themeToggleBtn.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-theme');
        localStorage.setItem('serenoTheme', isDark ? 'dark' : 'light');
        themeToggleBtn.setAttribute('aria-pressed', isDark.toString());
        
        if (isDark) {
            document.documentElement.setAttribute('data-bs-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-bs-theme', 'light');
        }
    });

    // Design Switcher Management
    const initDesign = () => {
        const savedDesign = localStorage.getItem('serenoDesign') || 'default';
        setDesign(savedDesign);
    };

    const setDesign = (design) => {
        // Reset classes
        document.body.classList.remove('bootstrap-mode', 'material-mode', 'chakra-mode');
        
        // Reset styles
        defaultCss.disabled = true;
        bootstrapCss.disabled = true;
        bootstrapExtrasCss.disabled = true;
        materialCss.disabled = true;
        materialExtrasCss.disabled = true;
        chakraExtrasCss.disabled = true;
        
        // Reset buttons
        btnDefault.classList.remove('active');
        btnBootstrap.classList.remove('active');
        btnMaterial.classList.remove('active');
        btnChakra.classList.remove('active');

        if (design === 'bootstrap') {
            document.body.classList.add('bootstrap-mode');
            bootstrapCss.disabled = false;
            bootstrapExtrasCss.disabled = false;
            btnBootstrap.classList.add('active');
            
            // Update filter buttons appearance for bootstrap
            filterBtns.forEach(b => {
                if (b.classList.contains('active')) {
                    b.classList.add('bg-dark', 'text-white');
                    b.classList.remove('text-muted');
                } else {
                    b.classList.add('text-muted');
                    b.classList.remove('bg-dark', 'text-white');
                }
            });
        } else if (design === 'material') {
            document.body.classList.add('material-mode');
            materialCss.disabled = false;
            materialExtrasCss.disabled = false;
            btnMaterial.classList.add('active');
            
            // Update filter buttons for material
            filterBtns.forEach(b => {
                if (b.classList.contains('active')) {
                    b.classList.add('bg-primary', 'text-white');
                    b.classList.remove('text-muted');
                } else {
                    b.classList.add('text-muted');
                    b.classList.remove('bg-primary', 'text-white');
                }
            });
        } else if (design === 'chakra') {
            document.body.classList.add('chakra-mode');
            chakraExtrasCss.disabled = false;
            btnChakra.classList.add('active');
            
            // Update filter buttons for chakra
            filterBtns.forEach(b => {
                if (b.classList.contains('active')) {
                    b.classList.add('chakra-active');
                    b.classList.remove('text-muted');
                } else {
                    b.classList.add('text-muted');
                    b.classList.remove('chakra-active');
                }
            });
        } else {
            defaultCss.disabled = false;
            btnDefault.classList.add('active');
            
            // Remove specific utility classes from filter buttons
            filterBtns.forEach(b => {
                b.classList.remove('bg-dark', 'text-white', 'bg-primary', 'chakra-active');
            });
        }
    };

    btnDefault.addEventListener('click', () => {
        setDesign('default');
        localStorage.setItem('serenoDesign', 'default');
    });

    btnBootstrap.addEventListener('click', () => {
        setDesign('bootstrap');
        localStorage.setItem('serenoDesign', 'bootstrap');
    });

    btnMaterial.addEventListener('click', () => {
        setDesign('material');
        localStorage.setItem('serenoDesign', 'material');
    });

    btnChakra.addEventListener('click', () => {
        setDesign('chakra');
        localStorage.setItem('serenoDesign', 'chakra');
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
    initTheme();
    initDesign();
    setDate();
    renderTodos();
});
