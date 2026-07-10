// RealSeek - Dynamic Insights Parsing Component
import { dom } from './config.js?v=1.3';

export function parseInsights(text) {
    if (!text) return;
    
    // 1. Extract markdown links: [Title](URL)
    const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g;
    let match;
    const links = [];
    while ((match = linkRegex.exec(text)) !== null) {
        links.push({ text: match[1], url: match[2] });
    }
    
    // Map links into card structures
    const propertyCards = [];
    links.forEach((link, idx) => {
        let domain = 'Website';
        try {
            const parsedUrl = new URL(link.url);
            domain = parsedUrl.hostname.replace('www.', '');
        } catch (e) {
            // fallback
        }

        // Try to guess price/rent in the surrounding context dynamically
        let price = 'View Listing';
        
        // Search 150 characters before and 250 characters after the link
        const linkIndex = text.indexOf(link.text);
        const searchRange = text.substring(
            Math.max(0, linkIndex - 150),
            Math.min(text.length, linkIndex + 250)
        );

        // Match USD ($500,000) or INR (₹9,000 or Rs. 8000) prices
        const priceRegex = /(?:[\$\u20B9]|Rs\.?)\s*([0-9\.,]{3,10})(?:\s*\/month)?/i;
        const priceMatch = priceRegex.exec(searchRange);
        if (priceMatch) {
            price = priceMatch[0];
        }

        propertyCards.push({
            title: link.text,
            url: link.url,
            domain: domain,
            price: price
        });
    });

    // Populate Listings
    if (propertyCards.length > 0 && dom.insightsListings) {
        dom.insightsListings.innerHTML = propertyCards.map((p, idx) => `
            <div class="listing-card">
                <div class="listing-card-header">
                    <h4 class="listing-title">${p.title}</h4>
                    <span class="listing-price">${p.price}</span>
                </div>
                <div class="listing-url-text" title="${p.url}">${p.url}</div>
                <div class="listing-meta-row">
                    <span class="listing-meta-badge source-badge">${p.domain}</span>
                    <span class="listing-meta-badge score">Match Score: ${98 - idx * 2}%</span>
                </div>
                <a href="${p.url}" target="_blank" class="listing-btn">
                    <i data-lucide="external-link"></i>
                    <span>Go to Website</span>
                </a>
            </div>
        `).join('');
        lucide.createIcons();
    }

    // 2. Extract Market Trends dynamically
    const textLower = text.toLowerCase();
    let marketMetrics = [];
    
    const marketStateMatch = /(?:market\s+state|market\s+trend|demand)\s*:\s*\*?([^\*\n<]+)\*?/i.exec(text);
    const avgPriceMatch = /(?:median\s+home\s+price|median\s+price|average\s+price|average\s+rent|avg\s+rent|rent)\s*:\s*\*?([^\*\n<]+)\*?/i.exec(text);
    const inventoryMatch = /(?:inventory|lead\s+time|booking\s+lead\s+time|avg\s+inventory)\s*:\s*\*?([^\*\n<]+)\*?/i.exec(text);

    if (marketStateMatch) {
        marketMetrics.push({ name: 'Market State', val: marketStateMatch[1].trim() });
    }
    if (avgPriceMatch) {
        marketMetrics.push({ name: 'Average Price / Rent', val: avgPriceMatch[1].trim() });
    }
    if (inventoryMatch) {
        marketMetrics.push({ name: 'Inventory / Lead Time', val: inventoryMatch[1].trim() });
    }

    if (dom.insightsMarket) {
        if (marketMetrics.length > 0) {
            dom.insightsMarket.innerHTML = marketMetrics.map(m => `
                <div class="metric-item">
                    <span>${m.name}:</span>
                    <span class="val">${m.val}</span>
                </div>
            `).join('');
        } else {
            const marketIndex = textLower.indexOf('market');
            if (marketIndex !== -1) {
                const snippet = text.substring(marketIndex, marketIndex + 200).replace(/\*/g, '').trim();
                dom.insightsMarket.innerHTML = `<p class="metric-advice">${snippet}...</p>`;
            } else {
                dom.insightsMarket.innerHTML = `<p class="metric-advice">Awaiting detailed market data from Agent...</p>`;
            }
        }
    }

    // 3. Extract Neighborhood Index dynamically
    let neighborhoodMetrics = [];
    const safetyMatch = /(?:safety\s+rate|safety|crime)\s*:\s*\*?([^\*\n<]+)\*?/i.exec(text);
    const schoolMatch = /(?:schools?|education|amenities)\s*:\s*\*?([^\*\n<]+)\*?/i.exec(text);
    const transitMatch = /(?:transit|walkability|walk\s+score|transit\s+score)\s*:\s*\*?([^\*\n<]+)\*?/i.exec(text);

    if (safetyMatch) {
        neighborhoodMetrics.push({ name: 'Safety Rating', val: safetyMatch[1].trim() });
    }
    if (schoolMatch) {
        neighborhoodMetrics.push({ name: 'Amenities / Schools', val: schoolMatch[1].trim() });
    }
    if (transitMatch) {
        neighborhoodMetrics.push({ name: 'Transit / Walk Score', val: transitMatch[1].trim() });
    }

    if (dom.insightsNeighborhood) {
        if (neighborhoodMetrics.length > 0) {
            dom.insightsNeighborhood.innerHTML = neighborhoodMetrics.map(n => `
                <div class="metric-item">
                    <span>${n.name}:</span>
                    <span class="val">${n.val}</span>
                </div>
            `).join('');
        } else {
            const neighborhoodIndex = textLower.indexOf('neighborhood');
            if (neighborhoodIndex !== -1) {
                const snippet = text.substring(neighborhoodIndex, neighborhoodIndex + 200).replace(/\*/g, '').trim();
                dom.insightsNeighborhood.innerHTML = `<p class="metric-advice">${snippet}...</p>`;
            } else {
                dom.insightsNeighborhood.innerHTML = `<p class="metric-advice">Awaiting detailed neighborhood data from Agent...</p>`;
            }
        }
    }

    // Show populated panel once we have properties/links
    if (propertyCards.length > 0) {
        dom.insightsEmpty.style.display = 'none';
        dom.insightsPopulated.style.display = 'block';
    }
}
