const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');
const Message = require('../models/Message');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Sample projects
const sampleProjects = [
    {
        title: 'AI Portfolio Assistant',
        description: 'An intelligent portfolio assistant powered by GPT-4 that answers questions about skills and experience.',
        longDescription: 'This project uses cutting-edge AI technology to create an interactive portfolio experience. Visitors can ask questions and get instant responses about my work, skills, and availability.',
        techStack: ['React', 'Node.js', 'OpenAI API', 'MongoDB', 'Socket.io'],
        githubLink: 'https://github.com/avinashpandey/ai-portfolio',
        liveLink: 'https://ai.avinash.dev',
        image: 'projects/ai-assistant.jpg',
        category: 'ai',
        featured: true,
        achievements: [
            'Winner of AI Innovation Challenge 2023',
            'Featured on Product Hunt',
            '500+ daily active users'
        ],
        views: 1234,
        likes: 89
    },
    {
        title: '3D Interactive Dashboard',
        description: 'Real-time analytics dashboard with Three.js visualizations and WebGL effects.',
        longDescription: 'A sophisticated dashboard that transforms complex data into interactive 3D visualizations. Perfect for monitoring business metrics in an engaging way.',
        techStack: ['Three.js', 'React', 'D3.js', 'WebGL', 'Express'],
        githubLink: 'https://github.com/avinashpandey/3d-dashboard',
        liveLink: 'https://dashboard.avinash.dev',
        image: 'projects/3d-dashboard.jpg',
        category: 'web',
        featured: true,
        achievements: [
            'Used by 50+ companies',
            'Performance optimized for 60fps',
            'Custom WebGL shaders'
        ],
        views: 2341,
        likes: 156
    },
    {
        title: 'E-Learning Platform',
        description: 'Complete online learning platform with video streaming, quizzes, and certifications.',
        longDescription: 'A comprehensive e-learning solution that supports live classes, recorded sessions, interactive quizzes, and automated certificate generation.',
        techStack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'AWS S3'],
        githubLink: 'https://github.com/avinashpandey/learnflow',
        liveLink: 'https://learnflow.avinash.dev',
        image: 'projects/learnflow.jpg',
        category: 'web',
        featured: false,
        achievements: [
            '10,000+ students enrolled',
            'Integrated with Stripe payments',
            'Real-time chat support'
        ],
        views: 3456,
        likes: 234
    },
    {
        title: 'Blockchain Voting System',
        description: 'Decentralized voting platform built on Ethereum for transparent elections.',
        longDescription: 'A secure and transparent voting system using blockchain technology. Each vote is recorded on the blockchain, ensuring immutability and verifiability.',
        techStack: ['Solidity', 'Web3.js', 'React', 'Hardhat', 'IPFS'],
        githubLink: 'https://github.com/avinashpandey/blockvote',
        liveLink: 'https://blockvote.avinash.dev',
        image: 'projects/blockvote.jpg',
        category: 'other',
        featured: true,
        achievements: [
            'Audited by CertiK',
            'Used in university elections',
            'Gas optimized smart contracts'
        ],
        views: 892,
        likes: 67
    },
    {
        title: 'AI Code Assistant',
        description: 'VS Code extension that provides AI-powered code suggestions and refactoring.',
        longDescription: 'An intelligent coding assistant that helps developers write better code faster. It suggests improvements, catches bugs, and even writes documentation.',
        techStack: ['TypeScript', 'TensorFlow.js', 'VS Code API', 'Python'],
        githubLink: 'https://github.com/avinashpandey/code-ai',
        liveLink: 'https://marketplace.visualstudio.com/items?code-ai',
        image: 'projects/code-ai.jpg',
        category: 'ai',
        featured: false,
        achievements: [
            '50,000+ downloads',
            '4.8/5 rating on marketplace',
            'Supports 20+ languages'
        ],
        views: 5678,
        likes: 445
    },
    {
        title: 'Real-time Chat Application',
        description: 'Feature-rich chat app with end-to-end encryption and video calling.',
        longDescription: 'A modern chat application that prioritizes privacy and user experience. Includes end-to-end encryption, group chats, file sharing, and video conferencing.',
        techStack: ['Socket.io', 'WebRTC', 'React Native', 'Redis', 'MongoDB'],
        githubLink: 'https://github.com/avinashpandey/secure-chat',
        liveLink: 'https://chat.avinash.dev',
        image: 'projects/secure-chat.jpg',
        category: 'mobile',
        featured: true,
        achievements: [
            'End-to-end encryption',
            'Video calls with 50+ participants',
            'Cross-platform support'
        ],
        views: 7890,
        likes: 678
    }
];

