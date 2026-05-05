# Security Policy

## 🔒 Supported Versions

Kami mendukung versi berikut dengan security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## 🚨 Reporting a Vulnerability

Jika Anda menemukan security vulnerability di proyek ini, mohon **JANGAN** membuat public issue. Sebagai gantinya:

### 1. Laporkan Secara Private

Kirim email ke: **security@mitralabs.id**

Include informasi berikut:
- Deskripsi vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (jika ada)

### 2. Response Timeline

- **24 jam**: Kami akan acknowledge laporan Anda
- **72 jam**: Kami akan memberikan initial assessment
- **7 hari**: Kami akan merilis patch (untuk critical issues)
- **30 hari**: Kami akan merilis patch (untuk non-critical issues)

### 3. Disclosure Policy

- Kami akan bekerja sama dengan Anda untuk memahami dan resolve issue
- Kami akan credit Anda di CHANGELOG (jika Anda ingin)
- Mohon tunggu hingga patch dirilis sebelum public disclosure
- Kami akan mengumumkan security fix di release notes

## 🛡️ Security Best Practices

### For Users

1. **Environment Variables**
   - Jangan commit `.env.local` ke Git
   - Gunakan strong passwords untuk database
   - Rotate API keys secara berkala

2. **Authentication**
   - Gunakan strong passwords (min 12 karakter)
   - Enable 2FA di Supabase dashboard
   - Logout setelah selesai menggunakan admin panel

3. **Updates**
   - Selalu gunakan versi terbaru
   - Monitor security advisories
   - Update dependencies secara berkala

### For Developers

1. **Code Security**
   ```bash
   # Run security audit
   npm audit

   # Fix vulnerabilities
   npm audit fix
   ```

2. **Environment Variables**
   - Never hardcode secrets
   - Use `.env.example` as template
   - Validate env vars at runtime

3. **Input Validation**
   - Always validate user input
   - Use Zod schemas
   - Sanitize HTML with DOMPurify

4. **Database Security**
   - Use Row Level Security (RLS)
   - Parameterized queries only
   - Limit database permissions

5. **API Security**
   - Rate limiting
   - CORS configuration
   - Authentication middleware

## 🔐 Security Features

### Implemented

- ✅ **Supabase Auth** - Industry-standard authentication
- ✅ **Row Level Security** - Database-level access control
- ✅ **Environment Variables** - Secrets management
- ✅ **Input Validation** - Zod schema validation
- ✅ **XSS Protection** - DOMPurify sanitization
- ✅ **CAPTCHA** - hCaptcha spam protection
- ✅ **Activity Logging** - Audit trail
- ✅ **Session Management** - Secure session handling
- ✅ **HTTPS Only** - Secure connections
- ✅ **Image Compression** - Prevent large file attacks

### Planned

- 🔄 **Rate Limiting** - API request throttling
- 🔄 **CSRF Protection** - Cross-site request forgery prevention
- 🔄 **Content Security Policy** - XSS mitigation
- 🔄 **Security Headers** - Additional HTTP security headers
- 🔄 **Dependency Scanning** - Automated vulnerability detection

## 🚫 Known Limitations

1. **Client-Side Validation**
   - Client-side validation dapat di-bypass
   - Always validate on server-side

2. **Public Storage**
   - Supabase storage bucket bersifat public
   - Jangan upload sensitive files

3. **Rate Limiting**
   - Belum ada rate limiting di API routes
   - Planned untuk v1.1

## 📚 Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

## 🏆 Security Hall of Fame

Terima kasih kepada security researchers yang telah membantu:

<!-- Will be updated when we receive security reports -->
- *Be the first to report!*

## 📞 Contact

- **Security Issues**: security@mitralabs.id
- **General Support**: hello@mitralabs.id
- **Website**: https://mitralabs.id

---

**Remember**: Security adalah tanggung jawab bersama. Jika Anda melihat sesuatu yang mencurigakan, laporkan segera! 🔒
