import app from './app';
import { env } from './config/env';
import prisma from './config/prisma';
import { setupAdmin } from './utils/adminSetup';
import net from 'net';

// ─── Track all open sockets so we can destroy them instantly on shutdown ──────
const openSockets = new Set<net.Socket>();

let server: net.Server | undefined;

// ─── Force-close every open connection and exit ───────────────────────────────
const gracefulShutdown = (signal: string, exitCode = 0) => {
  console.log(`\n🔄 ${signal} received. Shutting down gracefully...`);

  // Destroy all keep-alive sockets so the port is released immediately
  for (const socket of openSockets) {
    socket.destroy();
  }
  openSockets.clear();

  if (server && server.listening) {
    server.close(() => {
      console.log('✅ HTTP server closed. Port released.');
      prisma.$disconnect().then(() => process.exit(exitCode));
    });
  } else {
    prisma.$disconnect().then(() => process.exit(exitCode));
  }

  // Hard-kill safety net: if server hasn't closed in 3s, force exit
  setTimeout(() => {
    console.error('⚠️  Forced exit after timeout.');
    process.exit(exitCode);
  }, 3000).unref();
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// ─── Checks whether a port is already in use ─────────────────────────────────
const isPortInUse = (port: number): Promise<boolean> =>
  new Promise((resolve) => {
    const tester = net
      .createServer()
      .once('error', () => resolve(true))
      .once('listening', () => { tester.close(); resolve(false); })
      .listen(port, '0.0.0.0');
  });

// ─── Wait until port is free (nodemon restart grace period) ──────────────────
const waitForPort = async (port: number, retries = 10, delay = 1000): Promise<void> => {
  for (let i = 0; i < retries; i++) {
    if (!(await isPortInUse(port))) return;
    console.warn(`⚠️  Port ${port} busy — waiting... (${i + 1}/${retries})`);
    await new Promise((r) => setTimeout(r, delay));
  }
  console.error(`❌ Port ${port} still in use after ${retries} retries. Exiting.`);
  process.exit(1);
};

// ─── Boot sequence ────────────────────────────────────────────────────────────
const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('✅ DB Connection successful!');

    await setupAdmin();

    await waitForPort(env.port);

    server = app.listen(env.port, () => {
      console.log(`🚀 App running on port ${env.port}...`);
    });

    // ── Track every open socket so gracefulShutdown can destroy them ──────────
    server.on('connection', (socket: net.Socket) => {
      openSockets.add(socket);
      socket.once('close', () => openSockets.delete(socket));
    });

    // Handle port errors at runtime (extra safety net)
    server.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${env.port} is already in use. Another instance may still be shutting down.`);
        console.error('   Run:  netstat -ano | findstr :5000  then kill the PID.');
        process.exit(1);
      } else {
        throw err;
      }
    });
  } catch (err: any) {
    console.error('❌ FAILED TO START SERVER!');
    console.error('Error Details:', err.message);
    process.exit(1);
  }
};

startServer();

// ─── Unhandled promise rejections ────────────────────────────────────────────
process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  gracefulShutdown('UnhandledRejection');
});

