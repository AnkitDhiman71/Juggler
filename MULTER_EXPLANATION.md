# Multer File Upload Functionality - Trendora

## Overview

**Multer** is a Node.js middleware for handling `multipart/form-data`, which is primarily used for uploading files. In the Trendora application, Multer is configured to handle image uploads for tweets.

---

## Installation

Multer is installed as a dependency in the backend:

```bash
npm install multer
```

**Location:** `backend/package.json`
```json
{
  "dependencies": {
    "multer": "^2.1.1"
  }
}
```

---

## Configuration

### 1. Storage Configuration (`backend/middleware/upload.js`)

```javascript
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + file.originalname)
});

module.exports = multer({ storage });
```

**How it works:**

| Property | Description |
|----------|-------------|
| `destination` | Specifies where uploaded files are stored. Files are saved to the `uploads/` folder. |
| `filename` | Generates a unique filename by prepending the current timestamp (`Date.now()`) to the original filename. This prevents file name collisions. |

**Storage Engine:** `diskStorage` - Files are saved to the server's disk.

---

## Usage in Routes

### Tweet Routes (`backend/routes/tweetRoutes.js`)

```javascript
const upload = require('../middleware/upload');

router.post('/', authMiddleware, upload.single('image'), tweetController.createTweet);
```

**How it works:**

1. **`upload.single('image')`** - Middleware that processes a single file from the form field named `"image"`
2. The middleware runs **before** the `createTweet` controller
3. If a file is uploaded, it's saved and file info is attached to `req.file`
4. If no file is uploaded, the request continues with `req.file` as `undefined`

---

## File Upload Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Frontend)                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  HTML Form:                                             │   │
│  │  <form enctype="multipart/form-data">                   │   │
│  │    <input type="file" name="image" />                   │   │
│  │    <input type="text" name="content" />                 │   │
│  │  </form>                                                │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ POST /api/tweets
                              │ (multipart/form-data)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express + Multer)                   │
│                                                                 │
│  1. authMiddleware → Validates user session                     │
│                                                                 │
│  2. upload.single('image') → Multer processes the file:         │
│     • Validates file type and size                              │
│     • Saves file to: uploads/<timestamp><originalname>          │
│     • Attaches file info to req.file                            │
│                                                                 │
│  3. tweetController.createTweet → Creates tweet with:           │
│     • content: from req.body                                    │
│     • image: '/uploads/' + req.file.filename (if exists)        │
│     • author: req.session.user._id                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATABASE (MongoDB)                       │
│  Tweet Document:                                                │
│  {                                                              │
│    content: "Tweet text...",                                    │
│    image: "/uploads/1712012345678photo.jpg",                    │
│    author: ObjectId("..."),                                     │
│    likes: [],                                                   │
│    createdAt: ISODate("...")                                    │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Request Object After Multer

After `upload.single('image')` processes the request:

### `req.file` Object
```javascript
{
  fieldname: 'image',           // Form field name
  originalname: 'photo.jpg',    // Original file name
  encoding: '7bit',             // File encoding
  mimetype: 'image/jpeg',       // MIME type
  destination: 'uploads/',      // Storage folder
  filename: '1712012345678photo.jpg', // Saved filename
  path: 'uploads\\1712012345678photo.jpg', // Full path
  size: 102456                  // File size in bytes
}
```

### `req.body` Object
Contains text fields from the form:
```javascript
{
  content: "This is my tweet content"
}
```

---

## Controller Implementation (`backend/controllers/tweetController.js`)

```javascript
exports.createTweet = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Content is required' });

    const tweetData = {
      content,
      author: req.session.user._id
    };

    // Check if file was uploaded
    if (req.file) {
      tweetData.image = '/uploads/' + req.file.filename;
    }

    const tweet = new Tweet(tweetData);
    await tweet.save();
    res.status(201).json(tweet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
```

---

## Multer Methods

| Method | Description | Use Case |
|--------|-------------|----------|
| `upload.single(name)` | Uploads one file from specified field | Single image upload |
| `upload.array(name, maxCount)` | Uploads multiple files from one field | Multiple images |
| `upload.fields(fields)` | Uploads files from multiple fields | Different file types |
| `upload.none()` | No files, only text fields | Text-only forms |
| `upload.any()` | Uploads all files | Generic file upload |

---

## File Storage Structure

```
backend/
├── middleware/
│   └── upload.js          # Multer configuration
├── routes/
│   └── tweetRoutes.js     # Route with upload.single()
├── controllers/
│   └── tweetController.js # Uses req.file
├── uploads/               # Uploaded files stored here
│   ├── 1712012345678photo.jpg
│   └── 1712098765432image.png
└── server.js
```

---

## Key Points

1. **`enctype="multipart/form-data"`** is required in HTML forms for file uploads
2. **Field name must match** - The `name` attribute in HTML must match the parameter in `upload.single('name')`
3. **Files are saved synchronously** - Multer saves the file before passing control to the next middleware
4. **Error handling** - Multer errors can be caught using `instanceof multer.MulterError`
5. **File access** - Uploaded file info is available in `req.file`, text data in `req.body`

---

## Security Considerations

- Multer is applied only to specific routes (not global middleware)
- File validation (type, size) should be added for production
- The `uploads/` folder should have proper permissions
- Consider sanitizing `originalname` to prevent path traversal attacks

---

## Example HTML Form

```html
<form action="/api/tweets" method="POST" enctype="multipart/form-data">
  <textarea name="content" placeholder="What's happening?"></textarea>
  <input type="file" name="image" accept="image/*" />
  <button type="submit">Tweet</button>
</form>
```

**Important:** The `enctype="multipart/form-data"` attribute is **required** for file uploads to work correctly.
