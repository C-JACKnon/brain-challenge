import { Injectable } from '@angular/core';
import { TodayScoreMaxCount } from '../constants';
import { TodayScore } from '../models';

/**
 * ストレージサービス
 * @class
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly LocalStorageKey: {
    id: string,
    playerName: string,
    bestScore: string,
    todayScore: string
  } = {
    id: 'Id',
    playerName: 'Name',
    bestScore: 'Best',
    todayScore: 'Today',
  };

  // 設定されているID
  private _id: string = '';
  public get id(): string {
    return this._id;
  }

  // 設定されているプレイヤー名
  // ※AngularはデフォルトでXSS対策としてバインドした値を画面に表示する際に
  //   サニタイジング(特殊文字のエスケープ処理)を行うため、わざわざ実装する必要はない
  private _playerName: string = '';
  public get playerName(): string {
    return this._playerName;
  }

  // ベストスコア（未設定の場合はnull）
  private _bestScore: number | null = null;
  public get bestScore(): number | null {
    return this._bestScore;
  }

  // 今日のスコア(1位～10位まで)
  private _todayScore: TodayScore = {
    date: '',
    score: [],
  };
  public get todayScore(): TodayScore {
    return this._todayScore;
  }

  private giveUpAnswer: string = ''; // ギブアップ時に表示する答え（空文字の場合は非表示）

  /**
   * @constructor
   */
  constructor() {
    this.restoreIdFromLocalStorage();

    // IDをLocalStorageから取得できた場合、保存されている他の情報も取得する
    if (this.id) {
      this.restoreAllDataFromLocalStorage();
    }
    // IDを取得できなかった場合、IDを生成して保存されている他の情報を削除する
    else {
      this._id = this.generateId();
      localStorage.setItem(this.LocalStorageKey.id, this._id);
      localStorage.removeItem(this.LocalStorageKey.playerName);
      localStorage.removeItem(this.LocalStorageKey.bestScore);
      localStorage.removeItem(this.LocalStorageKey.todayScore);
    }

    // 日付を確認する
    this.checkTodayScoreDate();

    // スコアがクリアされていない場合
    if (this._todayScore.score.length > 0) {
      // 取得したスコアを昇順に並べ替える
      this._todayScore.score.sort((a, b) => a - b);
    }
    
    console.info('Storage Data',
    {
      Id: this.id,
      Name: this.playerName,
      BestScore: this.bestScore,
      TodayScore: this.todayScore,
    });
  }

  // region Public Method

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
      localStorage.setItem(this.LocalStorageKey.playerName, formatPlayerName);
    }

    return formatPlayerName;
  }

  /**
   * ギブアップ時に表示する答えを設定する
   * @param answer 設定する答え
   */
  public setGiveUpAnswer(answer: string): void {
    this.giveUpAnswer = answer;
  }

  /**
   * ギブアップ時に表示する答えを取得する
   * ※ただし取得した後、空文字に初期化される
   * @returns ギブアップ時に表示する答え（空文字の場合は非表示）
   */
  public getGiveUpAnswer(): string {
    const giveUpAnswer = this.giveUpAnswer;
    this.giveUpAnswer = '';
    return giveUpAnswer;
  }

  /**
   * 今日のスコアの日付を確認する
   * もし日付が異なっている場合、日付を更新して、スコアをクリアする
   */
  public checkTodayScoreDate(): void {
    const today = this.getTodayDate();
    // 今日のスコアの日付と今日の日付が一致しない場合
    if (this._todayScore.date != today) {
      // 今日の日付に更新してスコアをリセットする
      this._todayScore.date = today;
      this._todayScore.score.length = 0;
      localStorage.setItem(this.LocalStorageKey.todayScore, JSON.stringify(this._todayScore));
    }
  }

  /**
   * スコアを設定する
   * @param score 設定するスコア
   * @returns ベストスコアを更新したか否か
   */
  public setScore(score: number): boolean {
    let isUpdateTodayScore = false;
    // 今日のスコアがまだ10位まで埋まってない場合、新しいスコアを追加する
    if (this._todayScore.score.length < TodayScoreMaxCount) {
      this._todayScore.score.push(score);
      isUpdateTodayScore = true;
    }
    // 新しいスコアが10位のスコアより良いスコアの場合、10位のスコアと新しいスコアを入れ替える
    else if (score < this._todayScore.score[TodayScoreMaxCount - 1]) {
      this._todayScore.score[TodayScoreMaxCount - 1] = score;
      isUpdateTodayScore = true;
    }

    // 今日のスコアが更新された場合
    if (isUpdateTodayScore) {
      // 昇順に並べ替える
      this._todayScore.score.sort((a, b) => a - b);
      localStorage.setItem(this.LocalStorageKey.todayScore, JSON.stringify(this._todayScore));
      console.info('Update TodayScore:', this._todayScore.score);
    }

    // ベストスコアが更新された場合
    if (this._bestScore === null || this._bestScore > score) {
      this._bestScore = score;
      localStorage.setItem(this.LocalStorageKey.bestScore, this._bestScore.toString());
      console.info('Update BestScore:', this._bestScore);
      return true;
    }

    return false;
  }

  // #region Private Method

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
    const id = localStorage.getItem(this.LocalStorageKey.id);
    if (id) {
      this._id = id;
    }
  }

  /**
   * LocalStorageから全てのデータをリストアする
   */
  private restoreAllDataFromLocalStorage(): void {
    // プレイヤー名を取得
    const playerName = localStorage.getItem(this.LocalStorageKey.playerName);
    if (playerName) {
      this._playerName = playerName;
    }

    // ベストスコアを取得
    const bestScore = localStorage.getItem(this.LocalStorageKey.bestScore);
    if (bestScore) {
      this._bestScore = Number(bestScore);
    }

    // 今日のスコアを取得
    const todayScoreString = localStorage.getItem(this.LocalStorageKey.todayScore);
    if (todayScoreString) {
      const todayScore: TodayScore = JSON.parse(todayScoreString);
      if (todayScore.date && this.isValidDateFormat(todayScore.date)) {
        this._todayScore.date = todayScore.date;
        this._todayScore.score = [...todayScore.score];
      }
    }
  }

  /**
   * 有効な日付のフォーマットか判定する
   * @param dateString 判定対象の文字列型の日付
   * @returns 有効か否か
   */
  private isValidDateFormat(dateString: string): boolean {
    const regex = /^\d{4}\/\d{1,2}\/\d{1,2}$/;
    if (!regex.test(dateString)) {
      return false;
    }

    // 実際に存在する日付かをチェック
    const [year, month, day] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);

    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
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

  /**
   * 今日の日付(yyyy/M/d)を取得する
   */
  private getTodayDate(): string {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "numeric", day: "numeric", timeZone: "Asia/Tokyo" });
    return formatter.format(date);
  }
}
