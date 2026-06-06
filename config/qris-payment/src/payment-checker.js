const axios = require('axios');

class PaymentChecker {
    constructor(config) {
        if (!config.merchant || !config.auth_username || !config.auth_token) {
            throw new Error('merchant, auth_username, dan auth_token harus diisi');
        }
        this.config = {
            merchant: config.merchant,
            auth_username: config.auth_username,
            auth_token: config.auth_token
        };
    }
    
    async checkPaymentStatus(reference, amount) {
        try {
            if (!reference || !amount || amount <= 0) {
                throw new Error('Reference dan amount harus diisi dengan benar');
            }
            
            const response = await axios.post(
                'https://orkut.fightertunnel.net/api/orderkuota-qr-mutasi',
                {
                    merchant: this.config.merchant,
                    auth_username: this.config.auth_username,
                    auth_token: this.config.auth_token
                },
                {
                    headers: {
                        'Authorization': 'Bearer AutoFtbot-FD6OkVWgidESBvVHuQ',
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (!response.data || !response.data.status || !response.data.data) {
                throw new Error('Response tidak valid dari server');
            }
            
            const transactions = response.data.data;
            
            const matchingTransactions = transactions.filter(tx => {
                const txAmount = parseInt(tx.amount);
                const txDate = new Date(tx.date);
                const now = new Date();
                const timeDiff = now - txDate;
                
                return txAmount === amount && 
                       tx.qris === "static" &&
                       tx.type === "CR" &&
                       timeDiff <= 5 * 60 * 1000;
            });

            if (matchingTransactions.length > 0) {
                const latestTransaction = matchingTransactions.reduce((latest, current) => {
                    const currentDate = new Date(current.date);
                    const latestDate = new Date(latest.date);
                    return currentDate > latestDate ? current : latest;
                });
                
                return {
                    success: true,
                    data: {
                        status: 'PAID',
                        amount: parseInt(latestTransaction.amount),
                        reference: latestTransaction.issuer_reff,
                        date: latestTransaction.date,
                        brand_name: latestTransaction.brand_name,
                        buyer_reff: latestTransaction.buyer_reff
                    }
                };
            }
            
            return {
                success: true,
                data: {
                    status: 'UNPAID',
                    amount: amount,
                    reference: reference
                }
            };
        } catch (error) {
            return {
                success: false,
                error: 'Gagal cek status pembayaran: ' + error.message
            };
        }
    }
}

module.exports = PaymentChecker;