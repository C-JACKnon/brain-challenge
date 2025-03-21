import { envMode } from "../app/app.component";

/**
 * 本番用環境変数
 */
export const environment = {
  env: envMode.prod,
  serverAddress: 'https://brain-challenge-backend.onrender.com',
}