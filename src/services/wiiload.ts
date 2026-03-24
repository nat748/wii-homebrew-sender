import TcpSocket from 'react-native-tcp-socket';
import { File, Paths } from 'expo-file-system';
import pako from 'pako';

const WIILOAD_PORT = 4299;
const CHUNK_SIZE = 1024;
const MAGIC = 'HAXX';
const VERSION_MAJOR = 0;
const VERSION_MINOR = 5;

export type TransferProgress = {
  stage: 'downloading' | 'compressing' | 'connecting' | 'sending' | 'done' | 'error';
  percent: number;
  message: string;
};

type ProgressCallback = (progress: TransferProgress) => void;

function buildHeader(compressedSize: number, uncompressedSize: number): Buffer {
  const buf = Buffer.alloc(16);
  buf.write(MAGIC, 0, 4, 'ascii');
  buf.writeUInt8(VERSION_MAJOR, 4);
  buf.writeUInt8(VERSION_MINOR, 5);
  buf.writeUInt16BE(0, 6);
  buf.writeUInt32BE(compressedSize, 8);
  buf.writeUInt32BE(uncompressedSize, 12);
  return buf;
}

export async function sendToWii(
  zipUrl: string,
  filename: string,
  wiiIp: string,
  onProgress: ProgressCallback,
): Promise<void> {
  // Stage 1: Download the ZIP
  onProgress({ stage: 'downloading', percent: 0, message: 'Downloading app...' });

  const destFile = new File(Paths.cache, `${filename}.zip`);
  const downloaded = await File.downloadFileAsync(zipUrl, destFile, { idempotent: true });

  onProgress({ stage: 'downloading', percent: 100, message: 'Download complete' });

  // Stage 2: Read and compress
  onProgress({ stage: 'compressing', percent: 0, message: 'Compressing...' });

  const rawData = await downloaded.bytes();
  const compressed = pako.deflate(rawData, { level: 9 });

  onProgress({ stage: 'compressing', percent: 100, message: 'Compression complete' });

  // Stage 3: Connect and send via WiiLoad
  onProgress({ stage: 'connecting', percent: 0, message: `Connecting to ${wiiIp}...` });

  return new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      client.destroy();
      reject(new Error('Connection timed out (10s). Check Wii IP and ensure Homebrew Channel is running.'));
    }, 10000);

    const client = TcpSocket.createConnection(
      { host: wiiIp, port: WIILOAD_PORT },
      () => {
        clearTimeout(timeout);
        onProgress({ stage: 'sending', percent: 0, message: 'Sending to Wii...' });

        try {
          const header = buildHeader(compressed.length, rawData.length);
          client.write(header);

          const totalChunks = Math.ceil(compressed.length / CHUNK_SIZE);
          let chunkIndex = 0;

          const sendNextChunk = () => {
            while (chunkIndex < totalChunks) {
              const start = chunkIndex * CHUNK_SIZE;
              const end = Math.min(start + CHUNK_SIZE, compressed.length);
              const chunk = Buffer.from(compressed.slice(start, end));

              chunkIndex++;
              const percent = Math.round((chunkIndex / totalChunks) * 95);
              onProgress({ stage: 'sending', percent, message: `Sending... ${percent}%` });

              const canContinue = client.write(chunk);
              if (!canContinue) {
                client.once('drain', sendNextChunk);
                return;
              }
            }

            // All chunks sent, send filename
            const fnBuf = Buffer.from(`${filename}.zip\0`, 'utf8');
            client.write(fnBuf);

            // Give it a moment, then close
            setTimeout(() => {
              onProgress({ stage: 'done', percent: 100, message: 'Sent successfully!' });
              client.destroy();
              try { downloaded.delete(); } catch {}
              resolve();
            }, 500);
          };

          sendNextChunk();
        } catch (err: any) {
          client.destroy();
          reject(new Error(`Send failed: ${err.message}`));
        }
      },
    );

    client.on('error', (err) => {
      clearTimeout(timeout);
      reject(new Error(`Connection error: ${err.message}`));
    });

    client.on('close', () => {
      clearTimeout(timeout);
    });
  });
}

export function validateIp(ip: string): boolean {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  return parts.every((part) => {
    const num = parseInt(part, 10);
    return !isNaN(num) && num >= 0 && num <= 255 && part === String(num);
  });
}
