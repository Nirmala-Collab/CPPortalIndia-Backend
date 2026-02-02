import app from './app.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.qa' });
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`CP Portal backend listening on port ${PORT}`);
});
