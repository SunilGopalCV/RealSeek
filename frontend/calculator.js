// RealSeek - Mortgage Calculator Component
import { dom } from './config.js?v=1.3';

export function initCalculator() {
    if (!dom.sliderPrice) return;

    dom.sliderPrice.addEventListener('input', () => {
        const price = parseInt(dom.sliderPrice.value);
        dom.sliderDown.max = price;
        if (parseInt(dom.sliderDown.value) > price) {
            dom.sliderDown.value = Math.floor(price * 0.2);
        }
        updateCalculator();
    });

    dom.sliderDown.addEventListener('input', updateCalculator);
    dom.sliderRate.addEventListener('input', updateCalculator);
    dom.selectTerm.addEventListener('change', updateCalculator);

    updateCalculator();
}

export function updateCalculator() {
    const price = parseInt(dom.sliderPrice.value);
    const down = parseInt(dom.sliderDown.value);
    const rate = parseFloat(dom.sliderRate.value);
    const term = parseInt(dom.selectTerm.value);

    dom.displayPrice.innerText = formatCurrency(price);
    
    const downPct = Math.round((down / price) * 100);
    dom.displayDown.innerText = `${formatCurrency(down)} (${downPct}%)`;
    dom.displayRate.innerText = `${rate}%`;

    const principal = price - down;
    const monthlyRate = (rate / 100) / 12;
    const numPayments = term * 12;

    let monthly = 0;
    if (monthlyRate === 0) {
        monthly = principal / numPayments;
    } else {
        monthly = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    }

    if (isNaN(monthly) || monthly < 0) {
        monthly = 0;
    }

    const totalPaid = monthly * numPayments;
    const totalInterest = Math.max(0, totalPaid - principal);

    dom.resultPayment.innerText = formatCurrency(Math.round(monthly));
    dom.resultLoan.innerText = formatCurrency(principal);
    dom.resultTotalInterest.innerText = formatCurrency(Math.round(totalInterest));
    dom.resultTotalPayment.innerText = formatCurrency(Math.round(totalPaid));
}

function formatCurrency(num) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(num);
}
