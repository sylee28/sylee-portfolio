document.addEventListener('DOMContentLoaded', function () {
  var loginForm = document.getElementById('loginForm');
  var loginSection = document.getElementById('loginSection');
  var panelSection = document.getElementById('panelSection');
  var loginMsg = document.getElementById('loginMsg');
  var logoutBtn = document.getElementById('logoutBtn');
  var uploadForm = document.getElementById('uploadForm');
  var uploadMsg = document.getElementById('uploadMsg');
  var entryList = document.getElementById('entryList');

  if (!window.supabaseClient) {
    loginMsg.textContent = 'Supabase 尚未設定，請先完成 supabase/README.md 裡的設定步驟，並把資訊填進 js/supabase-client.js。';
    loginMsg.className = 'form-msg error';
    return;
  }

  function showPanel (session) {
    if (session) {
      loginSection.style.display = 'none';
      panelSection.style.display = 'block';
      loadEntries();
    } else {
      loginSection.style.display = 'block';
      panelSection.style.display = 'none';
    }
  }

  window.supabaseClient.auth.getSession().then(function (r) { showPanel(r.data.session); });
  window.supabaseClient.auth.onAuthStateChange(function (_event, session) { showPanel(session); });

  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    loginMsg.textContent = '登入中…';
    loginMsg.className = 'form-msg';
    var result = await window.supabaseClient.auth.signInWithPassword({ email: email, password: password });
    if (result.error) {
      loginMsg.textContent = result.error.message;
      loginMsg.className = 'form-msg error';
    } else {
      loginMsg.textContent = '';
    }
  });

  logoutBtn.addEventListener('click', async function () {
    await window.supabaseClient.auth.signOut();
  });

  uploadForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    var category = document.getElementById('category').value;
    var title = document.getElementById('title').value;
    var file = document.getElementById('file').files[0];
    var published = document.getElementById('published').checked;
    var submitBtn = uploadForm.querySelector('button[type="submit"]');

    if (!file) {
      uploadMsg.textContent = '請選擇一個圖片或影片檔案';
      uploadMsg.className = 'form-msg error';
      return;
    }

    submitBtn.disabled = true;
    uploadMsg.textContent = '上傳中…';
    uploadMsg.className = 'form-msg';

    var mediaType = file.type.indexOf('video') === 0 ? 'video' : 'image';
    var safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    var path = category + '/' + Date.now() + '-' + safeName;

    var upload = await window.supabaseClient.storage.from('media').upload(path, file);
    if (upload.error) {
      uploadMsg.textContent = '上傳失敗：' + upload.error.message;
      uploadMsg.className = 'form-msg error';
      submitBtn.disabled = false;
      return;
    }

    var publicUrl = window.supabaseClient.storage.from('media').getPublicUrl(path).data.publicUrl;

    var insert = await window.supabaseClient.from('projects').insert({
      category: category,
      title: title || null,
      media_url: publicUrl,
      media_type: mediaType,
      published: published
    });

    submitBtn.disabled = false;

    if (insert.error) {
      uploadMsg.textContent = '儲存失敗：' + insert.error.message;
      uploadMsg.className = 'form-msg error';
      return;
    }

    uploadMsg.textContent = '新增成功';
    uploadMsg.className = 'form-msg success';
    uploadForm.reset();
    loadEntries();
  });

  async function loadEntries () {
    entryList.innerHTML = '載入中…';
    var result = await window.supabaseClient
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (result.error) {
      entryList.innerHTML = '載入失敗：' + result.error.message;
      return;
    }
    var data = result.data;
    if (!data || data.length === 0) {
      entryList.innerHTML = '<p style="color:var(--ink-soft); font-size:13px;">還沒有任何項目</p>';
      return;
    }

    entryList.innerHTML = '';
    data.forEach(function (p) {
      var row = document.createElement('div');
      row.className = 'entry-row';
      var mediaTag = p.media_type === 'video'
        ? '<video src="' + p.media_url + '" muted></video>'
        : '<img src="' + p.media_url + '">';
      row.innerHTML =
        '<div class="thumb">' + mediaTag + '</div>' +
        '<div class="meta"><div class="cat">' + p.category + '</div><div class="title">' +
        (p.title || '(未命名)') + (p.published ? '' : ' · 未發布') + '</div></div>' +
        '<div class="actions">' +
        '<button data-action="toggle" data-id="' + p.id + '" data-published="' + p.published + '">' + (p.published ? '下架' : '發布') + '</button>' +
        '<button data-action="delete" data-id="' + p.id + '">刪除</button>' +
        '</div>';
      entryList.appendChild(row);
    });
  }

  entryList.addEventListener('click', async function (e) {
    var btn = e.target.closest('button');
    if (!btn) return;
    var id = btn.getAttribute('data-id');
    var action = btn.getAttribute('data-action');

    if (action === 'toggle') {
      var current = btn.getAttribute('data-published') === 'true';
      await window.supabaseClient.from('projects').update({ published: !current }).eq('id', id);
      loadEntries();
    } else if (action === 'delete') {
      if (!confirm('確定要刪除這個項目嗎？此動作無法復原。')) return;
      await window.supabaseClient.from('projects').delete().eq('id', id);
      loadEntries();
    }
  });
});
