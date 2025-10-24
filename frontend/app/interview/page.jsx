"use client";
import React, { useState } from 'react';
import ChatLayout from '../../components/ChatLayout';

const Interview = () => {
    const [messages, setMessages] = useState([
        {
            id: '1',
            text: 'Hello! How can I help you today?',
            sender: 'bot',
            timestamp: new Date()
        },
        {
            id: '2',
            text: 'I have a question about your services.',
            sender: 'user',
            timestamp: new Date()
        },
        {
            id: '3',
            text: 'Of course! I\'d be happy to answer any questions you have. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Autem quod impedit labore? Placeat optio atque quae laudantium, esse assumenda rem.',
            sender: 'bot',
            timestamp: new Date()
        },
        {
            id: '4',
            text: 'What are your hours of operation?',
            sender: 'user',
            timestamp: new Date()
        },
        {
            id: '5',
            text: 'Of course! I\'d be happy to answer any questions you have. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Autem quod impedit labore? Placeat optio atque quae laudantium, esse assumenda rem.',
            sender: 'bot',
            timestamp: new Date()
        },
        {
            id: '6',
            text: 'What are your hours of operation?',
            sender: 'user',
            timestamp: new Date()
        },
        {
            id: '7',
            text: 'Of course! I\'d be happy to answer any questions you have. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Autem quod impedit labore? Placeat optio atque quae laudantium, esse assumenda rem.',
            sender: 'bot',
            timestamp: new Date()
        },
        {
            id: '8',
            text: 'What are your hours of operation?',
            sender: 'user',
            timestamp: new Date()
        }
    ]);

    const handleSendMessage = (text) => {
        const newMessage = {
            id: Date.now().toString(),
            text,
            sender: 'user',
            timestamp: new Date()
        };
        setMessages([...messages, newMessage]);

        // Simulate bot response
        setTimeout(() => {
            const botMessage = {
                id: (Date.now() + 1).toString(),
                text: 'Thanks for your message! This is a demo response.',
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
        }, 1000);
    };

    return <ChatLayout messages={messages} onSendMessage={handleSendMessage} />;
};

export default Interview;