var posts=["2026/03/05/MacBook Air M5/","2026/04/05/record-of-hexo-blog-repair/","2024/12/25/初试/","2025/04/02/东南网安复试C++笔试题回忆与模拟题/","2025/04/01/半个月速成复试C++/","2026/04/04/博客搭建全记录/","2025/04/10/复试/"];function toRandomPost(){
    pjax.loadUrl('/My_Blog/'+posts[Math.floor(Math.random() * posts.length)]);
  };