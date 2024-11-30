import { Injectable } from '@angular/core';

/**
 * ユーザ名サービス
 * @class
 */
@Injectable({
  providedIn: 'root'
})
export class UserNameService {
  // 設定されているユーザ名
  private _userName: string = "";
  public get userName(): string {
    return this._userName;
  }
  public set userName(userName: string) {
    this._userName = userName;
  }
}
