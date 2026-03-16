// Dashboard Handler
class DashboardHandler {
    constructor() {
        this.baseURL = 'https://personal-website-ywou.onrender.com/api';
        this.init();
    }
    
    async init() {
        await this.loadDashboardStats();
        await this.loadRecentMessages();
        await this.loadRecentProjects();
        this.addEventListeners();
    }
    
    async loadDashboardStats() {
        try {
            const data = await window.auth.makeAuthenticatedRequest(`${this.baseURL}/users/dashboard-stats`);
            
            if (data && data.success) {
                this.updateStatsUI(data.stats);
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }
    
    updateStatsUI(stats) {
        const statsContainer = document.getElementById('dashboard-stats');
        if (!statsContainer) return;
        
        statsContainer.innerHTML = `
            <div class="glass-card stat-card">
                <i class="fas fa-envelope"></i>
                <h3>${stats.totalMessages}</h3>
                <p>Total Messages</p>
            </div>
            <div class="glass-card stat-card">
                <i class="fas fa-envelope-open"></i>
                <h3>${stats.unreadMessages}</h3>
                <p>Unread Messages</p>
            </div>
            <div class="glass-card stat-card">
                <i class="fas fa-code-branch"></i>
                <h3>${stats.totalProjects}</h3>
                <p>Total Projects</p>
            </div>
            <div class="glass-card stat-card">
                <i class="fas fa-star"></i>
                <h3>${stats.featuredProjects}</h3>
                <p>Featured Projects</p>
            </div>
        `;
    }
    
    async loadRecentMessages() {
        try {
            const data = await window.auth.makeAuthenticatedRequest(`${this.baseURL}/messages?limit=5`);
            
            if (data && data.success) {
                this.updateMessagesUI(data.messages);
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }
    
    updateMessagesUI(messages) {
        const messagesList = document.getElementById('recent-messages');
        if (!messagesList) return;
        
        if (messages.length === 0) {
            messagesList.innerHTML = '<p class="no-data">No messages yet</p>';
            return;
        }
        
        messagesList.innerHTML = messages.map(message => `
            <div class="message-item glass-card ${message.status}">
                <div class="message-header">
                    <h4>${message.name}</h4>
                    <span class="message-date">${new Date(message.createdAt).toLocaleDateString()}</span>
                </div>
                <p class="message-subject">${message.subject}</p>
                <div class="message-actions">
                    <button class="neon-button small" onclick="viewMessage('${message._id}')">View</button>
                    ${message.status === 'unread' ? 
                        `<button class="neon-button small" onclick="markAsRead('${message._id}')">Mark Read</button>` : 
                        ''}
                </div>
            </div>
        `).join('');
    }
    
    async loadRecentProjects() {
        try {
            const response = await fetch(`${this.baseURL}/projects?limit=5`);
            const data = await response.json();
            
            if (data.success) {
                this.updateProjectsUI(data.projects);
            }
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    }
    
    updateProjectsUI(projects) {
        const projectsList = document.getElementById('recent-projects');
        if (!projectsList) return;
        
        if (projects.length === 0) {
            projectsList.innerHTML = '<p class="no-data">No projects yet</p>';
            return;
        }
        
        projectsList.innerHTML = projects.map(project => `
            <div class="project-item glass-card">
                <img src="${project.image || 'assets/images/default-project.jpg'}" alt="${project.title}">
                <div class="project-info">
                    <h4>${project.title}</h4>
                    <p>${project.description.substring(0, 100)}...</p>
                    <div class="project-tech">
                        ${project.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>
                <div class="project-actions">
                    <button class="neon-button small" onclick="editProject('${project._id}')">Edit</button>
                    <button class="neon-button small" onclick="deleteProject('${project._id}')">Delete</button>
                </div>
            </div>
        `).join('');
    }
    
    addEventListeners() {
        // Add project button
        const addProjectBtn = document.getElementById('add-project-btn');
        if (addProjectBtn) {
            addProjectBtn.addEventListener('click', () => this.showAddProjectModal());
        }
        
        // Export data button
        const exportBtn = document.getElementById('export-data');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }
    }
    
    showAddProjectModal() {
        // Create modal for adding project
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content glass-card">
                <h3>Add New Project</h3>
                <form id="add-project-form">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" id="project-title" required>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea id="project-description" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Tech Stack (comma separated)</label>
                        <input type="text" id="project-tech" placeholder="React, Node.js, MongoDB">
                    </div>
                    <div class="form-group">
                        <label>GitHub Link</label>
                        <input type="url" id="project-github">
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <select id="project-category">
                            <option value="web">Web Development</option>
                            <option value="mobile">Mobile App</option>
                            <option value="ai">AI/ML</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Featured</label>
                        <input type="checkbox" id="project-featured">
                    </div>
                    <button type="submit" class="neon-button">Add Project</button>
                    <button type="button" class="neon-button" onclick="this.closest('.modal').remove()">Cancel</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle form submission
        document.getElementById('add-project-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const projectData = {
                title: document.getElementById('project-title').value,
                description: document.getElementById('project-description').value,
                techStack: document.getElementById('project-tech').value.split(',').map(t => t.trim()),
                githubLink: document.getElementById('project-github').value,
                category: document.getElementById('project-category').value,
                featured: document.getElementById('project-featured').checked
            };
            
            try {
                const data = await window.auth.makeAuthenticatedRequest(`${this.baseURL}/projects`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(projectData)
                });
                
                if (data && data.success) {
                    window.auth.showNotification('Project added successfully!', 'success');
                    modal.remove();
                    this.loadRecentProjects(); // Reload projects
                }
            } catch (error) {
                console.error('Error adding project:', error);
            }
        });
    }
    
    async exportData() {
        try {
            const data = await window.auth.makeAuthenticatedRequest(`${this.baseURL}/users/dashboard-stats`);
            
            if (data) {
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `dashboard-export-${new Date().toISOString()}.json`;
                a.click();
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Error exporting data:', error);
        }
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('dashboard-stats')) {
        window.dashboard = new DashboardHandler();
    }
});
