// RealSeek - Chat & Streaming Connection Component
import { dom, state } from './config.js?v=1.3';
import { activateGraphNode, resetGraph, completeAllGraphNodes } from './graph.js?v=1.3';
import { parseInsights } from './insights.js?v=1.3';

export function initChat() {
    // Auto height for input textarea
    dom.chatInput.addEventListener('input', () => {
        dom.chatInput.style.height = 'auto';
        dom.chatInput.style.height = (dom.chatInput.scrollHeight - 4) + 'px';
        dom.sendBtn.disabled = !dom.chatInput.value.trim() || state.isSending;
    });

    // Send on Enter (unless shift is pressed)
    dom.chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!dom.sendBtn.disabled) {
                handleSend();
            }
        }
    });

    dom.sendBtn.addEventListener('click', handleSend);

    const newChatBtn = document.getElementById('new-chat-btn');
    if (newChatBtn) {
        newChatBtn.addEventListener('click', handleNewChat);
    }
}

export function handleNewChat() {
    // 1. Clear chat messages (except welcome screen)
    if (dom.chatMessages) {
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) {
            dom.chatMessages.innerHTML = '';
            dom.chatMessages.appendChild(welcomeScreen);
            welcomeScreen.style.display = 'flex';
        } else {
            dom.chatMessages.innerHTML = '';
        }
    }
    
    // 2. Clear input
    if (dom.chatInput) {
        dom.chatInput.value = '';
        dom.chatInput.style.height = 'auto';
        dom.chatInput.disabled = false;
    }
    if (dom.sendBtn) {
        dom.sendBtn.disabled = true;
    }
    
    // 3. Reset state & context
    state.isSending = false;
    state.chatContext = {};
    
    // 4. Reset flowchart
    resetGraph();
    
    // 5. Reset insights panel empty/populated states
    if (dom.insightsEmpty) {
        dom.insightsEmpty.style.display = 'flex';
    }
    if (dom.insightsPopulated) {
        dom.insightsPopulated.style.display = 'none';
    }
    if (dom.insightsListings) {
        dom.insightsListings.innerHTML = '';
    }
    if (dom.insightsMarket) {
        dom.insightsMarket.innerHTML = '';
    }
    if (dom.insightsNeighborhood) {
        dom.insightsNeighborhood.innerHTML = '';
    }
    
    // Re-create icons for welcome suggestions
    lucide.createIcons();
}

