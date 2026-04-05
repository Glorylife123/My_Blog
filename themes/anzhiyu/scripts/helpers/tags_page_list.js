hexo.extend.helper.register('tags_page_list', function (type) {
  const tags = hexo.locals.get(type);
  const root = this.config.root || '/';

  // Manually sort tags based on the length of tag names
  const sortedTags = tags.reduce((acc, tag) => {
    const index = acc.findIndex((t) => t.length < tag.length);
    if (index === -1) {
      acc.push(tag);
    } else {
      acc.splice(index, 0, tag);
    }
    return acc;
  }, []);

  let html = ``;
  sortedTags.forEach(function (item) {
    const href = root + item.path;
    html += `
      <a href="${href}" id="${href}">
        <span class="tags-punctuation">#</span>${item.name}
        <span class="tagsPageCount">${item.length}</span>
      </a>
    `;
  });

  return html;
});