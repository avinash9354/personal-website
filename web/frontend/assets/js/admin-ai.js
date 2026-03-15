/**
 * admin-ai.js
 * Advanced AI Assistant logic for Admin Panel
 * Fetches system stats and provides specialized admin context
 */

(function () {
    const GEMINI_ENDPOINT = '/api/gemini/chat';
    const STATS_ENDPOINT = '/api/admin/stats';
    let systemStats = null;
    let chatHistory = [];

    // Fetch Token from local storage (admin is already logged in)
    const getAuthToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

    async function fetchSystemStats() {
        try {
            const token = getAuthToken();
            const res = await fetch(STATS_ENDPOINT, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                systemStats = data.stats;
                updateStatsUI();
            }
        } catch (err) {
            console.error('Failed to fetch system stats:', err);
        }
    }

    function updateStatsUI() {
        const sidebar = document.querySelector('.ai-sidebar');
        if (!sidebar || !systemStats) return;

        let statsHTML = `
            <div class="dash-chart-card glass-card animate-fade-in" style="padding:20px; margin-top:12px;">
                <div class="dash-chart-title" style="margin-bottom:14px; color: var(--nebula-cyan);">
                    <i class="fas fa-microchip"></i> Real-time Context
                </div>
                <div class="stats-mini-grid">
                    <div class="stat-mini">
                        <span class="label">Projects</span>
                        <span class="value">${systemStats.projects.total}</span>
                    </div>
                    <div class="stat-mini">
                        <span class="label">Messages</span>
                        <span class="value">${systemStats.messages.total}</span>
                    </div>
                    <div class="stat-mini">
                        <span class="label">Unread</span>
                        <span class="value" style="color:var(--nebula-purple)">${systemStats.messages.unread}</span>
                    </div>
                </div>
                <div style="font-size:0.75rem; color:var(--text-dim); margin-top:10px; border-top:1px solid rgba(255,255,255,0.05); padding-top:8px;">
                    <i class="fas fa-server"></i> Node: ${systemStats.system.nodeVersion}
                </div>
            </div>
        `;
        
        // Append or update widget
        const existing = document.getElementById('ai-stats-widget');
        if (existing) {
            existing.innerHTML = statsHTML;
        } else {
            const div = document.createElement('div');
            div.id = 'ai-stats-widget';
            div.innerHTML = statsHTML;
            sidebar.appendChild(div);
        }
    }

    function getAdminPrompt() {
        const statsStr = JSON.stringify(systemStats, null, 2);
        return `You are Nova, the Advanced Portfolio Manager AI for Avinash Pandey.
You are currently operating within the PRIVATE ADMIN PANEL.
You have access to the real-time system state provided below. Use this data to assist Avinash in managing his portfolio, drafting replies, and analyzing site performance.

== SYSTEM STATE ==
${statsStr}

== YOUR CAPABILITIES ==
1. Message Analysis: Summarize recent enquiries and suggest replies.
2. Project Management: Help draft technical descriptions for new projects based on current tech stack.
3. Site Health: Report on system uptime and versioning.
4. Professional Writing: Write bios, proposals, and SEO metadata.

== GUIDELINES ==
- Always address Avinash as a colleague/partner. 
- Use the actual data from the system state to answer questions.
- If asked about "recent messages", refer to the 'recent' array in the state.
- Keep responses professional, highly insightful, and concise.
- Use markdown for headings and lists.`;
    }

    async function callGemini(userMessage) {
        if (!systemStats) await fetchSystemStats();

        chatHistory.push({ role: 'user', parts: [{ text: userMessage }] });
        if (chatHistory.length > 30) chatHistory = chatHistory.slice(-30);

        const res = await fetch(GEMINI_ENDPOINT, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({
                contents: chatHistory,
                systemInstruction: { parts: [{ text: getAdminPrompt() }] },
            }),
        });

        if (!res.ok) throw new Error('API Error');

        const data = await res.json();
        if (!data.success) throw new Error(data.message);

        const botText = data.text;
        chatHistory.push({ role: 'model', parts: [{ text: botText }] });
        return botText;
    }

    // UI Helpers
    function $msgs() { return document.getElementById('chatbot-messages'); }

    function showTyping() {
        const m = $msgs(); if (!m) return;
        if (document.getElementById('typing-indicator')) return;
        const d = document.createElement('div');
        d.className = 'chat-bubble bot typing glass-bubble';
        d.id = 'typing-indicator';
        d.innerHTML = '<span></span><span></span><span></span>';
        m.appendChild(d); m.scrollTop = m.scrollHeight;
    }

    function addMsg(text, who) {
        document.getElementById('typing-indicator')?.remove();
        const m = $msgs(); if (!m) return;
        const d = document.createElement('div');
        d.className = `chat-bubble ${who} ${who === 'bot' ? 'glass-bubble' : ''} animate-slide-in`;
        
        // Very basic MD-like formatting
        d.innerHTML = text
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
            .replace(/### (.*?)(<br>|$)/g, '<h4 style="color:var(--nebula-cyan);margin:10px 0 5px;">$1</h4>')
            .replace(/- (.*?)(<br>|$)/g, '<li style="margin-left:15px;list-style:disc;">$1</li>');
            
        m.appendChild(d); m.scrollTop = m.scrollHeight;
    }

    function init() {
        const input = document.getElementById('chatbot-input-field');
        const sendBtn = document.getElementById('chatbot-send');
        if (!input || !sendBtn) return;

        const send = async () => {
            const val = input.value.trim();
            if (!val) return;
            input.value = '';
            input.disabled = true;
            addMsg(val, 'user');
            showTyping();
            try {
                const reply = await callGemini(val);
                addMsg(reply, 'bot');
            } catch (err) {
                addMsg('⚠️ I encountered an error. Check if the token is valid or project quota is exceeded.', 'bot');
            } finally {
                input.disabled = false;
                input.focus();
            }
        };

        sendBtn.addEventListener('click', send);
        input.addEventListener('keypress', e => { if (e.key === 'Enter' && !e.shiftKey) send(); });

        fetchSystemStats();
        
        // Welcome message
        setTimeout(() => addMsg("🤝 **Welcome back, Avinash.** I have loaded the latest system statistics. How would you like to optimize the portfolio today?", 'bot'), 1000);
    }

    document.addEventListener('DOMContentLoaded', init);
    document.addEventListener('chatbot-restart', () => { chatHistory = []; init(); });
})();