export async function handleSend() {
    const query = dom.chatInput.value.trim();
    if (!query || state.isSending) return;

    state.isSending = true;
    dom.chatInput.value = '';
    dom.chatInput.style.height = 'auto';
    dom.sendBtn.disabled = true;
    dom.chatInput.disabled = true;

    // Reset flowchart state
    resetGraph();
    activateGraphNode('user_intent_agent');

    // Hide welcome screen
    if (dom.welcomeScreen) {
        dom.welcomeScreen.style.display = 'none';
    }

    // Clear previous insights
    dom.insightsPopulated.style.display = 'none';
    dom.insightsEmpty.style.display = 'flex';

    // Add user message
    addMessage('user', query);

    // Setup empty assistant bubble
    const aiMsgBubble = addMessage('assistant', 'Searching...');

    // Start client-side timer to simulate active flowchart flow while request is running
    let flowSecs = 0;
    if (state.flowInterval) clearInterval(state.flowInterval);
    
    state.flowInterval = setInterval(() => {
        if (!state.isSending) {
            clearInterval(state.flowInterval);
            return;
        }
        flowSecs++;
        
        if (flowSecs === 5) {
            activateGraphNode('property_discovery_agent');
        } else if (flowSecs === 20) {
            activateGraphNode('market_intelligence_agent');
        } else if (flowSecs === 35) {
            activateGraphNode('neighborhood_intelligence_agent');
        } else if (flowSecs === 50) {
            activateGraphNode('deal_analyzer_agent');
        } else if (flowSecs === 65) {
            activateGraphNode('recommendation_agent');
        }
    }, 1000);

    // Call live Neuro SAN API
    try {
        const response = await fetch('http://localhost:8080/api/v1/generated/real_seek/streaming_chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_message: {
                    type: 'HUMAN',
                    text: query
                },
                chat_context: state.chatContext || {}
            })
        });

        if (!response.ok) {
            throw new Error(`Server returned HTTP ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let accumulatedText = '';

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            // Stream started returning text! Stop the workflow timer and jump directly to Recommendation Agent.
            if (state.flowInterval) {
                clearInterval(state.flowInterval);
                state.flowInterval = null;
            }
            activateGraphNode('recommendation_agent');

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop(); // save incomplete line

            for (const line of lines) {
                if (!line.trim()) continue;
                try {
                    const parsed = JSON.parse(line);
                    
                    // Sync active status bar if origin is found
                    if (parsed.response && parsed.response.origin) {
                        const originObj = parsed.response.origin[0];
                        if (originObj && originObj.tool) {
                            activateGraphNode(originObj.tool);
                        }
                    }

                    // Append streamed text chunk
                    if (parsed.response && parsed.response.text) {
                        accumulatedText += parsed.response.text;
                        updateAssistantMessage(aiMsgBubble, accumulatedText);
                        
                        // Parse insights in real-time
                        parseInsights(accumulatedText);
                    }

                    // Save context
                    if (parsed.response && parsed.response.chat_context) {
                        state.chatContext = parsed.response.chat_context;
                    }
                } catch (e) {
                    // Fallback
                }
            }
        }

        completeAllGraphNodes();
        
        // If response succeeded but returned nothing, show helpful warning
        if (!accumulatedText) {
            updateAssistantMessage(aiMsgBubble, `⚠️ **No response received from the agent network.**\n\nThis usually indicates that the LLM API key (e.g., Mistral) configured on the backend is invalid, rate-limited, or unauthorized. Please verify your environment credentials.`);
            import('./graph.js').then(g => g.setUIStatus('idle', 'Empty response received.'));
        }

    } catch (error) {
        console.error('Connection failed:', error);
        import('./graph.js').then(g => {
            g.setUIStatus('idle', 'Search failed.');
            g.resetGraph();
        });
        
        updateAssistantMessage(aiMsgBubble, `❌ **Connection to Real Estate Server failed.**\n\nPlease ensure the backend API server is running on port **8080** by executing:\n\`\`\`bash\n./start_backend.sh\n\`\`\``);
    } finally {
        state.isSending = false;
        dom.chatInput.disabled = false;
        dom.sendBtn.disabled = !dom.chatInput.value.trim();
        if (state.flowInterval) {
            clearInterval(state.flowInterval);
            state.flowInterval = null;
        }
    }
}

export function addMessage(role, text) {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', role);
    
    let htmlContent = text;
    if (window.marked && role === 'assistant') {
        htmlContent = marked.parse(text);
    } else {
        htmlContent = `<p>${text.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>")}</p>`;
    }

    const displayName = role === 'assistant' ? 'RealSeek Advisor' : 'You';

    msgDiv.innerHTML = `
        <div class="message-bubble">
            ${htmlContent}
        </div>
        <div class="message-meta">
            <span class="message-sender-tag">${displayName}</span>
            <span>${timeStr}</span>
        </div>
    `;

    dom.chatMessages.appendChild(msgDiv);
    scrollChatToBottom();
    
    return msgDiv;
}

export function updateAssistantMessage(msgElement, text) {
    const bubble = msgElement.querySelector('.message-bubble');
    if (window.marked) {
        bubble.innerHTML = marked.parse(text);
    } else {
        bubble.innerText = text;
    }
    scrollChatToBottom();
}

function scrollChatToBottom() {
    setTimeout(() => {
        dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;
    }, 50);
}
