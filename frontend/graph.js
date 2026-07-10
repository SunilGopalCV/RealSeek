// RealSeek - Flowchart Graph Visualization Component
import { dom, stepsList, state } from './config.js?v=1.3';

export function drawConnectionLines() {
    const svg = document.getElementById('graph-svg');
    if (!svg) return;
    svg.innerHTML = '';
    
    const hub = document.getElementById('node-master_orchestrator_agent');
    if (!hub) return;
    
    const hubOrb = hub.querySelector('.hub-orb') || hub;
    const hubRect = hubOrb.getBoundingClientRect();
    const containerRect = svg.getBoundingClientRect();
    
    const x1 = (hubRect.left + hubRect.width / 2) - containerRect.left;
    const y1 = (hubRect.top + hubRect.height / 2) - containerRect.top;
    
    stepsList.forEach((step) => {
        const sat = document.getElementById(`node-${step}`);
        if (!sat) return;
        
        const satRect = sat.getBoundingClientRect();
        
        // Calculate closest edge (left or right) of the satellite node to the hub
        const satCenterX = satRect.left + satRect.width / 2;
        const hubCenterX = hubRect.left + hubRect.width / 2;
        
        let x2;
        const y2 = (satRect.top + satRect.height / 2) - containerRect.top;
        
        if (satCenterX < hubCenterX) {
            // Satellite is on the left of the hub: connect to its right edge
            x2 = satRect.right - containerRect.left;
        } else {
            // Satellite is on the right of the hub: connect to its left edge
            x2 = satRect.left - containerRect.left;
        }
        
        // Draw a smooth cubic Bezier curve instead of a straight line
        const dx = Math.abs(x1 - x2) * 0.5;
        const cp1x = satCenterX < hubCenterX ? x1 - dx : x1 + dx;
        const cp2x = satCenterX < hubCenterX ? x2 + dx : x2 - dx;
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${x1} ${y1} C ${cp1x} ${y1}, ${cp2x} ${y2}, ${x2} ${y2}`);
        
        let stateClass = 'pending';
        if (sat.classList.contains('active')) {
            stateClass = 'active';
        } else if (sat.classList.contains('completed')) {
            stateClass = 'completed';
        }
        
        path.setAttribute('class', `graph-line ${stateClass}`);
        svg.appendChild(path);
    });
}

export function activateGraphNode(agentName) {
    if (!agentName) return;
    
    const nodeName = mapToolToAgentName(agentName);
    if (!nodeName) return;

    const targetNode = document.getElementById(`node-${nodeName}`);
    if (!targetNode || targetNode.classList.contains('completed')) return;
    
    const currentIndex = stepsList.indexOf(nodeName);
    
    // Set hub as active
    const hub = document.getElementById('node-master_orchestrator_agent');
    if (hub) hub.className = 'hub-node active';
    
    // 1. Mark all preceding nodes as completed
    for (let i = 0; i < currentIndex; i++) {
        const step = stepsList[i];
        const el = document.getElementById(`node-${step}`);
        if (el) {
            el.className = 'sat-node completed';
        }
    }
    
    // 2. Set target node as Active
    targetNode.className = 'sat-node active';
    
    // 3. Keep subsequent nodes as pending
    for (let i = currentIndex + 1; i < stepsList.length; i++) {
        const step = stepsList[i];
        const el = document.getElementById(`node-${step}`);
        if (el) {
            el.className = 'sat-node pending';
        }
    }

    state.currentActiveAgent = nodeName;
    const friendlyMsg = mapToolToFriendlyStatus(nodeName);
    setUIStatus('active', friendlyMsg);
    
    // Redraw connections with correct active/completed styles
    drawConnectionLines();
}

export function completeAllGraphNodes() {
    const hub = document.getElementById('node-master_orchestrator_agent');
    if (hub) hub.className = 'hub-node completed';
    
    stepsList.forEach((step) => {
        const el = document.getElementById(`node-${step}`);
        if (el) {
            el.className = 'sat-node completed';
        }
    });
    setUIStatus('idle', 'Search completed.');
    state.currentActiveAgent = null;
    
    drawConnectionLines();
}

export function resetGraph() {
    const hub = document.getElementById('node-master_orchestrator_agent');
    if (hub) hub.className = 'hub-node pending';
    
    stepsList.forEach((step) => {
        const el = document.getElementById(`node-${step}`);
        if (el) {
            el.className = 'sat-node pending';
        }
    });
    setUIStatus('idle', 'Ready to assist you. Ask a query to begin.');
    state.currentActiveAgent = null;
    
    drawConnectionLines();
}

export function setUIStatus(statusState, friendlyMessage) {
    if (statusState === 'active') {
        dom.statusDot.className = 'status-pulse active';
        dom.statusText.innerText = friendlyMessage;
    } else {
        dom.statusDot.className = 'status-pulse idle';
        dom.statusText.innerText = friendlyMessage;
    }
}

// Map tech tool key to standard pipeline agent names
function mapToolToAgentName(toolName) {
    if (!toolName) return null;
    const name = toolName.toLowerCase();
    
    if (name.includes('user_intent') || name.includes('clarify') || name.includes('orchestrator')) {
        return 'user_intent_agent';
    }
    if (name.includes('discovery') || name.includes('search') || name.includes('find_properties') || name.includes('internet')) {
        return 'property_discovery_agent';
    }
    if (name.includes('market') || name.includes('intelligence') || name.includes('trend')) {
        return 'market_intelligence_agent';
    }
    if (name.includes('neighborhood') || name.includes('school') || name.includes('safety')) {
        return 'neighborhood_intelligence_agent';
    }
    if (name.includes('deal') || name.includes('analyzer') || name.includes('roi')) {
        return 'deal_analyzer_agent';
    }
    if (name.includes('recommend') || name.includes('synthes')) {
        return 'recommendation_agent';
    }
    
    return null;
}

// Map technical tool names to user-friendly status descriptions
function mapToolToFriendlyStatus(agentKey) {
    switch (agentKey) {
        case 'user_intent_agent':
            return 'Analyzing search parameters...';
        case 'property_discovery_agent':
            return 'Searching active real estate listings across the web...';
        case 'market_intelligence_agent':
            return 'Reviewing local market trends and property values...';
        case 'neighborhood_intelligence_agent':
            return 'Evaluating safety reports and local school scores...';
        case 'deal_analyzer_agent':
            return 'Reviewing deal affordability and financial estimates...';
        case 'recommendation_agent':
            return 'Formulating final recommendations and web listings...';
        default:
            return 'Searching houses across the web...';
    }
}
