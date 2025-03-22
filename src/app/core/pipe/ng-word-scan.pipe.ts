import { Pipe, PipeTransform } from '@angular/core';

/**
 * NGワード
 */
export type NgWordListType = {
  hira: string[], // ひらがな
  kan: string[], // 漢字
  kata: string[], // カタカナ
  hankaku: string[], // 半角カタカナ
  mix: string[], // ひらがな、漢字、カタカナ混合
  roma: string[], // ローマ字
  en: string[], // 英語
  num: string[], // 数字
};

@Pipe({
  name: 'ngWordScan',
  standalone: true
})
export class NgWordScanPipe implements PipeTransform {
  // NGワードリスト
  private readonly NgWordList: NgWordListType = {
    hira: ['ちんぽ', 'ちんちん', 'ちんこ', 'まんこ', 'あなる', 'ちくび', 'おっぱい', 'せいじょうい', 'きじょうい', 'たちばっく',
      'ねばっく', 'おなにー', 'せっくす', 'ふぇら', 'ふうぞく', 'えーぶいじょゆう', 'えーぶいだんゆう', 'しるだんゆう',
      'やりちん', 'やりまん', 'せふれ', 'せいこうい', 'せんずり', 'でかちん', 'でかまら', 'くりとりす', 'にくべんき', 'きょこん',
      'きょにゅう', 'ばくにゅう', 'かうぱー', 'てまん', 'てこき', 'あなにー', 'ちくにー', 'ぱいずり', 'あしこき', 'くぱぁ',
      'はめどり', 'すかとろ', 'たねづけ', 'たねずけ', 'たいめんざい', 'まんぐりがえし', 'しっくすないん', 'だいしゅきほーるど',
      'なかだし', 'がんしゃ', 'そーぷ', 'でりへる', 'でりばりーへるす', 'らぶほてる', 'らぶほ', 'おなほ', 'でぃるど', 'にゅうりん',
      'あばずれ', 'せいし', 'ざーめん', 'らんし', 'しゃせい', 'びっち', 'ふぁっく'
    ],
    kan: ['珍歩', '珍子', '尻穴', '乳首', '正常位', '騎乗位', '自慰', '性行為', '淫', '風俗', '汁男優', '巨珍', '肉便器', '巨根',
      '巨乳', '爆乳', '我慢汁', '種付', '対面座位', '中出', '顔射', '乳輪', '淫乱', '精子', '卵子', '射精'
    ],
    kata: ['チンポ', 'チンチン', 'チンコ', 'マンコ', 'アナル', 'チクビ', 'オッパイ', 'セイジョウイ', 'キジョウイ', 'タチバック',
      'ネバック', 'オナニー', 'セックス', 'フェラ', 'フウゾク', 'エーブイジョユウ', 'エーブイダンユウ', 'シルダンユウ',
      'ヤリチン', 'ヤリマン', 'セフレ', 'セイコウイ', 'センズリ', 'デカチン', 'デカマラ', 'クリトリス', 'ニクベンキ', 'キョコン',
      'キョニュウ', 'バクニュウ', 'カウパー', 'テマン', 'テコキ', 'アナニー', 'チクニー', 'パイズリ', 'アシコキ', 'クパァ',
      'ハメドリ', 'スカトロ', 'タネヅケ', 'タネズケ', 'タイメンザイ', 'マングリガエシ', 'シックスナイン', 'ダイシュキホールド',
      'ナカダシ', 'ガンシャ', 'ソープ', 'デリヘル', 'デリバリーヘルス', 'ラブホテル', 'ラブホ', 'オナホ', 'ディルド', 'ニュウリン',
      'アバズレ', 'セイシ', 'ザーメン', 'ランシ', 'シャセイ', 'ビッチ', 'ファック'
    ],
    hankaku: ['ﾁﾝﾎﾟ', 'ﾁﾝﾁﾝ', 'ﾁﾝｺ', 'ﾏﾝｺ', 'ｱﾅﾙ', 'ﾁｸﾋﾞ', 'ｵｯﾊﾟｲ', 'ｾｲｼﾞｮｳｲ', 'ｷｼﾞｮｳｲ', 'ﾀﾁﾊﾞｯｸ',
      'ﾈﾊﾞｯｸ', 'ｵﾅﾆｰ', 'ｾｯｸｽ', 'ﾌｪﾗ', 'ﾌｳｿﾞｸ', 'AVｼﾞｮﾕｳ', 'AVﾀﾞﾝﾕｳ', 'ｼﾙﾀﾞﾝﾕｳ',
      'ﾔﾘﾁﾝ', 'ﾔﾘﾏﾝ', 'ｾﾌﾚ', 'ｾｲｺｳｲ', 'ｾﾝｽﾞﾘ', 'ﾃﾞｶﾁﾝ', 'ﾃﾞｶﾏﾗ', 'ｸﾘﾄﾘｽ', 'ﾆｸﾍﾞﾝｷ', 'ｷｮｺﾝ',
      'ｷｮﾆｭｳ', 'ﾊﾞｸﾆｭｳ', 'ｶｳﾊﾟｰ', 'ﾃﾏﾝ', 'ﾃｺｷ', 'ｱﾅﾆｰ', 'ﾁｸﾆｰ', 'ﾊﾟｲｽﾞﾘ', 'ｱｼｺｷ', 'ｸﾊﾟｧ',
      'ﾊﾒﾄﾞﾘ', 'ｽｶﾄﾛ', 'ﾀﾈﾂﾞｹ', 'ﾀﾈｽﾞｹ', 'ﾀｲﾒﾝｻﾞｲ', 'ﾏﾝｸﾞﾘｶﾞｴｼ', 'ｼｯｸｽﾅｲﾝ', 'ﾀﾞｲｼｭｷﾎｰﾙﾄﾞ',
      'ﾅｶﾀﾞｼ', 'ｶﾞﾝｼｬ', 'ｿｰﾌﾟ', 'ﾃﾞﾘﾍﾙ', 'ﾃﾞﾘﾊﾞﾘｰﾍﾙｽ', 'ﾗﾌﾞﾎﾃﾙ', 'ﾗﾌﾞﾎ', 'ｵﾅﾎ', 'ﾃﾞｨﾙﾄﾞ', 'ﾆｭｳﾘﾝ',
      'ｱﾊﾞｽﾞﾚ', 'ｾｲｼ', 'ｻﾞｰﾒﾝ', 'ﾗﾝｼ', 'ｼｬｾｲ', 'ﾋﾞｯﾁ', 'ﾌｧｯｸ'
    ],
    mix: ['立ちバック', '寝バック', 'AV女優', 'AV男優', 'ヤリちん', 'ヤリまん', 'デカちん', 'デカまら', '手マン', '手まん',
      '手コキ', '手こき', '足こき', '足コキ', 'はめ撮り', 'ハメ撮り', 'まんぐり返し'
    ],
    roma: ['Chinpo', 'Chimpo', 'Chinnpo', 'Chinchin', 'Chinko', 'Manko', 'Mannko', 'Anaru', 'Chikubi', 'Oppai', 'Seijoui', 'Kijoui', 'Tachibakku',
      'Nebakku', 'Onani', 'Sekkusu', 'Fera', 'Fuzoku', 'Shirudanyu', 'Yarichin', 'Yariman', 'Sefure', 'Seikoui', 'Senzuri', 'Dekachin', 'Dekamara',
      'Kuritorisu', 'Nikubenki', 'Kyokon', 'Kyonyu', 'Bakunyu', 'Kaupa', 'Teman', 'Tekoki', 'Anani', 'Tikuni', 'Paizuri', 'Ashikoki', 'Kupaxa',
      'Hamedori', 'Sukatoro', 'Taneduke', 'Tanezuke', 'Taimenzai', 'Mangurigaesi', 'Shikkusunain', 'Nakadashi', 'Gansya', 'So-pu', 'Deriheru', 'Deribariherusu',
      'Rabuhoteru', 'Rabuho', 'Onaho', 'Dexirudo', 'Nyuurin', 'Abazure', 'Za-men'
    ],
    en: ['Penis', 'Dick', 'Cock', 'Vagina', 'Anal', 'Nipple', 'Boobs', 'Masturbation', 'Sex', 'Porn',
      'Sex', 'Breasts', 'Tits', 'Boobies', 'Creampie', 'Cumshot', 'Fuck', 'Fack'
    ],
    num: ['0721', '4545', '114514'],
  };
  

