// • Scrape : genius ( lirik )
// • Credits : https://whatsapp.com/channel/0029Vb4fjWE1yT25R7epR110
// #note tambahin artits sebelum judul

const axios = require("axios");
const cheerio = require("cheerio");
const urlModule = require("url"); // Tambahkan modul url

const BASE_URL = "https://genius.com";
const HEADERS = {
  "user-agent":
    "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36",
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
  "accept-encoding": "gzip, deflate, br",
  "sec-ch-ua": '"Chromium";v="139", "Not;A=Brand";v="99"',
  "sec-ch-ua-mobile": "?1",
  "sec-ch-ua-platform": '"Android"',
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "sec-fetch-site": "same-origin",
  "upgrade-insecure-requests": "1",
};

function _formatQueryForUrl(query) {
  return query
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function _generatePossibleUrls(query) {
  const urls = [];

  const lowercase = _formatQueryForUrl(query);
  urls.push(`${BASE_URL}/${lowercase}-lyrics`);

  const titleCase = query
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("-");
  urls.push(`${BASE_URL}/${titleCase}-lyrics`);

  if (
    query.toLowerCase().includes("feat") ||
    query.toLowerCase().includes("ft")
  ) {
    const cleaned = query.replace(/\s*[(\[]?feat\.?|ft\.?[)\]]?\s*/gi, "-");
    const formatted = _formatQueryForUrl(cleaned);
    urls.push(`${BASE_URL}/${formatted}-lyrics`);
  }

  return urls;
}

async function _getPageHTML(url) {
  try {
    const response = await axios.get(url, {
      headers: HEADERS,
      timeout: 15000,
      validateStatus: (status) => status < 500,
    });

    if (response.status !== 200) {
      console.error(`Error: Status ${response.status} untuk URL ${url}`);
      return null;
    }

    return cheerio.load(response.data);
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      console.error("Error: Request timeout");
    } else if (error.response) {
      console.error(
        `Error: ${error.response.status} - ${error.response.statusText}`
      );
    } else {
      console.error(`Error: ${error.message}`);
    }
    return null;
  }
}

async function _scrapeLyricsPage($) {
  console.log("Scraping lyrics page from Genius...");

  let title = $('h1[class*="SongHeader"]').first().text().trim();
  if (!title) title = $('h1[class*="Title"]').first().text().trim();
  if (!title) title = $("h1").first().text().trim();
  if (!title) title = $('meta[property="og:title"]').attr("content") || "";

  console.log("Title found:", title);

  let artist = $('a[class*="HeaderArtist"]').first().text().trim();
  if (!artist) artist = $("h2 a").first().text().trim();
  if (!artist) artist = $('a[href*="/artists/"]').first().text().trim();
  if (!artist) {
    const ogTitle = $('meta[property="og:title"]').attr("content") || "";
    const match = ogTitle.match(/(.+?)\s+–\s+/);
    if (match) artist = match[1];
  }

  console.log("Artist found:", artist);

  let lyrics = "";

  console.log("Trying data-lyrics-container...");
  $('div[data-lyrics-container="true"]').each((_, container) => {
    const html = $(container).html();
    if (html) {
      const text = html
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<a[^>]*>(.*?)<\/a>/gi, "$1")
        .replace(/<span[^>]*>(.*?)<\/span>/gi, "$1")
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .trim();

      lyrics += text + "\n\n";
    }
  });

  if (!lyrics || lyrics.length < 10) {
    console.log("Trying alternative selectors...");

    $('div[class*="Lyrics__Container"]').each((_, container) => {
      const html = $(container).html();
      if (html) {
        const text = html
          .replace(/<br\s*\/?>/gi, "\n")
          .replace(/<a[^>]*>(.*?)<\/a>/gi, "$1")
          .replace(/<span[^>]*>(.*?)<\/span>/gi, "$1")
          .replace(/<[^>]*>/g, "")
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#x27;/g, "'")
          .trim();

        lyrics += text + "\n\n";
      }
    });
  }

  if (!lyrics || lyrics.length < 10) {
    console.log("Trying .lyrics class...");
    const lyricsHtml = $(".lyrics").html();
    if (lyricsHtml) {
      lyrics = lyricsHtml
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<a[^>]*>(.*?)<\/a>/gi, "$1")
        .replace(/<span[^>]*>(.*?)<\/span>/gi, "$1")
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .trim();
    }
  }

  lyrics = lyrics.trim();

  console.log("Lyrics length:", lyrics.length);

  if (!lyrics || lyrics.length < 10) {
    lyrics =
      "Lirik tidak ditemukan. Mungkin halaman menggunakan JavaScript untuk load lyrics.";
  }

  let album = "";
  let releaseDate = "";

  $('div[class*="Metadata"]').each((_, el) => {
    const text = $(el).text();
    if (text.includes("Album")) {
      album = $(el).find("a").first().text().trim();
    }
    if (text.includes("Release Date")) {
      releaseDate = $(el).text().replace("Release Date", "").trim();
    }
  });

  console.log(
    `Final - Title: ${title}, Artist: ${artist}, Lyrics length: ${lyrics.length}`
  );

  return {
    title,
    artist,
    lyrics,
    album: album || "",
    releaseDate: releaseDate || "",
  };
}

