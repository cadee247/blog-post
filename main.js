const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const BlogPost = require('./models/BlogPost');
const newPostController = require('./controllers/newPost');
const newUserController = require('./controllers/newUser');
const storeUserController = require('./controllers/storeUser');
const storePostController = require('./controllers/storePost');
const loginController = require('./controllers/login');
const loginUserController = require('./controllers/loginUser');
const logoutController = require('./controllers/logout');
const deletePostController = require('./controllers/deletePostController');
const storeCommentController = require('./controllers/storeComment');

const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware');

const app = express();
app.set('view engine', 'ejs');

// ────────────────────────────────────────────────────────────────────────────
// ENVIRONMENT CONFIG
// ────────────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/Cadee's_database";
const SESSION_SECRET = process.env.SESSION_SECRET || 'default-secret';

// ────────────────────────────────────────────────────────────────────────────
// GLOBAL ERROR LOGGING
// ────────────────────────────────────────────────────────────────────────────

process.on('uncaughtException', err => {
    console.error('❌ Uncaught Exception:', err);
});
process.on('unhandledRejection', err => {
    console.error('❌ Unhandled Rejection:', err);
});

// ────────────────────────────────────────────────────────────────────────────
// MIDDLEWARE
// ────────────────────────────────────────────────────────────────────────────

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

global.loggedIn = null;
app.use("*", (req, res, next) => {
    loggedIn = req.session.userId;
    next();
});

// ────────────────────────────────────────────────────────────────────────────
// DATABASE CONNECTION
// ────────────────────────────────────────────────────────────────────────────

console.log('🔗 Connecting to MongoDB:', MONGODB_URI);

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connected');
});

mongoose.connection.on('error', err => {
    console.error('❌ MongoDB connection error:', err);
});

// ────────────────────────────────────────────────────────────────────────────
// ROUTES
// ────────────────────────────────────────────────────────────────────────────

app.get('/health', (req, res) => {
    res.send('OK');
});

app.get('/', async (req, res) => {
    try {
        const blogposts = await BlogPost.find({});
        res.render('index', { blogposts });
    } catch (err) {
        console.error('❌ Error fetching blogposts:', err);
        res.status(500).send('Database error');
    }
});

app.get('/about', (req, res) => res.render('about'));
app.get('/contact', (req, res) => res.render('contact'));
app.get('/samplepost', (req, res) => res.render('samplepost'));

app.get('/post/:id', async (req, res) => {
    try {
        const blogpost = await BlogPost.findById(req.params.id);
        res.render('post', { blogpost });
    } catch (err) {
        console.error('❌ Error fetching post:', err);
        res.status(404).render('notfound');
    }
});

app.get('/posts/new', authMiddleware, newPostController);
app.post('/posts/store', authMiddleware, storePostController);
app.post('/posts/delete/:id', deletePostController);
app.post('/post/:id/comment', storeCommentController);

app.get('/auth/register', redirectIfAuthenticatedMiddleware, newUserController);
app.post('/users/register', redirectIfAuthenticatedMiddleware, storeUserController);
app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController);
app.post('/users/login', redirectIfAuthenticatedMiddleware, loginUserController);
app.get('/auth/logout', logoutController);

// Fallback 404 route
app.use((req, res) => res.render('notfound'));

// ────────────────────────────────────────────────────────────────────────────
// START SERVER
// ────────────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
    console.log(`🚀 App listening on port ${PORT}`);
});
