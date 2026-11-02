import express from 'express';
import path from 'node:path';
import config from './config/environment.js';
import apiRouter from './api/routes.js';

export const app = express();

// Standard middleware
app.use(express.json());

// CORS configuration (Zero hardcoding, read from config)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', config.corsOrigin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Serve static frontend files
const publicPath = path.resolve(config.rootDir, 'public');
app.use(express.static(publicPath));

// Debug diagnostic route
app.get('/api/debug-paths', (req, res) => {
  import('node:fs').then(fs => {
    res.json({
      rootDir: config.rootDir,
      publicPath,
      publicExists: fs.existsSync(publicPath),
      filesInPublic: fs.existsSync(publicPath) ? fs.readdirSync(publicPath) : [],
      filesInRoot: fs.existsSync(config.rootDir) ? fs.readdirSync(config.rootDir) : [],
      cwd: process.cwd(),
      filesInCwd: fs.readdirSync(process.cwd())
    });
  });
});

// Root route explicit handler
app.get('/', (req, res) => {
  res.sendFile(path.resolve(publicPath, 'index.html'));
});

// Mount REST API endpoints
app.use(config.apiPrefix, apiRouter);

// Fallback for SPA routing
app.get('*', (req, res) => {
  if (req.path.startsWith(config.apiPrefix)) {
    return res.status(404).json({ error: 'Endpoint Not Found', path: req.path });
  }
  res.sendFile(path.resolve(publicPath, 'index.html'));
});

// Export server listener if run directly
let serverInstance = null;
const isMain = process.argv[1] && (
  process.argv[1].endsWith('server.js') || 
  process.argv[1].endsWith('server')
);

if (isMain && process.env.NODE_ENV !== 'test') {
  serverInstance = app.listen(config.port, '0.0.0.0', () => {
    console.log(`[INFO] ${config.appName} started successfully on http://localhost:${config.port}`);
    console.log(`[INFO] REST API Contract Base: http://localhost:${config.port}${config.apiPrefix}`);
  });
}

export { serverInstance };
export default app;
