var posts=["2026/04/04/hello-world/","2026/04/04/博客搭建全记录/","2026/04/05/record-of-hexo-blog-repair/"];function toRandomPost(){
    pjax.loadUrl('/My_Blog/'+posts[Math.floor(Math.random() * posts.length)]);
  };