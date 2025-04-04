import { envMode } from "../app/core/enums";

/**
 * 本番用環境変数
 */
export const environment = {
  env: envMode.prod,
  serverAddress: 'https://brain-challenge-backend.onrender.com',
}