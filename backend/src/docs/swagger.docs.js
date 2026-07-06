/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 *   - name: Users
 *     description: User management endpoints
 *   - name: Artists
 *     description: Artist management endpoints
 *   - name: Albums
 *     description: Album management endpoints
 *   - name: Songs
 *     description: Song management endpoints
 *   - name: Playlists
 *     description: Playlist management endpoints
 *   - name: Likes
 *     description: Song like/unlike endpoints
 *   - name: History
 *     description: Listening history endpoints
 *   - name: Search
 *     description: Search endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout user
 *     responses:
 *       200:
 *         description: Logged out successfully
 */

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 *     responses:
 *       200:
 *         description: Token refreshed
 */

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user profile
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: User profile
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users (admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: role
 *         schema: { type: string, enum: [user, admin] }
 *     responses:
 *       200:
 *         description: Users list
 */

/**
 * @swagger
 * /api/users/profile/me:
 *   put:
 *     tags: [Users]
 *     summary: Update own profile
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               avatar: { type: string }
 *     responses:
 *       200:
 *         description: Profile updated
 */

/**
 * @swagger
 * /api/users/password/me:
 *   put:
 *     tags: [Users]
 *     summary: Change password
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword: { type: string }
 *               newPassword: { type: string }
 *     responses:
 *       200:
 *         description: Password changed
 */

/**
 * @swagger
 * /api/artists:
 *   get:
 *     tags: [Artists]
 *     summary: Get all artists
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: genre
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Artists list
 *   post:
 *     tags: [Artists]
 *     summary: Create artist (admin)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               bio: { type: string }
 *               genre: { type: string }
 *               image: { type: string, format: binary }
 *               verified: { type: boolean }
 *     responses:
 *       201:
 *         description: Artist created
 */

/**
 * @swagger
 * /api/artists/{id}:
 *   get:
 *     tags: [Artists]
 *     summary: Get artist by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Artist details
 *   put:
 *     tags: [Artists]
 *     summary: Update artist (admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               bio: { type: string }
 *               genre: { type: string }
 *               image: { type: string, format: binary }
 *               verified: { type: boolean }
 *     responses:
 *       200:
 *         description: Artist updated
 *   delete:
 *     tags: [Artists]
 *     summary: Delete artist (admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Artist deleted
 */

/**
 * @swagger
 * /api/albums:
 *   get:
 *     tags: [Albums]
 *     summary: Get all albums
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: genre
 *         schema: { type: string }
 *       - in: query
 *         name: artist
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Albums list
 *   post:
 *     tags: [Albums]
 *     summary: Create album (admin)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, artist]
 *             properties:
 *               title: { type: string }
 *               artist: { type: string }
 *               releaseYear: { type: integer }
 *               genre: { type: string }
 *               description: { type: string }
 *               coverImage: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Album created
 */

/**
 * @swagger
 * /api/albums/{id}:
 *   get:
 *     tags: [Albums]
 *     summary: Get album by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Album details
 *   put:
 *     tags: [Albums]
 *     summary: Update album (admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Album updated
 *   delete:
 *     tags: [Albums]
 *     summary: Delete album (admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Album deleted
 */

/**
 * @swagger
 * /api/songs:
 *   get:
 *     tags: [Songs]
 *     summary: Get all songs
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: genre
 *         schema: { type: string }
 *       - in: query
 *         name: artist
 *         schema: { type: string }
 *       - in: query
 *         name: album
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Songs list
 *   post:
 *     tags: [Songs]
 *     summary: Create song (admin)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, artist]
 *             properties:
 *               title: { type: string }
 *               artist: { type: string }
 *               album: { type: string }
 *               duration: { type: integer }
 *               genre: { type: string }
 *               coverImage: { type: string, format: binary }
 *               audioUrl: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Song created
 */

/**
 * @swagger
 * /api/songs/{id}:
 *   get:
 *     tags: [Songs]
 *     summary: Get song by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Song details
 *   put:
 *     tags: [Songs]
 *     summary: Update song (admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Song updated
 *   delete:
 *     tags: [Songs]
 *     summary: Delete song (admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Song deleted
 */

/**
 * @swagger
 * /api/playlists:
 *   get:
 *     tags: [Playlists]
 *     summary: Get user playlists
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Playlists list
 *   post:
 *     tags: [Playlists]
 *     summary: Create playlist
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               coverImage: { type: string }
 *               isPublic: { type: boolean }
 *     responses:
 *       201:
 *         description: Playlist created
 */

/**
 * @swagger
 * /api/playlists/{id}:
 *   get:
 *     tags: [Playlists]
 *     summary: Get playlist by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Playlist details
 *   put:
 *     tags: [Playlists]
 *     summary: Update playlist
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Playlist updated
 *   delete:
 *     tags: [Playlists]
 *     summary: Delete playlist
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Playlist deleted
 */

/**
 * @swagger
 * /api/playlists/{id}/songs:
 *   post:
 *     tags: [Playlists]
 *     summary: Add song to playlist
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [songId]
 *             properties:
 *               songId: { type: string }
 *     responses:
 *       200:
 *         description: Song added
 *   delete:
 *     tags: [Playlists]
 *     summary: Remove song from playlist
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [songId]
 *             properties:
 *               songId: { type: string }
 *     responses:
 *       200:
 *         description: Song removed
 */

/**
 * @swagger
 * /api/likes:
 *   get:
 *     tags: [Likes]
 *     summary: Get all liked songs
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Liked songs list
 *   post:
 *     tags: [Likes]
 *     summary: Like a song
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [songId]
 *             properties:
 *               songId: { type: string }
 *     responses:
 *       201:
 *         description: Song liked
 */

/**
 * @swagger
 * /api/likes/{songId}:
 *   delete:
 *     tags: [Likes]
 *     summary: Unlike a song
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: songId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Song unliked
 */

/**
 * @swagger
 * /api/likes/{songId}/check:
 *   get:
 *     tags: [Likes]
 *     summary: Check if song is liked
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: songId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Like status
 */

/**
 * @swagger
 * /api/history:
 *   get:
 *     tags: [History]
 *     summary: Get listening history
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: History list
 *   post:
 *     tags: [History]
 *     summary: Add song to history
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [songId]
 *             properties:
 *               songId: { type: string }
 *     responses:
 *       201:
 *         description: Added to history
 *   delete:
 *     tags: [History]
 *     summary: Clear history
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: History cleared
 */

/**
 * @swagger
 * /api/history/recently-played:
 *   get:
 *     tags: [History]
 *     summary: Get recently played songs
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Recently played list
 */

/**
 * @swagger
 * /api/search:
 *   get:
 *     tags: [Search]
 *     summary: Search songs, artists, albums
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [all, songs, artists, albums] }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Search results
 */
