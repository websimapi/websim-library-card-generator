import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';

// DOM Elements
const input = document.getElementById('cardNumberInput');
const btnBarcode = document.getElementById('btnBarcode');
const btnQrcode = document.getElementById('btnQrcode');
const btnPrint = document.getElementById('btnPrint');
const barcodeEl = document.getElementById('barcodeElement');
const qrcodeEl = document.getElementById('qrcodeElement');
const displayNumber = document.getElementById('displayNumber');

let currentMode = 'barcode'; // Tracks whether 'barcode' or 'qrcode' is selected

/**
 * Validates and formats the input, then generates the requested visual code.
 */
function generateCode() {
    const val = input.value.trim();
    
    // Display raw text representation on the card
    displayNumber.textContent = val;

    // Handle empty state gracefully
    if (!val) {
        barcodeEl.style.display = 'none';
        qrcodeEl.style.display = 'none';
        return;
    }

    if (currentMode === 'barcode') {
        barcodeEl.style.display = 'block';
        qrcodeEl.style.display = 'none';
        
        try {
            // Generate standard CODE128 barcode 
            JsBarcode(barcodeEl, val, {
                format: "CODE128",
                lineColor: "#000",
                background: "transparent",
                width: 2.5,
                height: 80,
                displayValue: false, // Text is displayed manually via DOM
                margin: 0
            });
        } catch (error) {
            console.error("Barcode generation error:", error);
            // Fallback clear visual on invalid format
            barcodeEl.style.display = 'none'; 
        }
    } else {
        barcodeEl.style.display = 'none';
        qrcodeEl.style.display = 'block';
        
        // Generate QR code
        QRCode.toCanvas(qrcodeEl, val, {
            width: 140,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        }, function (error) {
            if (error) console.error("QR Code generation error:", error);
        });
    }
}

// Event Listeners
input.addEventListener('input', generateCode);

// Select all text when clicking the input for easy replacement
input.addEventListener('focus', () => {
    input.select();
});

btnBarcode.addEventListener('click', () => {
    if (currentMode === 'barcode') return;
    currentMode = 'barcode';
    btnBarcode.classList.add('active');
    btnQrcode.classList.remove('active');
    generateCode();
});

btnQrcode.addEventListener('click', () => {
    if (currentMode === 'qrcode') return;
    currentMode = 'qrcode';
    btnQrcode.classList.add('active');
    btnBarcode.classList.remove('active');
    generateCode();
});

btnPrint.addEventListener('click', () => {
    window.print();
});

// Initialize app with a demo card number to show the user how it looks
window.addEventListener('DOMContentLoaded', () => {
    input.value = "294380101934";
    generateCode();
});