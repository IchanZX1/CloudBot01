// lib/cashify/CashifyPayment.js

class CashifyPayment {
  constructor({ licenseKey, qrisId, apiBase = 'https://cashify.my.id/api/generate' }) {
    if (!licenseKey) throw new Error('licenseKey wajib diisi')
    if (!qrisId) throw new Error('qrisId wajib diisi')

    this.licenseKey = licenseKey
    this.qrisId = qrisId
    this.apiBase = apiBase
  }

  async request(endpoint, body = {}) {
    const res = await fetch(`${this.apiBase}${endpoint}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-license-key': this.licenseKey
      },
      body: JSON.stringify(body)
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error(`Cashify Error ${res.status}: ${JSON.stringify(data)}`)
    }

    return data
  }

  async createQris({
    amount,
    useUniqueCode = true,
    packageIds = ['id.dana'],
    expiredInMinutes = 15
  }) {
    if (!amount || amount <= 0) {
      throw new Error('amount harus lebih dari 0')
    }

    const response = await this.request('/qris', {
      id: this.qrisId,
      amount,
      useUniqueCode,
      packageIds,
      expiredInMinutes
    })

    return {
      status: response.status,
      transactionId: response?.data?.transactionId,
      qrString: response?.data?.qr_string,
      originalAmount: response?.data?.originalAmount,
      totalAmount: response?.data?.totalAmount,
      uniqueNominal: response?.data?.uniqueNominal,
      useUniqueCode: response?.data?.useUniqueCode,
      packageIds: response?.data?.packageIds,
      raw: response
    }
  }

  async checkStatus(transactionId) {
    if (!transactionId) {
      throw new Error('transactionId wajib diisi')
    }

    const response = await this.request('/check-status', {
      transactionId
    })

    return {
      status: response.status,
      transactionId: response?.data?.transactionId,
      amount: response?.data?.amount,
      paymentStatus: response?.data?.status,
      expiredAt: response?.data?.expiredAt,
      raw: response
    }
  }

  async cancelStatus(transactionId) {
    if (!transactionId) {
      throw new Error('transactionId wajib diisi')
    }

    const response = await this.request('/cancel-status', {
      transactionId
    })

    return {
      status: response.status,
      message: response.message,
      transactionId: response?.data?.transactionId,
      paymentStatus: response?.data?.status,
      canceledAt: response?.data?.canceledAt,
      raw: response
    }
  }
}

module.exports = CashifyPayment
module.exports.CashifyPayment = CashifyPayment
