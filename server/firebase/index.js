import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// const fileUrl = new URL('../config/fbServiceAccountKey.json', import.meta.url);
// const serviceAccount = await JSON.parse(readFileSync(fileUrl));
import serviceAccount from '../config/fbServiceAccountKey.json' assert { type: 'json' };

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

export { admin };
