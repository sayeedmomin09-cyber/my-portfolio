# Sayeed Momin Portfolio

Professional portfolio with a Node.js, Express, and MongoDB contact form.

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file from `.env.example` and add your real values:

```bash
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/portfolio?retryWrites=true&w=majority
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your-gmail-app-password
CONTACT_TO_EMAIL=your-receiving-email@gmail.com
```

3. Start the server:

```bash
npm start
```

4. Open `http://localhost:5000`.

## Render deployment

Use these settings on Render:

- Build command: `npm install`
- Start command: `npm start`
- Environment variable: `MONGODB_URI`
- Optional email variables: `EMAIL_USER`, `EMAIL_PASS`, `CONTACT_TO_EMAIL`

After deployment, test database status at:

```text
https://your-render-url.onrender.com/api/health
```

If `database` is not `connected`, check these MongoDB Atlas settings:

- Database Access: the username/password in `MONGODB_URI` must be correct.
- Network Access: allow Render to connect. For a student/demo portfolio, `0.0.0.0/0` is the simplest option.

Contact form submissions are saved in the database name from your Mongo URI, inside the `messages` collection.
