/* ===========================================================
   Fetches published projects for one category and renders each
   as its own full-viewport section — same rhythm as the homepage
   slides, not a card grid. Falls back to a friendly empty state
   if Supabase isn't configured yet, or this category is empty.
   =========================================================== */

async function renderCategoryProjects (categorySlug, mountId) {
  var mount = document.getElementById(mountId);
  if (!mount) return;

  function showEmpty (message) {
    mount.innerHTML = '<div class="empty-state">' + message + '</div>';
  }

  if (!window.supabaseClient) {
    showEmpty('後台資料庫還沒設定好，暫時看不到作品。設定完成後（見 supabase/README.md）這裡會自動顯示。');
    return;
  }

  var result = await window.supabaseClient
    .from('projects')
    .select('*')
    .eq('category', categorySlug)
    .eq('published', true)
    .order('sort_order', { ascending: true });

  if (result.error) {
    showEmpty('載入失敗，請稍後再試。');
    console.error(result.error);
    return;
  }

  var data = result.data;
  if (!data || data.length === 0) {
    showEmpty('這個分類還沒有上傳作品——之後在後台新增並發布後，會自動顯示在這裡。');
    return;
  }

  mount.innerHTML = '';
  data.forEach(function (p) {
    var section = document.createElement('section');
    section.className = 'project-full spark-field';
    section.setAttribute('data-spark-count', '3');

    var mediaTag = p.media_type === 'video'
      ? '<video src="' + p.media_url + '" muted loop autoplay playsinline></video>'
      : '<img src="' + p.media_url + '" alt="' + (p.title ? p.title.replace(/"/g, '&quot;') : '') + '">';
    var caption = p.title ? '<div class="caption">' + p.title + '</div>' : '';

    section.innerHTML = '<div class="media-frame">' + mediaTag + '</div>' + caption;
    mount.appendChild(section);

    if (window.scatterSparks) window.scatterSparks(section, 3);
  });
}
