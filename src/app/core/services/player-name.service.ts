import { Injectable } from '@angular/core';

/**
 * プレイヤー名サービス
 * 
 * AngularはデフォルトでXSS対策としてバインドした値を画面に表示する際に
 * サニタイジング(特殊文字のエスケープ処理)を行うため、わざわざ実装する必要はない
 * 
 * @class
 */
@Injectable({
  providedIn: 'root'
})
export class PlayerNameService {
  private readonly IdLocalStorageKey: string = 'id'
  private readonly PlayerNameLocalStorageKey: string = 'name';

  // 設定されているID
  private _id: string = "";
  public get id(): string {
    return this._id;
  }

  // 設定されているプレイヤー名
  private _playerName: string = "";
  public get playerName(): string {
    return this._playerName;
  }

  /**
   * @constructor
   */
  constructor() {
    this.restoreIdFromLocalStorage();

    // IDをLocalStorageから取得できた場合にはプレイヤー名も取得する
    // IDを取得できなかった場合にはIDを生成し、LocalStorageに設定されているプレイヤー名を削除する
    if (this.id.length > 0) {
      this.restorePlayerNameFromLocalStorage();
    }
    else {
      this._id = this.generateId();
      localStorage.setItem(this.IdLocalStorageKey, this._id);
      localStorage.removeItem(this.PlayerNameLocalStorageKey);
    }
    
    console.info({
      id: this.id,
      name: this.playerName
    });
  }

  /**
   * 入力されたプレイヤー名を登録する
   * @param inputPlayerName 入力されたプレイヤー名
   * @returns 登録されたプレイヤー名(整形後のプレイヤー名)
   */
  public registerPlayerName(inputPlayerName: string): string {
    // プレイヤー名を整形する
    let formatPlayerName = this.formatPlayerName(inputPlayerName);
    
    // プレイヤー名が変更されている場合
    if (this._playerName != formatPlayerName) {
      this._playerName = formatPlayerName;
      // 変更されたプレイヤー名をlocaleStorageに保存
      localStorage.setItem(this.PlayerNameLocalStorageKey, formatPlayerName);
    }

    return formatPlayerName;
  }

  /**
   * プレイヤー名を整形する
   * - 先頭と最後の空白を削除する
   * - 最大文字数内に短くする
   * @param targetPlayerName 整形対象のプレイヤー名
   * @returns 整形後のプレイヤー名
   */
  private formatPlayerName(targetPlayerName: string): string {
    let formatPlayerName = targetPlayerName;

    // 先頭の空文字を削除する
    let emptyIndex = 0;
    for (let i = 0; i < formatPlayerName.length; i++) {
      if (formatPlayerName[i] === ' ' || formatPlayerName[i] === '　') {
        emptyIndex++;
      }
      else {
        break;
      }
    }
    if (emptyIndex > 0) {
      formatPlayerName = formatPlayerName.slice(emptyIndex);
    }

    // 最後の空文字を削除する
    emptyIndex = 0;
    for (let i = formatPlayerName.length - 1; i >= 0; i--) {
      if (formatPlayerName[i] === ' ' || formatPlayerName[i] === '　') {
        emptyIndex++;
      }
      else {
        break;
      }
    }
    if (emptyIndex > 0) {
      formatPlayerName = formatPlayerName.slice(0, -emptyIndex);
    }

    // 最大文字数を超えている場合は最後の文字から超えている文字数分削除する
    const maxPlayerNameLength = 15;
    if (formatPlayerName.length > maxPlayerNameLength) {
      formatPlayerName = formatPlayerName.slice(0, maxPlayerNameLength);
    }

    return formatPlayerName;
  }

  /**
   * IDをLocalStorageからリストアする
   */
  private restoreIdFromLocalStorage(): void {
    const id = localStorage.getItem(this.IdLocalStorageKey);
    if (id != null && id.length > 0) {
      this._id = id;
    }
  }

  /**
   * プレイヤー名をLocalStorageからリストアする
   */
  private restorePlayerNameFromLocalStorage(): void {
    const playerName = localStorage.getItem(this.PlayerNameLocalStorageKey);
    if (playerName != null && playerName.length > 0) {
      this._playerName = playerName;
    }
  }

  
  /**
   * IDを生成する
   */
  private generateId(): string {
    // 現在時刻(ms)を32進数で取得
    const time = new Date().getTime().toString(32);

    // 0～Number型の最大値までのランダムな値を32進数で取得
    const random = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(32);

    const id = time + random;

    return id;
  }
}
