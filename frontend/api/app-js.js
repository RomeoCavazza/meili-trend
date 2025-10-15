import { readFile } from 'fs/promises';
import { join } from 'path';

export default async function handler(req, res) {
  try {
    const filePath = join(process.cwd(), '..', 'app.js');
    const content = await readFile(filePath, 'utf8');
    
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(content);
  } catch (error) {
    res.status(404).send('// app.js not found');
  }
}
