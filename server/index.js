import express from 'express';
import cors from 'cors';
import { createFilePickerMiddleware } from './middleware.js';

const app = express();
const PORT = process.env.PORT || 8642;

app.use(cors());
app.use(express.json());
app.use('/api', createFilePickerMiddleware());

app.listen(PORT, () => {
  console.log(`[file-picker] ���������� http://localhost:${PORT}`);
  console.log(`[file-picker] API �˵�: http://localhost:${PORT}/api/fs/*`);
});