// Sample messages
const sampleMessages = [
    {
        name: 'John Smith',
        email: 'john@techstartup.com',
        subject: 'Project Collaboration Opportunity',
        message: 'Hi Avinash, I came across your portfolio and I\'m impressed by your work. I\'d love to discuss a potential collaboration on an AI project.',
        projectType: 'ai',
        budget: '$10,000 - $15,000',
        timeline: '3 months',
        status: 'unread'
    },
    {
        name: 'Sarah Johnson',
        email: 'sarah@designstudio.co',
        subject: 'Website Redesign',
        message: 'We need a complete redesign of our corporate website with interactive elements. Your 3D work looks perfect for what we have in mind.',
        projectType: 'web',
        budget: '$8,000 - $12,000',
        timeline: '2 months',
        status: 'read'
    },
    {
        name: 'Mike Chen',
        email: 'mike@ai-startup.io',
        subject: 'AI Integration Project',
        message: 'We\'re looking for an AI expert to help integrate GPT-4 into our existing platform. Are you available for a consultation?',
        projectType: 'ai',
        budget: '$5,000 - $7,000',
        timeline: '1 month',
        status: 'replied'
    },
    {
        name: 'Emma Wilson',
        email: 'emma@creativeagency.com',
        subject: 'Interactive Portfolio',
        message: 'I saw your 3D work and would love something similar for our agency\'s portfolio site. Can you create something custom for us?',
        projectType: 'web',
        budget: '$15,000 - $20,000',
        timeline: '4 months',
        status: 'unread'
    },
    {
        name: 'David Kumar',
        email: 'david@techcorp.com',
        subject: 'Full-time Position',
        message: 'We\'re looking for a Lead Full Stack Developer. Your experience matches what we need. Would you be interested in discussing?',
        projectType: 'consulting',
        budget: 'Negotiable',
        timeline: 'Full-time',
        status: 'read'
    }
];

// Seed database
const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Project.deleteMany({});
        await Message.deleteMany({});
        console.log('Cleared existing data');

        // Create admin user
        const adminUser = await User.create({
            name: 'Avinash Pandey',
            email: 'avinash@portfolio.com',
            password: 'Admin@123',
            role: 'admin',
            bio: 'Full Stack Developer and AI Enthusiast with 5+ years of experience creating innovative web solutions.',
            github: 'https://github.com/avinashpandey',
            linkedin: 'https://linkedin.com/in/avinashpandey',
            twitter: 'https://twitter.com/avinashpandey',
            website: 'https://avinash.dev',
            skills: ['React', 'Node.js', 'Python', 'Three.js', 'TensorFlow', 'MongoDB', 'AWS', 'Docker'],
            preferences: {
                theme: 'dark',
                notifications: true
            }
        });
        console.log('Admin user created:', adminUser.email);

        // Create sample user
        const sampleUser = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: 'Test@123',
            role: 'user',
            bio: 'Test user account',
            skills: ['JavaScript', 'HTML', 'CSS']
        });
        console.log('Sample user created:', sampleUser.email);

        // Create projects
        const createdProjects = await Project.insertMany(sampleProjects);
        console.log(`${createdProjects.length} projects created`);

        // Create messages with user references
        const messagesWithUser = sampleMessages.map(msg => ({
            ...msg,
            userId: sampleUser._id
        }));
        const createdMessages = await Message.insertMany(messagesWithUser);
        console.log(`${createdMessages.length} messages created`);

        console.log('Database seeded successfully!');
        
        // Display summary
        console.log('\n=== SEED SUMMARY ===');
        console.log(`Users: ${await User.countDocuments()}`);
        console.log(`Projects: ${await Project.countDocuments()}`);
        console.log(`Messages: ${await Message.countDocuments()}`);
        
        console.log('\nLogin credentials:');
        console.log('Admin - Email: avinash@portfolio.com, Password: Admin@123');
        console.log('Test User - Email: test@example.com, Password: Test@123');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();