const fs = require("fs")
const path = require("path")
const { HttpsProxyAgent } = require("https-proxy-agent")

function getRandomProxyAgent() {
  try {
    const filePath = path.join(__dirname, "proxy.txt")
    const raw = fs.readFileSync(filePath, "utf-8")
    const proxies = raw.trim().split("\n").filter(Boolean)

    if (!proxies.length)
      return { agent: null, used: "Tanpa proxy" }

    const proxy = proxies[Math.floor(Math.random() * proxies.length)]
    const [host, port, user, pass] = proxy.split(":")

    const auth =
      user && pass
        ? `${encodeURIComponent(user)}:${encodeURIComponent(pass)}@`
        : ""

    const proxyUrl = `http://${auth}${host}:${port}`
    const agent = new HttpsProxyAgent(proxyUrl)

    return {
      agent,
      used: `${host}:${port}`
    }

  } catch (e) {
    return { agent: null, used: "Tanpa proxy" }
  }
}

module.exports = { getRandomProxyAgent }