// rpg_tools.js (Menggantikan mining.js)

const fs = require("fs");
const path = require("path");
const { getUserExp, saveExpData, loadExpData } = require("./exp");

// 🔴 PERUBAHAN PATH: Menggunakan path relatif ke folder database
const INVENTORY_DB_PATH = "./database/rpg_inv.json";

const ITEMS = {
  // ITEMS TAMBANG (Mining)
  coal: {
    name: "Batu Bara",
    emoji: "⬛",
    value: 500,
    chance: 1.0,
    type: "mine",
  },
  iron: { name: "Besi", emoji: "🪨", value: 1500, chance: 0.5, type: "mine" },
  gold: { name: "Emas", emoji: "🪙", value: 5000, chance: 0.15, type: "mine" },
  emerald: {
    name: "Emerald",
    emoji: "🟢",
    value: 15000,
    chance: 0.05,
    type: "mine",
  },
  diamond: {
    name: "Diamond",
    emoji: "💎",
    value: 30000,
    chance: 0.01,
    type: "mine",
  },

  // 🟢 ITEMS KAYU (Logging)
  wood: {
    name: "Kayu Dasar",
    emoji: "🪵",
    value: 200,
    chance: 1.0,
    type: "chop",
  },
  oak_log: {
    name: "Balok Oak",
    emoji: "🌳",
    value: 1000,
    chance: 0.3,
    type: "chop",
  },
  dark_oak: {
    name: "Balok Dark Oak",
    emoji: "🌲",
    value: 3000,
    chance: 0.1,
    type: "chop",
  },
  rare_wood: {
    name: "Kayu Langka",
    emoji: "🍂",
    value: 10000,
    chance: 0.02,
    type: "chop",
  },
};

const TOOLS = {
  // TOOLS MINING (Pickaxe)
  wood_pickaxe: {
    name: "Pickaxe Kayu",
    emoji: "⛏️",
    price: 5000,
    durability: 20,
    type: "mine",
  },
  stone_pickaxe: {
    name: "Pickaxe Batu",
    emoji: "⛏️",
    price: 25000,
    durability: 50,
    type: "mine",
  },
  iron_pickaxe: {
    name: "Pickaxe Besi",
    emoji: "⛏️",
    price: 100000,
    durability: 100,
    type: "mine",
  },

  // 🟢 TOOLS LOGGING (Axe)
  wood_axe: {
    name: "Kapak Kayu",
    emoji: "🪓",
    price: 4000,
    durability: 25,
    type: "chop",
  },
  stone_axe: {
    name: "Kapak Batu",
    emoji: "🪓",
    price: 20000,
    durability: 60,
    type: "chop",
  },
  iron_axe: {
    name: "Kapak Besi",
    emoji: "🪓",
    price: 80000,
    durability: 120,
    type: "chop",
  },
};

