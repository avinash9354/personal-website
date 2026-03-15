/**
 * admin-ai.js
 * Advanced Aether AI Assistant logic for Admin Panel
 * Version 2.0 - Futuristic Redesign
 */

(function () {
    const GEMINI_ENDPOINT = '/api/gemini/chat';
    const STATS_ENDPOINT = '/api/admin/stats';
    let systemStats = null;
    let chatHistory = [];
    let currentPersona = 'manager';

    const PERSONAS = {
        manager: {
            title: 'Portfolio Manager',
            prompt: 'You are Nova, the Portfolio Manager. Focus on business value, message summaries, and project strategy.',
            icon: 'fa-briefcase'
        },
        writer: {
            title: 'Content Specialist',
            prompt: 'You are Nova, the Content Specialist. Focus on professional writing, bios, and creative project descriptions.',
            icon: 'fa-pen-nib'
        },
        dev: {
            title: 'DevOps Assistant',
            prompt: 'You are Nova, the DevOps Assistant. Focus on system health, node versions, and technical optimization.',
            icon: 'fa-code'
        },
        seo: {
            title: 'SEO Guru',
            prompt: 'You are Nova, the SEO Guru. Focus on search optimization, metadata, and web performance analytics.',
            icon: 'fa-search-plus'
        }
    };

    // --- Core Logic ---

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
            console.error('Core Sync Failure:', err);
        }
    }

    function updateStatsUI() {
        if (!systemStats) return;
        const pCount = document.getElementById('stat-proj-count');
        const mCount = document.getElementById('stat-msg-count');
        if (pCount) pCount.innerText = systemStats.projects.total;
        if (mCount) mCount.innerText = systemStats.messages.total;
    }

    function getSystemPrompt() {
        const statsStr = JSON.stringify(systemStats, null, 2);
        const persona = PERSONAS[currentPersona];
        
        return `SYSTEM_CORE_INSTRUCTION:
You are the AETHER_AI Assistant (v2.0) for Avinash Pandey.
CURRENT_MODE: ${persona.title}
${persona.prompt}

DATABASE_STATE:
${statsStr}

OPERATIONAL_GUIDELINES:
- Address Avinash as a partner.
- Use the actual data provided to be factual.
- Format responses with Markdown.
- Maintain a futuristic, professional, and helpful tone.`;
    }

    window.switchPersona = function(id) {
        if (!PERSONAS[id]) return;
        currentPersona = id;
        
        // UI Update
        document.querySelectorAll('.persona-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.persona === id);
        });

        addMsg(`🔄 **Persona Switched: ${PERSONAS[id].title} mode active.** System recalibrated.`, 'bot');
    };

    async function callGemini(userMessage) {
        if (!systemStats) await fetchSystemStats();

        chatHistory.push({ role: 'user', parts: [{ text: userMessage }] });
        if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);

        const res = await fetch(GEMINI_ENDPOINT, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({
                contents: chatHistory,
                systemInstruction: { parts: [{ text: getSystemPrompt() }] },
            }),
        });

        if (!res.ok) throw new Error('API_SYNC_ERROR');

        const data = await res.json();
        if (!data.success) throw new Error(data.message);

        const botText = data.text;
        chatHistory.push({ role: 'model', parts: [{ text: botText }] });
        return botText;
    }

    // --- UI Enhancements ---

    function $msgs() { return document.getElementById('chatbot-messages'); }

    function showTyping() {
        const m = $msgs(); if (!m) return;
        const d = document.createElement('div');
        d.className = 'chat-bubble bot typing animate-slide-in';
        d.id = 'typing-indicator';
        d.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
        m.appendChild(d); m.scrollTop = m.scrollHeight;
    }

    function addMsg(text, who) {
        document.getElementById('typing-indicator')?.remove();
        const m = $msgs(); if (!m) return;
        const d = document.createElement('div');
        d.className = `chat-bubble ${who} animate-slide-in`;
        
        // Futuristic Markdown Renderer
        d.innerHTML = text
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
            .replace(/### (.*?)(<br>|$)/g, '<h4 style="color:var(--neon-cyan);margin:8px 0;">$1</h4>')
            .replace(/- (.*?)(<br>|$)/g, '<li style="margin-left:15px;list-style:square;color:rgba(255,255,255,0.8);">$1</li>');
            
        m.appendChild(d); m.scrollTop = m.scrollHeight;
    }

    window.sendPrompt = function(p) {
        const input = document.getElementById('chatbot-input-field');
        if (input) {
            input.value = p;
            document.getElementById('chatbot-send').click();
        }
    };

    function simulateNetworkActivity() {
        const bars = ['health-bar', 'sync-bar'];
        setInterval(() => {
            const bar = bars[Math.floor(Math.random() * bars.length)];
            const el = document.getElementById(bar);
            if (el) {
                const val = 95 + Math.random() * 5;
                el.style.width = val + '%';
            }
        }, 3000);
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
                addMsg('⚠️ **SYSTEM_ERROR**: Connection to Neural Core lost. Quota likely exceeded or API key invalid.', 'bot');
            } finally {
                input.disabled = false;
                input.focus();
            }
        };

        sendBtn.addEventListener('click', send);
        input.addEventListener('keypress', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });

        document.getElementById('clear-chat-btn')?.addEventListener('click', () => {
             $msgs().innerHTML = '';
             chatHistory = [];
             addMsg("🧹 **Session Purged.** Neural buffers cleared.", 'bot');
        });

        fetchSystemStats();
        simulateNetworkActivity();
        
        // Boot Sequence
        setTimeout(() => addMsg("🌌 **AETHER_CORE INITIALIZED.** Welcome back, Avinash Pandey. All systems nominal.", 'bot'), 800);
    }

    document.addEventListener('DOMContentLoaded', init);
})();
