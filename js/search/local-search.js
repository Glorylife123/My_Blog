window.addEventListener("load", () => {
  const config = GLOBAL_CONFIG.localSearch;
  if (!config) return;

  let isOpen = false;
  let dataPromise = null;
  let inputBound = false;
  let latestQueryId = 0;

  const root = (() => {
    const value = GLOBAL_CONFIG.root || "/";
    return value.endsWith("/") ? value : value + "/";
  })();

  const selectors = {
    mask: "#search-mask",
    dialog: "#local-search .search-dialog",
    input: "#local-search-input input",
    results: "#local-search-results",
    loadingDatabase: "#loading-database",
    loadingStatus: "#loading-status",
    searchButtons: "#search-button > .search, #menu-search",
    closeButton: "#local-search .search-close-button",
  };

  const $ = selector => document.querySelector(selector);
  const $$ = selector => Array.from(document.querySelectorAll(selector));

  const stripLeadingSlash = value => String(value || "").replace(/^\/+/, "");

  const withRoot = path => {
    const value = String(path || "");
    if (/^(https?:)?\/\//i.test(value) || value.startsWith("#") || value.startsWith("mailto:")) return value;
    return root + stripLeadingSlash(value);
  };

  const normalizeUrl = url => {
    const value = String(url || "");
    if (!value) return "";
    if (/^(https?:)?\/\//i.test(value)) return value;
    if (value.startsWith(root)) return value;
    return withRoot(value);
  };

  const escapeHTML = text =>
    String(text || "").replace(/[&<>"']/g, char => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };
      return entities[char];
    });

  const escapeRegExp = text => String(text || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const stripHTML = html => {
    const div = document.createElement("div");
    div.innerHTML = html || "";
    return div.textContent || div.innerText || "";
  };

  const getText = (node, selector) => {
    const target = node.querySelector(selector);
    return target ? target.textContent.trim() : "";
  };

  const getTags = node => $$From(node, "tags tag").map(tag => tag.textContent.trim()).filter(Boolean);

  const $$From = (node, selector) => Array.from(node.querySelectorAll(selector));

  const getFirstImage = html => {
    const div = document.createElement("div");
    div.innerHTML = html || "";
    const image = div.querySelector("img[src], img[data-lazy-src]");
    if (!image) return "";
    return image.getAttribute("data-lazy-src") || image.getAttribute("src") || "";
  };

  const setDatabaseReady = () => {
    const loadingDatabase = $(selectors.loadingDatabase);
    if (!loadingDatabase) return;

    const searchWrap = loadingDatabase.nextElementSibling;
    if (searchWrap) searchWrap.style.display = "block";
    loadingDatabase.remove();
  };

  const setLoadingStatus = isLoading => {
    const loadingStatus = $(selectors.loadingStatus);
    if (!loadingStatus) return;
    loadingStatus.innerHTML = isLoading ? '<i class="anzhiyufont anzhiyu-icon-spinner anzhiyu-pulse-icon"></i>' : "";
  };

  const parseXML = text => {
    const documentXML = new DOMParser().parseFromString(text, "text/xml");
    const parserError = documentXML.querySelector("parsererror");
    if (parserError) throw new Error("Search index XML parse failed");

    return $$From(documentXML, "entry").map(entry => {
      const contentHTML = getText(entry, "content");
      return {
        title: getText(entry, "title"),
        content: stripHTML(contentHTML),
        url: normalizeUrl(getText(entry, "url")),
        tags: getTags(entry),
        oneImage: normalizeUrl(getFirstImage(contentHTML)),
      };
    });
  };

  const parseJSON = data =>
    data.map(item => {
      const contentHTML = item.content || "";
      return {
        title: item.title || "",
        content: stripHTML(contentHTML),
        url: normalizeUrl(item.url || ""),
        tags: Array.isArray(item.tags) ? item.tags : [],
        oneImage: normalizeUrl(getFirstImage(contentHTML)),
      };
    });

  const loadData = async () => {
    const response = await fetch(config.path, { cache: "no-cache" });
    if (!response.ok) throw new Error(`Search index request failed: ${response.status}`);

    const data = /\.json(?:\?|#|$)/i.test(config.path) ? parseJSON(await response.json()) : parseXML(await response.text());
    setDatabaseReady();
    return data;
  };

  const ensureData = () => {
    if (!dataPromise) dataPromise = loadData();
    return dataPromise;
  };

  const makeExcerpt = (content, keywords) => {
    const lowerContent = content.toLowerCase();
    const firstIndex = keywords.reduce((current, keyword) => {
      const index = lowerContent.indexOf(keyword);
      if (index < 0) return current;
      return current < 0 ? index : Math.min(current, index);
    }, -1);

    const start = Math.max(firstIndex - 30, 0);
    const end = Math.min((firstIndex < 0 ? 0 : firstIndex) + 100, content.length);
    const prefix = start > 0 ? "..." : "";
    const suffix = end < content.length ? "..." : "";

    return prefix + content.slice(start, end) + suffix;
  };

  const highlight = (text, keywords) => {
    let html = escapeHTML(text);
    keywords.forEach(keyword => {
      html = html.replace(new RegExp(escapeRegExp(escapeHTML(keyword)), "gi"), match => {
        return `<span class="search-keyword">${match}</span>`;
      });
    });
    return html;
  };

  const itemMatches = (item, keywords) => {
    const title = item.title.toLowerCase();
    const content = item.content.toLowerCase();
    const tags = item.tags.join(" ").toLowerCase();
    return keywords.every(keyword => title.includes(keyword) || content.includes(keyword) || tags.includes(keyword));
  };

  const renderResults = (items, rawQuery) => {
    const resultContent = $(selectors.results);
    if (!resultContent) return;

    const keywords = rawQuery
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    if (!keywords.length) {
      resultContent.innerHTML = "";
      return;
    }

    const matches = items.filter(item => itemMatches(item, keywords));

    if (!matches.length) {
      const emptyText = config.languages.hits_empty.replace(/\$\{query}/, escapeHTML(rawQuery.trim()));
      resultContent.innerHTML = `<div class="search-result-list"><div id="local-search__hits-empty">${emptyText}</div></div>`;
      return;
    }

    const html = matches
      .map(item => {
        const imageHTML = item.oneImage
          ? `<div class="search-left"><img src="${escapeHTML(item.oneImage)}" alt="${escapeHTML(item.title)}" data-fancybox="gallery"></div>`
          : '<div class="search-left" style="width:0"></div>';
        const rightStyle = item.oneImage ? "" : ' style="width: 100%"';
        const excerpt = makeExcerpt(item.content, keywords);
        const tags = item.tags
          .map(tag => {
            const tagUrl = withRoot(`tags/${encodeURIComponent(tag)}/`);
            return `<a class="tag-list" href="${escapeHTML(tagUrl)}" data-pjax-state="" one-link-mark="yes">#${escapeHTML(tag)}</a>`;
          })
          .join("");

        return `<div class="local-search__hit-item">${imageHTML}<div class="search-right"${rightStyle}><a href="${escapeHTML(
          item.url
        )}" class="search-result-title">${highlight(item.title, keywords)}</a><p class="search-result" data-url="${escapeHTML(
          item.url
        )}">${highlight(excerpt, keywords)}</p>${tags ? `<div class="search-result-tags">${tags}</div>` : ""}</div></div>`;
      })
      .join("");

    resultContent.innerHTML = `<div class="search-result-list">${html}</div>`;
    window.pjax && window.pjax.refresh(resultContent);
  };

  const bindInput = () => {
    if (inputBound) return;

    const input = $(selectors.input);
    const resultContent = $(selectors.results);
    if (!input || !resultContent) return;

    inputBound = true;

    input.addEventListener("input", async event => {
      const queryId = ++latestQueryId;
      const query = event.target.value;

      if (!query.trim()) {
        resultContent.innerHTML = "";
        setLoadingStatus(false);
        return;
      }

      setLoadingStatus(true);

      try {
        const data = await ensureData();
        if (queryId !== latestQueryId) return;
        renderResults(data, query);
      } catch (error) {
        console.error(error);
        resultContent.innerHTML = '<div class="search-result-list"><div id="local-search__hits-empty">搜索数据加载失败，请稍后再试。</div></div>';
      } finally {
        if (queryId === latestQueryId) setLoadingStatus(false);
      }
    });

    resultContent.addEventListener("click", event => {
      const result = event.target.closest(".search-result[data-url]");
      if (!result) return;

      const url = result.getAttribute("data-url");
      if (window.pjax) {
        window.pjax.loadUrl(url);
      } else {
        window.location.href = url;
      }
    });
  };

  const openSearch = () => {
    const mask = $(selectors.mask);
    const dialog = $(selectors.dialog);
    const input = $(selectors.input);
    if (!mask || !dialog || !input) return;

    document.getElementById("local-search")?.classList.add("is-open");
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    anzhiyu.animateIn(mask, "to_show 0.5s");
    anzhiyu.animateIn(dialog, "titleScale 0.5s");
    setTimeout(() => input.focus(), 100);
    isOpen = true;
    bindInput();
    ensureData().catch(error => console.error(error));
  };

  const closeSearch = () => {
    const mask = $(selectors.mask);
    const dialog = $(selectors.dialog);
    if (!mask || !dialog) return;

    document.body.style.width = "";
    document.body.style.overflow = "";
    anzhiyu.animateOut(dialog, "search_close .5s");
    anzhiyu.animateOut(mask, "to_hide 0.5s");
    setTimeout(() => {
      if (!isOpen) document.getElementById("local-search")?.classList.remove("is-open");
    }, 500);
    isOpen = false;
  };

  document.addEventListener("click", event => {
    if (event.target.closest(selectors.searchButtons)) openSearch();
    if (event.target.closest(selectors.closeButton) || event.target === $(selectors.mask)) closeSearch();
  });

  document.addEventListener("keydown", event => {
    if (event.code === "Escape" && isOpen) closeSearch();
  });

  window.addEventListener("pjax:complete", () => {
    if (isOpen) closeSearch();
  });

  if (config.preload) ensureData().catch(error => console.error(error));
});
