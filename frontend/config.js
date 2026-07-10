// RealSeek - Global State & DOM Element Mapping

export const state = {
    chatContext: {},
    isSending: false,
    currentActiveAgent: null,
    flowInterval: null
};

// Map agent name to visual flowchart node activations
export const stepsList = [
    'user_intent_agent',
    'property_discovery_agent',
    'market_intelligence_agent',
    'neighborhood_intelligence_agent',
    'deal_analyzer_agent',
    'recommendation_agent'
];

export const dom = {
    chatMessages: document.getElementById('chat-messages'),
    chatInput: document.getElementById('chat-input'),
    sendBtn: document.getElementById('send-btn'),
    statusDot: document.getElementById('status-dot'),
    statusText: document.getElementById('status-text'),
    welcomeScreen: document.getElementById('welcome-screen'),
    
    // Calculator
    sliderPrice: document.getElementById('slider-price'),
    sliderDown: document.getElementById('slider-down'),
    sliderRate: document.getElementById('slider-rate'),
    selectTerm: document.getElementById('select-term'),
    displayPrice: document.getElementById('display-price'),
    displayDown: document.getElementById('display-down'),
    displayRate: document.getElementById('display-rate'),
    resultPayment: document.getElementById('result-payment'),
    resultLoan: document.getElementById('result-loan'),
    resultTotalInterest: document.getElementById('result-total-interest'),
    resultTotalPayment: document.getElementById('result-total-payment'),
    
    // Insights
    insightsEmpty: document.getElementById('insights-empty'),
    insightsPopulated: document.getElementById('insights-populated'),
    insightsListings: document.getElementById('insights-listings'),
    insightsMarket: document.getElementById('insights-market'),
    insightsNeighborhood: document.getElementById('insights-neighborhood')
};
