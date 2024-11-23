const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Kullanıcı kaydetme API'si
app.post('/register', (req, res) => {
  const { email, username, password } = req.body;

  // Kullanıcı bilgilerini kontrol et
  if (!email || !username || !password) {
    return res.status(400).json({ success: false, message: 'Tüm alanları doldurun' });
  }

  // JSON dosyasını oku
  fs.readFile('users.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Dosya okuma hatası' });
    }

    const users = JSON.parse(data);
    
    // Aynı e-posta veya kullanıcı adı var mı kontrol et
    if (users.find(user => user.email === email || user.username === username)) {
      return res.status(400).json({ success: false, message: 'Kullanıcı adı veya e-posta zaten kayıtlı' });
    }

    // Yeni kullanıcıyı ekle
    users.push({ email, username, password });
    
    // Dosyaya kaydet
    fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Dosya yazma hatası' });
      }
      res.json({ success: true, message: 'Kayıt başarılı' });
    });
  });
});

// Kullanıcı giriş API'si
app.post('/login', (req, res) => {
  const { usernameOrEmail, password } = req.body;

  // JSON dosyasını oku
  fs.readFile('users.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Dosya okuma hatası' });
    }

    const users = JSON.parse(data);
    
    // Kullanıcıyı bul
    const user = users.find(user => (user.username === usernameOrEmail || user.email === usernameOrEmail) && user.password === password);

    if (user) {
      return res.json({ success: true, message: 'Giriş başarılı' });
    } else {
      return res.status(400).json({ success: false, message: 'Geçersiz kullanıcı adı/e-posta veya şifre' });
    }
  });
});

// Sunucuyu başlat
app.listen(port, () => {
  console.log(`Server çalışıyor: http://localhost:${port}`);
});
