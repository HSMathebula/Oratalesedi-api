# Oratalesedi Form API

Handles contact and quote form submissions for https://oratalesedi.co.za/

### Endpoints
- POST `/submit-contact`
- POST `/submit-quote`

### Environment Variables
| Key | Description |
|-----|--------------|
| SMTP_LOGIN | Your Brevo sender email |
| SMTP_PASSWORD | Your Brevo SMTP key |
| RECEIVER_EMAIL | The address where you want to receive messages |

### Deployment
1. Push this folder to GitHub.
2. Create a new **Web Service** on [Render.com](https://render.com).
3. Set:
   - Build command: `npm install`
   - Start command: `node index.js`
4. Add the environment variables.
5. Deploy → get a URL like `https://oratalesedi-api.onrender.com`.

### Frontend Integration
Replace your frontend fetch URLs:
```js
await fetch("https://oratalesedi-api.onrender.com/submit-contact", {...});
await fetch("https://oratalesedi-api.onrender.com/submit-quote", {...});
