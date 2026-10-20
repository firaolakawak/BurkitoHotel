import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import roomsRouter from './src/server/routes/rooms.ts';
import bookingsRouter from './src/server/routes/bookings.ts';
import inventoryRouter from './src/server/routes/inventory.ts';
import menuRouter from './src/server/routes/menu.ts';
import posRouter from './src/server/routes/pos.ts';
import housekeepingRouter from './src/server/routes/housekeeping.ts';
import { PRISMA_SCHEMA_CONTENT } from './src/schema/prisma.schema.ts';
import { POSTGRES_DDL_CONTENT } from './src/schema/postgres.ddl.ts';
import { ARCHITECTURE_OVERVIEW } from './src/schema/architecture.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'healthy',
      app: 'GrandHorizon HMS & IMS Suite',
      timestamp: new Date().toISOString()
    });
  });

  // REST API Routes
  app.use('/api/rooms', roomsRouter);
  app.use('/api/bookings', bookingsRouter);
  app.use('/api/inventory', inventoryRouter);
  app.use('/api/menu', menuRouter);
  app.use('/api/pos', posRouter);
  app.use('/api/housekeeping', housekeepingRouter);

  // Schema & Blueprint Metadata Endpoints
  app.get('/api/schema/prisma', (_req, res) => {
    res.type('text/plain').send(PRISMA_SCHEMA_CONTENT);
  });

  app.get('/api/schema/postgres', (_req, res) => {
    res.type('text/plain').send(POSTGRES_DDL_CONTENT);
  });

  app.get('/api/schema/architecture', (_req, res) => {
    res.json(ARCHITECTURE_OVERVIEW);
  });

  // Client static assets / Vite middleware
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[GrandHorizon HMS/IMS] Server active on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal error during server startup:', err);
  process.exit(1);
});
