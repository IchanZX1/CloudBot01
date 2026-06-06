const QRISGenerator = require('./qr-generator');

class QRISPayment {
    constructor(config) {
        this.qrGenerator = new QRISGenerator(config);
        this.config = config;
        this.paymentChecker = null;
        this.receiptGenerator = null;
    }

    async generateQR(amount) {
        const qrString = this.qrGenerator.generateQrString(amount);
        const qrBuffer = await this.qrGenerator.generateQRWithLogo(qrString);
        return {
            qrString,
            qrBuffer
        };
    }

    async checkPayment(reference, amount) {
        if (!this.paymentChecker) {
            const PaymentChecker = require('./payment-checker');
            this.paymentChecker = new PaymentChecker(this.config);
        }
        const result = await this.paymentChecker.checkPaymentStatus(reference, amount);
        if (result.success && result.data.status === 'PAID') {
            if (!this.receiptGenerator) {
                const ReceiptGenerator = require('./receipt-generator');
                this.receiptGenerator = new ReceiptGenerator(this.config);
            }
            const receipt = await this.receiptGenerator.generateReceipt(result.data);
            result.receipt = receipt;
        }
        
        return result;
    }

    async generateReceipt(transactionData) {
        if (!this.receiptGenerator) {
            const ReceiptGenerator = require('./receipt-generator');
            this.receiptGenerator = new ReceiptGenerator(this.config);
        }
        return await this.receiptGenerator.generateReceipt(transactionData);
    }
}

module.exports = QRISPayment;
