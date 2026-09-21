# 後台設定步驟（Supabase）

這份網站的後台（`admin.html`）需要一個 Supabase 專案才能運作。整個流程大概 10 分鐘，全部在 supabase.com 網站上點一點就好，不需要寫程式。

## 1. 建立 Supabase 專案
1. 到 https://supabase.com 註冊 / 登入
2. 點 "New project"，取個名字（例如 `lee-shiying-portfolio`），設定資料庫密碼（記下來，之後用不太到但要保留）
3. 等專案建立完成（約 1-2 分鐘）

## 2. 建立資料表
1. 左側選單點 **SQL Editor** → **New query**
2. 打開這個資料夾裡的 `schema.sql`，全部複製貼上
3. 點 **Run**
4. 沒有紅字錯誤訊息就是成功了

## 3. 建立儲存空間（放圖片/影片的地方）
1. 左側選單點 **Storage** → **New bucket**
2. 名稱輸入 `media`（一定要是這個名字，程式碼裡有寫死）
3. "Public bucket" 開關**不用打開**，因為存取權限已經寫在 `schema.sql` 的 storage policies 裡了

## 4. 建立妳自己的登入帳號
1. 左側選單點 **Authentication** → **Users** → **Add user**
2. 輸入妳自己的 email 和一組密碼（這是妳登入後台用的帳號，不是給訪客的）
3. 這個網站沒有公開的註冊表單，所以自始至終只有妳能登入後台

## 5. 把金鑰填進網站程式碼
1. 左側選單點 **Project Settings**（齒輪圖示）→ **API**
2. 複製 **Project URL** 和 **anon public** 這組 key
3. 打開 `js/supabase-client.js`，把這兩行改成你複製的內容：
   ```js
   const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
   ```

## 6. 測試
1. 用瀏覽器打開 `admin.html`，用步驟 4 建立的帳號登入
2. 上傳一張測試圖片，選一個分類，打開「發布」
3. 打開對應的分類頁面（例如 `social-media.html`），應該就能看到剛剛上傳的圖片

## 之後要注意的地方
- **免費版夠用嗎**：資料庫 500MB、檔案儲存 1GB、頻寬每月約 5GB，對個人作品集綽綽有餘；主要瓶頸是 1GB 儲存空間，影片檔案偏大，建議影片先壓縮過或改放 YouTube/Vimeo（不公開）再把連結存進來，圖片可以直接上傳沒問題
- **7 天沒有活動會自動暫停專案**：登入後台看一下就會自動喚醒，資料不會不見
- **anon key 可以放心寫在前端程式碼裡**：它本身不是密碼，真正擋住別人亂寫入資料的是 `schema.sql` 裡的 Row Level Security（只有登入的帳號，也就是妳，才能新增/刪除/修改）
