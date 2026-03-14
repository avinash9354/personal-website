// AI Chatbot for Avinash's Portfolio
class PortfolioChatbot {
    constructor() {
        this.messages = [];
        this.isOpen = false;
        this.init();
    }
    
    init() {
        this.createChatbotUI();
        this.addEventListeners();
        this.trainChatbot();
    }
    
    createChatbotUI() {
        const chatbotHTML = `
            <div class="chatbot-container">
                <div class="chatbot-button" id="chatbot-toggle">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="chatbot-window" id="chatbot-window">
                    <div class="chatbot-header">
                        <h3>Ask about Avinash</h3>
                        <button class="close-chatbot"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="chatbot-messages" id="chatbot-messages">
                        <div class="message bot-message">
                            Hi! I'm Avinash's AI assistant. Ask me anything about his skills, projects, or experience!
                        </div>
                    </div>
                    <div class="chatbot-input">
                        <input type="text" id="chatbot-input" placeholder="Type your message...">
                        <button class="neon-button" id="send-message"><i class="fas fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }
    
    addEventListeners() {
        document.getElementById('chatbot-toggle').addEventListener('click', () => this.toggleChatbot());
        document.querySelector('.close-chatbot').addEventListener('click', () => this.toggleChatbot());
        document.getElementById('send-message').addEventListener('click', () => this.sendMessage());
        document.getElementById('chatbot-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }
    
    toggleChatbot() {
        this.isOpen = !this.isOpen;
        const window = document.getElementById('chatbot-window');
        if (this.isOpen) {
            window.classList.add('active');
        } else {
            window.classList.remove('active');
        }
    }
    
    trainChatbot() {
        // Knowledge base about Avinash
        this.knowledgeBase = [
            {
                keywords: ['who', 'avinash', 'about'],
                response: "Avinash Pandey is a passionate Full Stack Developer and AI enthusiast with 5+ years of experience. He specializes in creating innovative web solutions and AI-powered applications."
            },
            {
                keywords: ['skills', 'technologies', 'tech stack'],
                response: "Avinash's core skills include: React.js, Node.js, Python, Three.js, TensorFlow, MongoDB, AWS, and Docker. He's also proficient in AI/ML and blockchain technologies."
            },
            {
                keywords: ['projects', 'work', 'portfolio'],
                response: "Avinash has worked on 50+ projects including AI chatbots, e-commerce platforms, blockchain applications, and real-time analytics dashboards. Check out his Projects page for detailed case studies!"
            },
            {
                keywords: ['experience', 'work experience', 'job'],
                response: "Avinash has 5+ years of experience working with top tech companies. He's worked as a Senior Full Stack Developer at TechCorp, Lead AI Engineer at InnovateLabs, and currently runs his own dev agency."
            },
            {
                keywords: ['contact', 'hire', 'freelance'],
                response: "You can hire Avinash for freelance projects! Visit the Hire Me page to submit your project details, or use the Contact form to get in touch directly."
            },
            {
                keywords: ['education', 'degree', 'qualification'],
                response: "Avinash holds a Master's degree in Computer Science from Stanford University and has multiple certifications in AI, Cloud Computing, and Blockchain Development."
            },
            {
                keywords: ['github', 'code', 'repository'],
                response: "You can find Avinash's GitHub at github.com/avinashpandey. He has 100+ public repositories and contributes to open-source projects regularly."
            },
            {
                keywords: ['blog', 'articles', 'tutorials'],
                response: "Avinash writes technical blogs about AI, Web Development, and Career Growth. Check out his Blog page for the latest articles and tutorials!"
            },
            {
                keywords: ['achievements', 'awards', 'recognition'],
                response: "Avinash has won multiple hackathons, including the Google AI Challenge 2023. He's also a Google Developer Expert and Microsoft MVP."
            },
            {
                keywords: ['pricing', 'cost', 'rate'],
                response: "Avinash offers flexible pricing based on project requirements. Visit the Hire Me page to get a customized quote for your project!"
            }
        ];
    }
    
    sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();
        
        if (message) {
            this.addMessage(message, 'user');
            input.value = '';
            
            // Get bot response
            setTimeout(() => {
                const response = this.getBotResponse(message);
                this.addMessage(response, 'bot');
            }, 500);
        }
    }
    
    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    getBotResponse(userMessage) {
        userMessage = userMessage.toLowerCase();
        
        // Check for exact matches first
        for (const item of this.knowledgeBase) {
            for (const keyword of item.keywords) {
                if (userMessage.includes(keyword)) {
                    return item.response;
                }
            }
        }
        
        // Default responses
        const defaultResponses = [
            "I'm not sure about that. Could you ask me something about Avinash's skills, projects, or experience?",
            "That's interesting! Would you like to know about Avinash's work instead?",
            "I specialize in answering questions about Avinash. Feel free to ask about his skills, projects, or how to hire him!",
            "Let me redirect you to Avinash's Projects page for more details!"
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
}

// Initialize chatbot
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioChatbot();
});