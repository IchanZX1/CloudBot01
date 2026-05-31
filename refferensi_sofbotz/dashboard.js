const os = require("os");
const pm2 = require("pm2");
const { exec } = require("child_process");
const config = require("./config.json");

function checkApiKey(req, res, next) {
  const key = req.headers["x-api-key"] || req.query.apikey;
  if (!key || key !== config.dashboard.apikey) {
    return res.status(403).json({ error: true, message: "Invalid API Key" });
  }
  next();
}

function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  seconds %= 86400;
  const h = Math.floor(seconds / 3600);
  seconds %= 3600;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${d} Hari, ${h} Jam, ${m} Menit, ${s} Detik`;
}

module.exports = function dashboardRoutes(app, db) {
  app.get("/api/dashboard/stats", checkApiKey, async (req, res) => {
    const start = Date.now();

    try {
      const userRes = await db.query("SELECT COUNT(*) FROM users");
      const botRes = await db.query("SELECT COUNT(*) FROM bot");

      pm2.list((err, list) => {
        const pm2List = err ? [] : list;

        const botOnline = pm2List.filter(
          (p) => p.pm2_env?.status === "online"
        ).length;

        const botOffline = Number(botRes.rows[0].count) - botOnline;

        const ramUsed = process.memoryUsage().rss / 1024 / 1024;
        const ramTotal = os.totalmem() / 1024 / 1024;
        const ramFree = os.freemem() / 1024 / 1024;
        const ramPercent = ((ramUsed / ramTotal) * 100).toFixed(1) + "%";

        const cores = os.cpus().length;
        const load1 = os.loadavg()[0];
        const load5 = os.loadavg()[1];
        const load15 = os.loadavg()[2];
        const cpuPercent = ((load1 / cores) * 100).toFixed(1) + "%";

        exec("df -h / | tail -1 | awk '{print $3, $2}'", (_, stdout) => {
          const [diskUsed, diskTotal] = stdout
            ? stdout.trim().split(" ")
            : ["N/A", "N/A"];

          res.json({
            total_user: Number(userRes.rows[0].count),
            total_bot: Number(botRes.rows[0].count),
            bot_online: botOnline,
            bot_offline: botOffline,

            system: {
              hostname: os.hostname(),
              platform: os.platform(),
              arch: os.arch(),
              node: process.version,
              cores,
              uptime: formatUptime(os.uptime()),
            },

            resources: {
              ram: {
                used: `${ramUsed.toFixed(0)} MB`,
                free: `${ramFree.toFixed(0)} MB`,
                total: `${ramTotal.toFixed(0)} MB`,
                percent: ramPercent,
              },
              cpu: {
                usage: cpuPercent,
                loadavg: {
                  "1m": load1.toFixed(2),
                  "5m": load5.toFixed(2),
                  "15m": load15.toFixed(2),
                },
              },
              disk: {
                used: diskUsed,
                total: diskTotal,
              },
              pm2_process: pm2List.length,
              speed: `${Date.now() - start}ms`,
              online: formatUptime(process.uptime()),
            },
          });
        });
      });
    } catch {
      res.status(500).json({ error: true });
    }
  });
};
