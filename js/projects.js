/* ===========================================================
   Renders published projects for one category into a gallery
   container. Falls back to a friendly message if Supabase isn't
   configured yet, or if this category has no published items.
   =========================================================== */

async function renderCategoryProjects (categorySlug, containerId) {
  var container = document.getElementById(containerId);
  if (!container) return;

  if (!window.supabaseClient) {
    container.innerHTML = '<div class="empty-state">後台資料庫還沒設定好，暫時看不到作品。設定完成後（見 supabase/README.md）這裡會自動顯示。</div>';
    return;
  }

  var result = await window.supabaseClient
    .from('projects')
    .select('*')
    .eq('category', categorySlug)
    .eq('published', true)
    .order('sort_order', { ascending: true });

  if (result.error) {
    container.innerHTML = '<div class="empty-state">載入失敗，請稍後再試。</div>';
    console.error(result.error);
    return;
  }

  var data = result.data;
  if (!data || data.length === 0) {
    container.innerHTML = '<div class="empty-state">這個分類還沒有上傳作品——之後在後台新增並發布後，會自動顯示在這裡。</div>';
    return;
  }

  container.innerHTML = data.map(function (p) {
    var mediaTag = p.media_type === 'video'
      ? '<video src="' + p.media_url + '" muted loop autoplay playsinline></video>'
      : '<img src="' + p.media_url + '" alt="' + (p.title ? p.title.replace(/"/g, '&quot;') : '') + '">';
    var caption = p.title ? '<div class="caption">' + p.title + '</div>' : '';
    return '<div class="project-tile"><div class="thumb">' + mediaTag + '</div>' + caption + '</div>';
  }).join('');
}
