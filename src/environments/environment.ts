import { envMode } from "../app/core/enums";

/**
 * 開発用環境変数
 */
export const environment = {
  env: envMode.dev,
  serverAddress: 'http://localhost:3000',
}