import { basePlaywrightConfig } from '@jabraf/dev/playwright';

export default basePlaywrightConfig({
  isFunctional: process.env.TEST_ENV === 'functional',
  baseURL: 'https://jabran.me',
  devServerURL: 'http://localhost:8080',
});
