# Trendora - Post Tweet Feature Complete Explanation

This document explains the complete flow of posting a tweet with image upload, from frontend to backend.

---

## Table of Contents

1. [Overview](#overview)
2. [Frontend Flow](#frontend-flow)
3. [Backend Flow](#backend-flow)
4. [File Structure](#file-structure)
5. [Step-by-Step Request Flow](#step-by-step-request-flow)
6. [Code Examples](#code-examples)
7. [Troubleshooting](#troubleshooting)

---

## Overview

The post tweet feature allows users to:
- Write a text message (up to 280 characters)
- Optionally attach an image
- Submit the tweet to be displayed in the tweets feed

**Technologies Used:**
- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **File Upload:** Multer
- **Database:** MongoDB

---

## Frontend Flow

### 1. Component: `PostTweet.jsx`

**Location:** `frontend/src/pages/PostTweet.jsx`

**Key States:**
```javascript
const [content, setContent] = useState('');      // Tweet text
const [image, setImage] = useState(null);        // Selected image file
const [preview, setPreview] = useState(null);    // Image preview URL
const [loading, setLoading] = useState(false);   // Loading state
const [error, setError] = useState('');          // Error message
```

**User Actions:**

1. **Type Tweet:**
   - User types in textarea
   - `content` state updates via `onChange`

2. **Select Image:**
   - User clicks "Add Image" button
   - File input triggers `handleImageChange`
   - Creates preview URL using `URL.createObjectURL(file)`
   - Shows image preview with remove button

3. **Submit Tweet:**
   - Form submits via `submit` function
   - Creates `FormData` object
   - Appends `content` and `image` (if exists)
   - Sends POST request to backend

---

### 2. API Service: `api.js`

**Location:** `frontend/src/services/api.js`

**Function:**
```javascript
export const createTweet = async (payload, options = {}) => {
  const isFormData = payload instanceof FormData;
  
  const resp = await fetch(`${BASE_URL}/tweets`, {
    method: 'POST',
    headers: isFormData ? {} : getHeaders(),
    body: isFormData ? payload : JSON.stringify(payload),
    credentials: 'include',
  });
  return handleResponse(resp);
};
```

**Important:**
- When sending `FormData`, **no Content-Type header** is set
- Browser automatically sets `multipart/form-data` with correct boundary
- This is required for multer to parse the request

---

### 3. Display: `Tweets.jsx`

**Location:** `frontend/src/pages/Tweets.jsx`

**Image Display:**
```javascript
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

{tweet.image && (
  <img src={`${BACKEND_URL}${tweet.image}`} alt="Tweet image" className="tweet-image" />
)}
```

**Why Full URL?**
- Frontend runs on port `5173`
- Backend runs on port `5000`
- Images are served from backend at `/uploads/...`
- Need full URL: `http://localhost:5000/uploads/filename.jpg`

---

## Backend Flow

### 1. Route Handler

**Location:** `backend/routes/tweetRoutes.js`

```javascript
const upload = require('../middleware/upload');

router.post('/', authMiddleware, upload.single('image'), tweetController.createTweet);
```

**Middleware Chain:**
1. `authMiddleware` - Verifies user is logged in
2. `upload.single('image')` - Multer processes image upload
3. `tweetController.createTweet` - Creates tweet in database

---

### 2. Multer Middleware

**Location:** `backend/middleware/upload.js`

```javascript
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + file.originalname)
});

module.exports = multer({ storage });
```

**What it does:**
- Receives file from request
- Saves to `backend/uploads/` folder
- Renames file with timestamp to avoid conflicts
- Example: `1774885613453image.jpg`

**After processing:**
- File is saved to disk
- `req.file` object contains file info:
  ```javascript
  {
    filename: '1774885613453image.jpg',
    path: 'uploads\\1774885613453image.jpg',
    mimetype: 'image/jpeg',
    size: 12345
  }
  ```

---

### 3. Controller

**Location:** `backend/controllers/tweetController.js`

```javascript
exports.createTweet = async (req, res) => {
  try {
    const { content } = req.body
    if (!content) return res.status(400).json({ error: 'Content is required' })
    
    const tweetData = { 
      content, 
      author: req.session.user._id 
    }
    
    if (req.file) {
      tweetData.image = '/uploads/' + req.file.filename
    }
    
    const tweet = new Tweet(tweetData)
    await tweet.save()
    res.status(201).json(tweet)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
```

**Steps:**
1. Extract `content` from request body
2. Validate content exists
3. Create tweet data object with:
   - `content`: Text from user
   - `author`: User ID from session
   - `image`: Path if file was uploaded
4. Save to MongoDB
5. Return created tweet

---

### 4. Model

**Location:** `backend/models/Tweet.js`

```javascript
const tweetSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 280,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  image: String,  // Stores path like '/uploads/filename.jpg'
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tweet',
  }],
}, { timestamps: true })
```

---

### 5. Static File Serving

**Location:** `backend/app.js`

```javascript
const path = require('path');

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
```

**What it does:**
- Makes `uploads/` folder publicly accessible
- Maps `/uploads/*` URLs to files in `backend/uploads/`
- Example: `http://localhost:5000/uploads/image.jpg` serves the actual file

---

## File Structure

```
Trendora/
├── backend/
│   ├── uploads/              # Uploaded images stored here
│   │   ├── 1774885613453img.jpg
│   │   └── ...
│   ├── middleware/
│   │   ├── upload.js         # Multer configuration
│   │   └── authMiddleware.js
│   ├── controllers/
│   │   └── tweetController.js
│   ├── models/
│   │   └── Tweet.js
│   ├── routes/
│   │   └── tweetRoutes.js
│   └── app.js                # Express app setup
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── PostTweet.jsx  # Tweet form
    │   │   └── Tweets.jsx     # Tweet display
    │   ├── services/
    │   │   └── api.js         # API calls
    │   └── css/
    │       ├── posttweet.css
    │       └── tweets.css
    └── ...
```

---

## Step-by-Step Request Flow

### Visual Flow Diagram

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│    User     │     │   Frontend   │     │   Backend   │     │   Multer    │     │  MongoDB    │
│             │     │   (React)    │     │  (Express)  │     │             │     │             │
└──────┬──────┘     └──────┬───────┘     └──────┬──────┘     └──────┬───────┘     └──────┬──────┘
       │                   │                     │                   │                   │
       │ 1. Type tweet     │                     │                   │                   │
       │    Select image   │                     │                   │                   │
       │──────────────────>│                     │                   │                   │
       │                   │                     │                   │                   │
       │                   │ 2. Create FormData  │                   │                   │
       │                   │    Append content   │                   │                   │
       │                   │    Append image     │                   │                   │
       │                   │                     │                   │                   │
       │                   │ 3. POST /tweets     │                   │                   │
       │                   │    FormData         │                   │                   │
       │                   │────────────────────>│                   │                   │
       │                   │                     │                   │                   │
       │                   │                     │ 4. authMiddleware │                   │
       │                   │                     │    Check session  │                   │
       │                   │                     │                   │                   │
       │                   │                     │ 5. upload.single  │                   │
       │                   │                     │    Parse multipart│                   │
       │                   │                     │──────────────────>│                   │
       │                   │                     │                   │                   │
       │                   │                     │                   │ 6. Save file to   │
       │                   │                     │                   │    uploads/       │
       │                   │                     │                   │                   │
       │                   │                     │                   │ 7. Set req.file   │
       │                   │                     │<──────────────────│                   │
       │                   │                     │                   │                   │
       │                   │                     │ 8. createTweet    │                   │
       │                   │                     │    Build tweet    │                   │
       │                   │                     │    object         │                   │
       │                   │                     │                   │                   │
       │                   │                     │ 9. Tweet.save()   │                   │
       │                   │                     │──────────────────────────────────────>│
       │                   │                     │                   │                   │
       │                   │                     │                   │ 10. Store in DB   │
       │                   │                     │                   │    with image path│
       │                   │                     │<──────────────────────────────────────│
       │                   │                     │                   │                   │
       │                   │ 11. Return tweet    │                   │                   │
       │                   │<────────────────────│                   │                   │
       │                   │                     │                   │                   │
       │ 12. Navigate to   │                     │                   │                   │
       │     /tweets       │                     │                   │                   │
       │<──────────────────│                     │                   │                   │
       │                   │                     │                   │                   │
       │ 13. Fetch tweets  │                     │                   │                   │
       │──────────────────>│                     │                   │                   │
       │                   │                     │                   │                   │
       │                   │ 14. GET /tweets     │                   │                   │
       │                   │────────────────────>│                   │                   │
       │                   │                     │                   │                   │
       │                   │ 15. Return tweets   │                   │                   │
       │                   │    (with image URLs)│                   │                   │
       │                   │<────────────────────│                   │                   │
       │                   │                     │                   │                   │
       │ 16. Display tweets│                     │                   │                   │
       │     Show images   │                     │                   │                   │
       │<──────────────────│                     │                   │                   │
       │                   │                     │                   │                   │
       │ 17. Load images   │                     │                   │                   │
       │     from backend  │                     │                   │                   │
       │─────────────────────────────────────────────────────────────────────────────────>│
       │                   │                     │                   │                   │
       │ Images displayed  │                     │                   │                   │
       │<─────────────────────────────────────────────────────────────────────────────────│
       │                   │                     │                   │                   │
```

### Detailed Steps

| Step | Action | Details |
|------|--------|---------|
| 1 | User types tweet | Enters text in textarea |
| 2 | User selects image | Clicks "Add Image", chooses file |
| 3 | Preview shown | `URL.createObjectURL()` creates preview |
| 4 | User clicks Post | Form submits |
| 5 | FormData created | `new FormData()` with content + image |
| 6 | POST request sent | To `http://localhost:5000/tweets` |
| 7 | Auth middleware checks session | Verifies user is logged in |
| 8 | Multer parses multipart | Extracts file from request |
| 9 | File saved to disk | `backend/uploads/timestamp_filename` |
| 10 | Controller creates tweet | With image path `/uploads/filename` |
| 11 | Tweet saved to MongoDB | Document includes image field |
| 12 | Response sent back | Tweet object returned to frontend |
| 13 | Navigate to tweets page | `navigate('/tweets')` |
| 14 | Fetch tweets | GET `/tweets` endpoint |
| 15 | Tweets returned | Array includes image paths |
| 16 | Display tweets | Map through tweets, render each |
| 17 | Images load | Browser requests from backend `/uploads/` |

---

## Code Examples

### Frontend: Posting a Tweet

```javascript
// PostTweet.jsx
const submit = async (e) => {
  e.preventDefault();
  
  // Create FormData
  const formData = new FormData();
  formData.append('content', content);
  if (image) formData.append('image', image);
  
  // Send to backend
  await createTweet(formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  
  // Navigate to tweets page
  navigate('/tweets');
};
```

### Backend: Receiving and Saving

```javascript
// tweetController.js
exports.createTweet = async (req, res) => {
  const { content } = req.body;
  
  const tweetData = {
    content,
    author: req.session.user._id
  };
  
  // Add image if uploaded
  if (req.file) {
    tweetData.image = '/uploads/' + req.file.filename;
  }
  
  const tweet = new Tweet(tweetData);
  await tweet.save();
  
  res.json(tweet);
};
```

### Frontend: Displaying Tweet with Image

```javascript
// Tweets.jsx
const BACKEND_URL = 'http://localhost:5000';

{tweets.map((tweet) => (
  <li key={tweet._id}>
    <div>{tweet.content}</div>
    {tweet.image && (
      <img src={`${BACKEND_URL}${tweet.image}`} alt="Tweet" />
    )}
  </li>
))}
```

---

## Troubleshooting

### Issue 1: "Multipart: Boundary not found"

**Cause:** Content-Type header was set manually instead of letting browser set it.

**Solution:**
```javascript
// WRONG
headers: { 'Content-Type': 'multipart/form-data' }

// CORRECT
headers: {}  // Let browser set it automatically
```

---

### Issue 2: Image not displaying (broken image icon)

**Cause:** Using relative path instead of full backend URL.

**Solution:**
```javascript
// WRONG
<img src={tweet.image} />

// CORRECT
<img src={`http://localhost:5000${tweet.image}`} />
```

---

### Issue 3: File not uploading (req.file is undefined)

**Possible causes:**
1. Multer middleware not added to route
2. Field name mismatch (should be `'image'`)
3. File size exceeds limit

**Check:**
```javascript
// Route should have:
upload.single('image')

// FormData should have:
formData.append('image', file);
```

---

### Issue 4: CORS Error

**Cause:** Backend not configured to accept requests from frontend port.

**Solution in `app.js`:**
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
```

---

### Issue 5: Session not found / User not authenticated

**Cause:** Credentials not included in fetch request.

**Solution:**
```javascript
fetch(url, {
  credentials: 'include',  // Required for cookies/session
});
```

---

## Database Schema

### Tweet Document Example

```javascript
{
  "_id": "65f8a2b1c4d5e6f7g8h9i0j1",
  "content": "Hello from Trendora! #firstTweet",
  "author": "65f8a1a2b3c4d5e6f7g8h9i0",
  "image": "/uploads/1774885613453photo.jpg",
  "likes": [],
  "replies": [],
  "createdAt": "2026-03-30T12:34:56.789Z",
  "updatedAt": "2026-03-30T12:34:56.789Z"
}
```

---

## API Endpoints

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| POST | `/tweets` | Create new tweet | Yes |
| GET | `/tweets` | Get all tweets | Yes |
| POST | `/tweets/:id/like` | Like a tweet | Yes |
| GET | `/tweets/me` | Get my tweets | Yes |

---

## Security Considerations

1. **File Type Validation:** Multer filter should only allow images
2. **File Size Limit:** Set max file size (e.g., 5MB)
3. **Authentication:** All tweet routes require login
4. **Input Validation:** Content required, max 280 characters
5. **Path Traversal:** Multer handles filename sanitization

---

## Performance Tips

1. **Image Optimization:** Compress images before upload
2. **CDN:** Use CDN for serving images in production
3. **Lazy Loading:** Implement lazy loading for tweet images
4. **Pagination:** Paginate tweets for large datasets
5. **Caching:** Cache frequently accessed tweets

---

*Generated for Trendora - March 2026*
