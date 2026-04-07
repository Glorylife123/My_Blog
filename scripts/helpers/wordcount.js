function stripHtml(content = "") {
  return content
    .replace(/<pre[\s\S]*?<\/pre>/gi, " ")
    .replace(/<code[\s\S]*?<\/code>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function countText(content = "") {
  const text = stripHtml(content);
  const chineseMatches = text.match(/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g) || [];
  const englishMatches = text
    .replace(/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g, " ")
    .match(/[A-Za-z0-9_]+(?:['-][A-Za-z0-9_]+)*/g) || [];

  return {
    chinese: chineseMatches.length,
    english: englishMatches.length,
    total: chineseMatches.length + englishMatches.length,
  };
}

hexo.extend.helper.register("wordcount", function (content) {
  return countText(content).total;
});

hexo.extend.helper.register("min2read", function (content, options = {}) {
  const counts = countText(content);
  const cnSpeed = options.cn || 350;
  const enSpeed = options.en || 160;
  const minutes = counts.chinese / cnSpeed + counts.english / enSpeed;

  if (counts.total === 0) return 0;
  return Math.max(1, Math.ceil(minutes));
});

hexo.extend.helper.register("totalcount", function (site) {
  const posts =
    site && site.posts && typeof site.posts.toArray === "function" ? site.posts.toArray() : [];

  return posts.reduce((sum, post) => {
    return sum + countText(post.content || "").total;
  }, 0);
});
