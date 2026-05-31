const axios = require("axios");

const quote = async (text, name, avatar, q) => {
  const json = {
    type: "quote",
    format: "png",
    backgroundColor: "#000000",
    width: 512,
    height: 768,
    scale: 2,
    messages: [
      {
        entities: [],
        avatar: true,
        from: {
          id: 1,
          name: name,
          photo: {
            url: avatar,
          },
        },
        text: text,
        replyMessage: q
          ? {
              ...q,
              chatId: 1,
            }
          : {},
      },
    ],
  };

  const res = await axios.post("https://qc.botcahx.eu.org/generate", json, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const buffer = Buffer.from(res.data.result.image, "base64");
  return {
    status: "200",
    creator: "Drizzy",
    result: buffer,
  };
};

module.exports = {
  quote,
};
