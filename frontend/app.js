// RealSeek - Premium Client Application Bootstrap (Modular Entrypoint)
import { initCalculator } from './calculator.js?v=1.3';
import { drawConnectionLines } from './graph.js?v=1.3';
import { initChat, handleSend } from './chat.js?v=1.3';
import { dom } from './config.js?v=1.3';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();
    
    // Initialize Components
    initCalculator();
    initChat();

    // Tab Switching Logic
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Toggle button states
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Toggle tab content visibility
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => content.classList.remove('active'));
            
            const targetContent = document.getElementById(`tab-${targetTab}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // Suggestion select click handler
    window.selectSuggestion = function(text) {
        if (dom.chatInput && !dom.chatInput.disabled) {
            dom.chatInput.value = text;
            dom.chatInput.dispatchEvent(new Event('input'));
            handleSend();
        }
    };

    // Draw flowchart connections
    setTimeout(drawConnectionLines, 200);
    window.addEventListener('resize', drawConnectionLines);
});