  /**
   * 値の変換
   * @param value 入力値
   * @returns 変換後の値
   */
  public transform(value: string): string {
    let formattedWord = value;
    this.NgWordList.hira.forEach((word: string) => {
      formattedWord = formattedWord.replaceAll(word, '*');
    });
    this.NgWordList.kan.forEach((word: string) => {
      formattedWord = formattedWord.replaceAll(word, '*');
    });
    this.NgWordList.kata.forEach((word: string) => {
      formattedWord = formattedWord.replaceAll(word, '*');
    });
    this.NgWordList.hankaku.forEach((word: string) => {
      formattedWord = formattedWord.replaceAll(word, '*');
    });
    this.NgWordList.mix.forEach((word: string) => {
      formattedWord = formattedWord.replaceAll(word, '*');
    });
    this.NgWordList.roma.forEach((word: string) => {
      formattedWord = formattedWord.replaceAll(word, '*');
      formattedWord = formattedWord.replaceAll(word.toLowerCase(), '*');
      formattedWord = formattedWord.replaceAll(word.toUpperCase(), '*');
    });
    this.NgWordList.en.forEach((word: string) => {
      formattedWord = formattedWord.replaceAll(word, '*');
      formattedWord = formattedWord.replaceAll(word.toLowerCase(), '*');
      formattedWord = formattedWord.replaceAll(word.toUpperCase(), '*');
    });
    this.NgWordList.num.forEach((word: string) => {
      formattedWord = formattedWord.replaceAll(word, '*');
    });
    
    return formattedWord;
  }
}