async function _scrapeSearchPage($, query) {
  console.log("Scraping search results for:", query);
  const results = [];

  $("a").each((_, element) => {
    const $el = $(element);
    const href = $el.attr("href");

    if (!href || !href.includes("-lyrics")) return;
    if (href.includes("/albums/") || href.includes("/artists/")) return;
    const url = href.startsWith("http") ? href : BASE_URL + href;

    if (results.find((r) => r.url === url)) return;

    let title = "";
    let artist = "";

    const titleEl = $el
      .find('[class*="title" i], [class*="Title"], h3, strong')
      .first();
    const artistEl = $el
      .find('[class*="artist" i], [class*="Artist"], h4, small')
      .first();

    if (titleEl.length) title = titleEl.text().trim();
    if (artistEl.length) artist = artistEl.text().trim();

    if (!title) {
      const urlParts = href.split("/").pop().replace("-lyrics", "").split("-");
      if (urlParts.length > 1) {
        title = urlParts.slice(1).join(" ");
        artist = urlParts[0];
      }
    }

    title = title
      .replace(/\s+Lyrics$/i, "")
      .replace(/"/g, "")
      .trim();
    artist = artist.replace(/"/g, "").trim();

    if (title && url && title.length > 2) {
      console.log(`Found: ${artist || "Unknown"} - ${title}`);
      results.push({
        title: title.charAt(0).toUpperCase() + title.slice(1),
        artist: artist.charAt(0).toUpperCase() + artist.slice(1),
        url,
      });
    }
  });

  console.log(`Total found: ${results.length} search results`);

  if (results.length === 0) {
    console.log("No results from page scraping, trying alternative method...");

    const searchTerms = query
      .toLowerCase()
      .split(" ")
      .filter((t) => t.length > 0);
    const possibleUrl = `${BASE_URL}/${searchTerms.join("-")}-lyrics`;

    console.log("Trying constructed URL:", possibleUrl);

    results.push({
      title: query,
      artist: "",
      url: possibleUrl,
    });
  }

  results.slice(0, 5).forEach((r, i) => {
    console.log(
      `Result ${i + 1}: ${r.artist || "Unknown"} - ${r.title} | ${r.url}`
    );
  });

  return results;
}

async function _scrapeHomePage($) {
  console.log("Scraping Genius homepage...");

  const result = {
    trending: [],
    charts: [],
    featured: [],
  };

  $('a[href*="-lyrics"]').each((i, element) => {
    if (i >= 30) return false;

    const $el = $(element);
    const href = $el.attr("href");

    if (!href) return;

    const url = href.startsWith("http") ? href : BASE_URL + href;

    const title = $el
      .find('[class*="Title"], h3, strong')
      .first()
      .text()
      .trim();
    const artist = $el
      .find('[class*="Artist"], h4, small')
      .first()
      .text()
      .trim();

    if (!title && $el.text().trim()) {
      const fullText = $el.text().trim();
      const parts = fullText.split(" – ");

      const extractedArtist = parts.length > 1 ? parts[0].trim() : "";
      const extractedTitle = parts.length > 1 ? parts[1].trim() : fullText;

      if (extractedTitle && extractedTitle.length > 3) {
        result.featured.push({
          title: extractedTitle,
          artist: extractedArtist,
          url,
        });
      }
    } else if (title) {
      result.featured.push({ title, artist, url });
    }
  });

  console.log(`Homepage scraped: ${result.featured.length} items`);

  return result;
}

async function genius(query) {
  try {
    let url = query;
    let $ = null;

    if (query.startsWith("http://") || query.startsWith("https://")) {
      console.log("Input adalah URL langsung:", url);
      $ = await _getPageHTML(url);

      if ($) {
        const pathname = new urlModule.URL(url).pathname; // Menggunakan urlModule
        if (pathname.includes("-lyrics")) {
          return await _scrapeLyricsPage($);
        }
      }

      return { error: "Gagal mengakses URL yang diberikan." };
    }

    if (query.toLowerCase() === "home" || query.toLowerCase() === "homepage") {
      url = BASE_URL;
      console.log("Request homepage");
      $ = await _getPageHTML(url);
      if ($) return await _scrapeHomePage($);
      return { error: "Gagal mengakses homepage." };
    }

    console.log("=== Mencari lirik untuk:", query, "===");

    console.log("Method 1: Trying direct URL construction...");
    const possibleUrls = _generatePossibleUrls(query);

    for (const tryUrl of possibleUrls) {
      console.log("Trying URL:", tryUrl);
      $ = await _getPageHTML(tryUrl);

      if ($) {
        const hasLyrics =
          $('div[data-lyrics-container="true"]').length > 0 ||
          $('div[class*="Lyrics__Container"]').length > 0;

        if (hasLyrics) {
          console.log("✓ Found valid lyrics page!");
          return await _scrapeLyricsPage($);
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log("Method 2: Trying search page...");
    const searchQuery = encodeURIComponent(query);
    const searchUrl = `${BASE_URL}/search?q=${searchQuery}`;

    console.log("Search URL:", searchUrl);
    const $search = await _getPageHTML(searchUrl);

    if ($search) {
      const searchResults = await _scrapeSearchPage($search, query);

      if (searchResults.length > 0) {
        console.log(
          `Found ${searchResults.length} results, trying first one...`
        );
        url = searchResults[0].url;
        console.log("URL from search:", url);

        $ = await _getPageHTML(url);
        if ($) {
          const result = await _scrapeLyricsPage($);
          if (result.lyrics && result.lyrics.length > 50) {
            // 🟢 Tambahkan Artist sebelum Title
            result.title = `${result.artist || "Unknown Artist"} - ${result.title}`;
            return result;
          }
          return { error: "Gagal menemukan lirik di halaman yang dituju." };
        }
      }
    }

    console.log("Method 3: Trying with additional keywords...");
    const withKeywords = [`${query} lyrics`, `${query} genius`];

    for (const kw of withKeywords) {
      const kwUrl = `${BASE_URL}/search?q=${encodeURIComponent(kw)}`;
      console.log("Trying keyword search:", kwUrl);

      const $kw = await _getPageHTML(kwUrl);
      if ($kw) {
        const results = await _scrapeSearchPage($kw, kw);
        if (results.length > 0) {
          $ = await _getPageHTML(results[0].url);
          if ($) {
            const result = await _scrapeLyricsPage($);
            if (result.lyrics && result.lyrics.length > 50) {
              // 🟢 Tambahkan Artist sebelum Title
              result.title = `${result.artist || "Unknown Artist"} - ${result.title}`;
              return result;
            }
          }
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    return {
      error: `Tidak dapat menemukan lirik untuk "${query}". Coba dengan format: "artist song title" atau gunakan URL langsung.`,
    };
  } catch (error) {
    console.error("Error di genius():", error.message);
    console.error("Stack:", error.stack);
    return { error: `Terjadi kesalahan: ${error.message}` };
  }
}

// Export module
module.exports = { genius };