function loadInventoryDB() {
  // Pastikan folder database ada sebelum mencoba membaca/menulis file
  const dir = path.dirname(INVENTORY_DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (!fs.existsSync(INVENTORY_DB_PATH)) {
    fs.writeFileSync(INVENTORY_DB_PATH, JSON.stringify({}, null, 2));
  }
  return JSON.parse(fs.readFileSync(INVENTORY_DB_PATH, "utf8"));
}

function saveInventoryDB(data) {
  fs.writeFileSync(INVENTORY_DB_PATH, JSON.stringify(data, null, 2));
}

function getInventory(botId, userJid) {
  const db = loadInventoryDB();
  if (!db[userJid]) {
    db[userJid] = {
      items: {},
      tools: {
        mine: { currentId: null }, // Alat untuk mining
        chop: { currentId: null }, // Alat untuk chop
      },
    };
    saveInventoryDB(db);
  }
  // Periksa struktur untuk user lama
  if (!db[userJid].tools)
    db[userJid].tools = {
      mine: { currentId: null },
      chop: { currentId: null },
    };
  if (!db[userJid].tools.mine) db[userJid].tools.mine = { currentId: null };
  if (!db[userJid].tools.chop) db[userJid].tools.chop = { currentId: null };

  return db[userJid];
}

function saveUserInventory(botId, userJid, inventory) {
  const db = loadInventoryDB();
  db[userJid] = inventory;
  saveInventoryDB(db);
}

function getCurrentTool(inventory, toolType) {
  const toolId = inventory.tools[toolType].currentId;
  if (!toolId) return null;
  return inventory.tools[toolId]; // Mengambil objek tool yang menyimpan durability
}

/**
 * Logika Penambangan
 */
function runMining(botId, userJid) {
  const inventory = getInventory(botId, userJid);
  const user = getUserExp(botId, userJid);
  const toolType = "mine";

  const currentToolData = getCurrentTool(inventory, toolType);

  if (!currentToolData) {
    return {
      success: false,
      message: `Kamu belum memiliki Pickaxe/Cangkul untuk menambang. Beli dulu dengan *.buytool*.`,
    };
  }

  const currentToolId = inventory.tools[toolType].currentId;
  const baseToolInfo = TOOLS[currentToolId];

  if (currentToolData.durability <= 0) {
    inventory.tools[toolType].currentId = null;
    delete inventory.tools[currentToolId];
    saveUserInventory(botId, userJid, inventory);
    return {
      success: false,
      message: `⛏️ Pickaxe *${currentToolData.name}* milikmu sudah rusak. Beli yang baru!`,
    };
  }

  let foundItem = null;
  let totalItems = 0;

  const mineableItems = Object.entries(ITEMS).filter(
    ([id, item]) => item.type === toolType
  );

  // Logika chance berdasarkan TOOLS yang dimiliki
  const toolBonus =
    (currentToolData.durability / baseToolInfo.durability) * 0.5 + 1; // Maks 1.5x

  for (const [itemId, item] of mineableItems.reverse()) {
    const finalChance = item.chance * toolBonus;

    if (Math.random() < finalChance) {
      const amount = Math.floor(Math.random() * 2) + 1; // 1-2 item
      inventory.items[itemId] = (inventory.items[itemId] || 0) + amount;
      totalItems += amount;
      foundItem = item;
      break;
    }
  }

  // Kurangi durability
  currentToolData.durability -= 1;

  if (totalItems === 0) {
    foundItem = ITEMS["coal"];
  }

  inventory.tools[currentToolId] = currentToolData;
  saveUserInventory(botId, userJid, inventory);

  const expAmount = 5;
  user.exp += expAmount;
  const newLevel = Math.floor(user.exp / 100) + 1;
  if (newLevel > user.level) user.level = newLevel;
  saveExpData(botId, { ...loadExpData(botId), [userJid]: user });

  return {
    success: true,
    found: foundItem,
    amount: totalItems,
    toolName: currentToolData.name,
    toolDurability: currentToolData.durability,
    toolMaxDurability: baseToolInfo.durability,
    exp: expAmount,
  };
}

/**
 * 🟢 Logika Menebang Pohon (Logging)
 */
function runLogging(botId, userJid) {
  const inventory = getInventory(botId, userJid);
  const user = getUserExp(botId, userJid);
  const toolType = "chop";

  const currentToolData = getCurrentTool(inventory, toolType);

  if (!currentToolData) {
    return {
      success: false,
      message:
        "Kamu belum memiliki Kapak untuk menebang pohon. Beli dulu dengan *.buytool*.",
    };
  }

  const currentToolId = inventory.tools[toolType].currentId;
  const baseToolInfo = TOOLS[currentToolId];

  if (currentToolData.durability <= 0) {
    // Kapak rusak, hilangkan dari current
    inventory.tools[toolType].currentId = null;
    delete inventory.tools[currentToolId];
    saveUserInventory(botId, userJid, inventory);
    return {
      success: false,
      message: `🌳 Kapak *${currentToolData.name}* milikmu sudah rusak. Beli yang baru!`,
    };
  }

  let foundItem = null;
  let totalItems = 0;

  const choppableItems = Object.entries(ITEMS).filter(
    ([id, item]) => item.type === toolType
  );

  const toolBonus =
    (currentToolData.durability / baseToolInfo.durability) * 0.4 + 1; // Maks 1.4x

  for (const [itemId, item] of choppableItems.reverse()) {
    const finalChance = item.chance * toolBonus;

    if (Math.random() < finalChance) {
      const amount = Math.floor(Math.random() * 4) + 2; // 2-5 item
      inventory.items[itemId] = (inventory.items[itemId] || 0) + amount;
      totalItems += amount;
      foundItem = item;
      break;
    }
  }

  // Kurangi durability Kapak
  currentToolData.durability -= 1;

  if (totalItems === 0) {
    foundItem = ITEMS["wood"];
  }

  inventory.tools[currentToolId] = currentToolData;
  saveUserInventory(botId, userJid, inventory);

  const expAmount = 4; // EXP sedikit lebih kecil
  user.exp += expAmount;
  const newLevel = Math.floor(user.exp / 100) + 1;
  if (newLevel > user.level) user.level = newLevel;
  saveExpData(botId, { ...loadExpData(botId), [userJid]: user });

  return {
    success: true,
    found: foundItem,
    amount: totalItems,
    toolName: currentToolData.name,
    toolDurability: currentToolData.durability,
    toolMaxDurability: baseToolInfo.durability,
    exp: expAmount,
  };
}

/**
 * Logika Pembelian Kapak/Tool
 */
function buyTool(botId, userJid, toolId) {
  const toolInfo = TOOLS[toolId];
  if (!toolInfo) {
    return { success: false, message: "ID Kapak/Cangkul tidak valid!" };
  }

  const user = getUserExp(botId, userJid);
  if (user.coins < toolInfo.price) {
    return {
      success: false,
      message: `Koin kamu (${user.coins}) tidak cukup untuk membeli *${toolInfo.name}* seharga ${toolInfo.price} Coin.`,
    };
  }

  const inventory = getInventory(botId, userJid);

  // Kurangi koin
  user.coins -= toolInfo.price;
  saveExpData(botId, { ...loadExpData(botId), [userJid]: user });

  // Tambahkan tool ke inventory dan set sebagai current
  inventory.tools[toolId] = {
    name: toolInfo.name,
    durability: toolInfo.durability,
    emoji: toolInfo.emoji,
  };
  inventory.tools[toolInfo.type].currentId = toolId;
  saveUserInventory(botId, userJid, inventory);

  return { success: true, toolName: toolInfo.name, toolType: toolInfo.type };
}

/**
 * Logika Menjual Item Tambang
 */
function sellItem(botId, userJid, itemId, amount) {
  const itemInfo = ITEMS[itemId];
  if (!itemInfo || amount <= 0) {
    return { success: false, message: "Item atau jumlah tidak valid." };
  }

  const inventory = getInventory(botId, userJid);
  if ((inventory.items[itemId] || 0) < amount) {
    return {
      success: false,
      message: `Kamu hanya punya ${inventory.items[itemId] || 0} ${itemInfo.name}.`,
    };
  }

  const user = getUserExp(botId, userJid);
  const totalEarnings = amount * itemInfo.value;

  // Kurangi item
  inventory.items[itemId] -= amount;
  if (inventory.items[itemId] <= 0) delete inventory.items[itemId];
  saveUserInventory(botId, userJid, inventory);

  // Tambah koin
  user.coins += totalEarnings;
  saveExpData(botId, { ...loadExpData(botId), [userJid]: user });

  return {
    success: true,
    item: itemInfo.name,
    amount,
    earnings: totalEarnings,
  };
}

module.exports = {
  ITEMS,
  TOOLS,
  getInventory,
  runMining,
  runLogging,
  buyTool,
  sellItem,
  // Ekspor fungsi untuk list menu
  getToolList: () => TOOLS,
  getItemList: () => ITEMS,
};
