export function extractNextJsData(html) {
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s);
  if (!match) return null;
  
  try {
    return JSON.parse(match[1]);
  } catch (err) {
    console.error('❌ JSON-Parse-Fehler:', err.message);
    return null;
  }
}

export function parseSkoolPosts(nextData) {
  if (!nextData?.props?.pageProps?.postTrees) return [];
  
  return nextData.props.pageProps.postTrees.map(tree => {
    const post = tree.post;
    const metadata = post.metadata || {};
    const contributor = metadata.contributors ? JSON.parse(metadata.contributors)[0] : {};
    
    return {
      id: post.id,
      title: post.name,
      content: metadata.content || '',
      author: contributor.name || 'Unknown',
      avatar: contributor.metadata?.picture_bubble || '',
      comments: metadata.comments || 0,
      created_at: contributor.created_at || '',
      updated_at: metadata.contentEdit || metadata.attachmentsEdit || ''
    };
  });
}

export function parseSkoolLinks(posts) {
  const links = [];
  posts.forEach(post => {
    const urlMatches = post.content.match(/https?:\/\/[^\s\)]+/g) || [];
    urlMatches.forEach(url => {
      links.push({
        post_id: post.id,
        post_title: post.title,
        url: url,
        type: detectLinkType(url)
      });
    });
  });
  return links;
}

export function parseSkoolVideos(links) {
  return links.filter(link => 
    link.type === 'youtube' || 
    link.type === 'loom' || 
    link.type === 'vimeo'
  );
}

export function parseSkoolFiles(links) {
  return links.filter(link => 
    link.type === 'pdf' || 
    link.type === 'json' || 
    link.type === 'xlsx' ||
    link.type === 'docx'
  );
}

function detectLinkType(url) {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('loom.com')) return 'loom';
  if (url.includes('vimeo.com')) return 'vimeo';
  if (url.endsWith('.pdf')) return 'pdf';
  if (url.endsWith('.json')) return 'json';
  if (url.endsWith('.xlsx') || url.endsWith('.xls')) return 'xlsx';
  if (url.endsWith('.docx') || url.endsWith('.doc')) return 'docx';
  if (url.includes('assets.skool.com')) return 'image';
  return 'external';
}

export function parseSkoolImages(nextData) {
  const images = [];
  const html = JSON.stringify(nextData);
  
  const imgUrls = html.match(/https:\/\/assets\.skool\.com\/[^\\"]+/g) || [];
  imgUrls.forEach(url => {
    if (!url.includes('favicon') && !url.includes('.ico')) {
      images.push({ url: url, type: 'asset' });
    }
  });
  
  return [...new Set(images.map(i => i.url))].map(url => ({ url }));
}
