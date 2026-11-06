# STJ System - Laravel RESTful API Backend

ប្រព័ន្ធ Backend API សម្រាប់ **STJ Management System (Senior Teaching Junior - ITC)** បង្កើតឡើងដោយ **Laravel 13** ដំណើរការលើ **PHP 8.4** និង **MySQL Database**។

---

## ស្ថាបត្យកម្មប្រព័ន្ធ (Architecture)

- **Frontend:** Next.js 15 (Root Directory)
- **Backend API:** Laravel 13 (`backend/`)
- **Database:** Hostinger MySQL Database (ស្ថិតស្ថេរ 100% មិនបាត់ទិន្នន័យពេល Git Deploy)
- **Authentication:** Laravel Sanctum Token Based

---

## របៀប Deploy លើ Hostinger

### ជំហានទី ១: បង្កើត Subdomain សម្រាប់ API លើ Hostinger
1. ចូលទៅកាន់ **Hostinger hPanel** > **Domains** > **Subdomains**
2. បង្កើត Subdomain ថ្មី៖ `api.peakbrosmao.me`
3. កំណត់ **Custom Folder** ចង្អុលទៅកាន់៖ `public_html/backend/public`

### ជំហានទី ២: បង្កើត MySQL Database លើ Hostinger
1. ចូលទៅកាន់ **hPanel** > **Databases** > **MySQL Databases**
2. បង្កើត Database ថ្មី៖
   - Database Name: `uXXXXXXXXX_stj`
   - Database Username: `uXXXXXXXXX_stj`
   - Password: `...`

### ជំហានទី ៣: កំណត់ Configuration ក្នុង `backend/.env`
```env
APP_NAME="STJ API"
APP_ENV=production
APP_KEY=base64:...
APP_DEBUG=false
APP_URL=https://api.peakbrosmao.me

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=uXXXXXXXXX_stj
DB_USERNAME=uXXXXXXXXX_stj
DB_PASSWORD=your_password_here
```

### ជំហានទី ៤: រត់ Database Migration
```bash
php artisan migrate --force
```
