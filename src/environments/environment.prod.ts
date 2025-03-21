import { envMode } from "../app/app.component";

/**
 * 本番用環境変数
 */
export const environment = {
  env: envMode.prod,
  serverAddress: 'https://c-jacknon.github.io/',
}