var key_table = {
	charset: "jpn",
	setCharset : function (charset) {
		this.charset = charset;
	},
	getString : function (buffer_string,keyCode) {
		if (buffer_string.length === 0) {
			// bufferに文字なし
			// キーコードの文字をそのまま返す
			return this.key_table_jpn[(new Number(keyCode)).toString()];
		}else if(buffer_string.length === 1){
			// bufferに一文字のみ
			if (this.alphabet.indexOf(buffer_string) !== -1) {
				// bufferの文字がアルファベット
				// keytableからオブジェクト取得
				var s = this.key_table_jpn[buffer_string];
				// オブジェクトにキーコードを与えて、変換文字取得
				var str =  s[(new Number(keyCode)).toString()];
				if ( str == null) {
					// 変換文字が取得できないということは、アルファベット二文字が変換可能な組み合わせではないということ
					var typestr = this.key_table_jpn[(new Number(keyCode)).toString()];
					if (buffer_string === typestr) { // miss: コピペしたことでbuffer_stringではなく未定義変数のsecondを比較していた。そのため無条件にelseとなって変換せず連結していた
						// 例えばzzと打つなど同じアルファベットの連続の場合、"っｚ"と返す
						return "っ" + typestr;
					}else{
						// 異なるアルファベットの場合、そのまま連結
						return buffer_string + typestr;
					}
				}else{
					// 変換できた場合
					// buffer文字をkeytableに与えて返ってきたオブジェクトにkeycodeを与えて得た文字を返す
					return str;
				}
			}else{
				// bufferの文字がアルファベットでなければbufferの文字とキーコード文字を連結した文字列を返す
				return buffer_string + this.key_table_jpn[(new Number(keyCode)).toString()];
			}
		}
		// 以下はbufferの文字列が二文字以上であることが保証されている
		var noEncode = buffer_string.substring(0,buffer_string.length - 2); // 変換しない文字
		var first = buffer_string.substring(buffer_string.length - 2,buffer_string.length -1); // miss: substringの第二引数で、.lengthを付け忘れ。
		var second = buffer_string.substring(buffer_string.length -1,buffer_string.length);
		if (this.alphabet.indexOf(first) === -1) {
			// 最後から二文字目がアルファベットではない
			if (this.alphabet.indexOf(second) === -1) {
				// bufferに変換するアルファベットがない
				// キーコード文字列をbufferに連結した文字列を返す
				return buffer_string + this.key_table_jpn[(new Number(keyCode)).toString()];
			}else{
				// bufferの最終文字だけがアルファベット
				var s = this.key_table_jpn[second];
				var str =  s[(new Number(keyCode)).toString()];
				if ( str == null) {
					// 変換文字が取得できないということは、アルファベット二文字が変換可能な組み合わせではないということ
					var typestr = this.key_table_jpn[(new Number(keyCode)).toString()];
					if (second === typestr) {
						// 例えばzzと打つなど同じアルファベットの連続の場合、"っｚ"と返す
						// miss: first入れ忘れ
						return noEncode + first + "っ" + typestr;
					}else{
						// 異なるアルファベットの場合、そのまま連結
						return buffer_string + typestr;
					}
				}else{
					// 最後から二文字目はアルファベット以外で、最終文字だけがアルファベット
					// 変換文字取得成功
					// miss: first入れ忘れ
					// 無変換文字 + first + buffer文字をkeytableに与えて返ってきたオブジェクトにkeycodeを与えて得た文字を返す
					return noEncode + first + str;
				}
			}
		}else{
			// bufferの後ろから二文字目がアルファベット
			// 最後の文字がアルファベットでないならそのまま連結 "sた + r"などの場合
			if(this.alphabet.indexOf(second) === -1) return buffer_string + this.key_table_jpn[(new Number(keyCode)).toString()];
			// bufferの最後にアルファベット二文字
			// 第一添字がアルファベットなら必ず第二添字のためのオブジェクトは返ってくる
			//
			var o = this.key_table_jpn[first][second];
			if (o != null) {
				var str = o[(new Number(keyCode)).toString()];
				// 三文字で１文字が完成した場合
				// sy + a →  "しゃ" など
				if (str != null) return noEncode + str;
			}
			// 三文字で一文字が完成しない場合、後ろ二文字で１文字が完成する可能性があるので再帰
			// staの三文字で"sた"となる場合がある
			// 後ろ二文字で１文字が完成しなければそのまま二文字が返ってくるので、やはりfirstを挟んで連結
			return noEncode + first + this.getString(second,keyCode);
		}
	},
	// alphabetの追加
	alphabet : ["k","s","t","n","h","m","y","r","w","g","z","d","b","p","j","f","l","x","c","v","q"],
	dotList : ["。","、",",","."],
	lineList : ["-","ー","―"],
	beforeBracketList : ["（","[","<","{","「"],
	afterBracketList : ["）","]",">","}","」"],
	katakana : {
		"あ" : "ア",
		"い" : "イ",
		"う" : "ウ",
		"え" : "エ",
		"お" : "オ",
		"か" : "カ",
		"き" : "キ",
		"く" : "ク",
		"け" : "ケ",
		"こ" : "コ",
		"さ" : "サ",
		"し" : "シ",
		"す" : "ス",
		"せ" : "セ",
		"そ" : "ソ",
		"た" : "タ",
		"ち" : "チ",
		"つ" : "ツ",
		"て" : "テ",
		"と" : "ト",
		"な" : "ナ",
		"に" : "ニ",
		"ぬ" : "ヌ",
		"ね" : "ネ",
		"の" : "ノ",
		"は" : "ハ",
		"ひ" : "ヒ",
		"ふ" : "フ",
		"へ" : "ヘ",
		"ほ" : "ホ",
		"ま" : "マ",
		"み" : "ミ",
		"む" : "ム",
		"め" : "メ",
		"も" : "モ",
		"や" : "ヤ",
		"ゆ" : "ユ",
		"よ" : "ヨ",
		"ら" : "ラ",
		"り" : "リ",
		"る" : "ル",
		"れ" : "レ",
		"ろ" : "ロ",
		"わ" : "ワ",
		"を" : "ヲ",
		"ん" : "ン",
		"が" : "ガ",
		"ぎ" : "ギ",
		"ぐ" : "グ",
		"げ" : "ゲ",
		"ご" : "ゴ",
		"ざ" : "ザ",
		"じ" : "ジ",
		"ず" : "ズ",
		"ぜ" : "ゼ",
		"ぞ" : "ゾ",
		"だ" : "ダ",
		"ぢ" : "ヂ",
		"づ" : "ヅ",
		"で" : "デ",
		"ど" : "ド",
		"ば" : "バ",
		"び" : "ビ",
		"ぶ" : "ブ",
		"べ" : "ベ",
		"ぼ" : "ボ",
		"ゃ" : "ャ",
		"ゅ" : "ュ",
		"ょ" : "ョ",
		"ぁ" : "ァ",
		"ぃ" : "ィ",
		"ぅ" : "ゥ",
		"ぇ" : "ェ",
		"ぉ" : "ォ"
	},
	shift_key : {
		"49" : "!",
		"50" : "\”",
		"51" : "＃",
		"52" : "＄",
		"53" : "％",
		"54" : "＆",
		"55" : "\’",
		"56" : "（",
		"57" : "）",
		"188" : "<",
		"190" : ">",
		"191" : "？",
		"220" : "}",
		"221" : "{"
	},
	key_table_jpn : {
		// x ... key_table_jpn[preStr][keyCode];
		// var mixLiteral = key_table_jpn[preStr]();
		// var str =  mixliteral[keyCode];
		"48": "０",
		"49": "１",
		"50": "２",
		"51": "３",
		"52": "４",
		"53": "５",
		"54": "６",
		"55": "７",
		"56": "８",
		"57": "９",
		"65": "あ",
		"73": "い",
		"85": "う",
		"69": "え",
		"79": "お",
		"75": "k",
		"83": "s",
		"84": "t",
		"78": "n",
		"72": "h",
		"77": "m",
		"89": "y",
		"82": "r",
		"87": "w",
		"71": "g",
		"90": "z",
		"68": "d",
		"66": "b",
		"80": "p",
		"74": "j",
		"70": "f",
		"76": "l",
		"88": "x",
		"67": "c",
		"86": "v",
		"81": "q",
		"188": "、",
		"189": "ー",
		"190": "。",
		"191": "・",
		"219" : "＠",
		"220" : "「",
		"221" : "」",
		"k": { "65": "か", "73": "き", "85": "く", "69": "け", "79": "こ",
				"y":{
					"65": "きゃ", "73": "きぃ", "85": "きゅ", "69": "きぇ", "79": "きょ"
				}
					},
		"s": {
			"65": "さ", "73": "し", "85": "す", "69": "せ", "79": "そ",
			"y" : {
				"65": "しゃ", "73": "しぃ", "85": "しゅ", "69": "しぇ", "79": "しょ"
			},
			"h" : {
				"65": "しゃ", "73": "し", "85": "しゅ", "69": "しぇ", "79": "しょ"
			}
		} ,
		"t": { "65": "た", "73": "ち", "85": "つ", "69": "て", "79": "と",
			"y" : {
				"65": "ちゃ", "73": "ちぃ", "85": "ちゅ", "69": "ちぇ", "79": "ちょ"
			}
		},
		"n": { "65": "な", "73": "に", "85": "ぬ", "69": "ね", "79": "の","78": "ん",
			"y" : {
				"65": "にょ", "73": "にぃ", "85": "にゅ", "69": "にぇ", "79": "にょ"
			}
		},
		"h": { "65": "は", "73": "ひ", "85": "ふ", "69": "へ", "79": "ほ",
			"y" : {
				"65": "ひょ", "73": "ひぃ", "85": "ひゅ", "69": "ひぇ", "79": "ひょ"
			}
		},
		"m": { "65": "ま", "73": "み", "85": "む", "69": "め", "79": "も",
			"y" : {
				"65": "みょ", "73": "みぃ", "85": "みゅ", "69": "みぇ", "79": "みょ"
			}
		},
		"y": { "65": "や", "73": "い", "85": "ゆ", "69": "いぇ", "79": "よ" },
		"r": { "65": "ら", "73": "り", "85": "る", "69": "れ", "79": "ろ",
			"y" : {
				"65": "りょ", "73": "りぃ", "85": "りゅ", "69": "りぇ", "79": "りょ"
			}
		},
		"w": { "65": "わ", "73": "うぃ", "85": "う", "69": "うぇ", "79": "を" },
		"g": { "65": "が", "73": "ぎ", "85": "ぐ", "69": "げ", "79": "ご",
			"y" : {
				"65": "ぎゃ", "73": "ぎぃ", "85": "ぎゅ", "69": "ぎぇ", "79": "ぎょ"
			}
		},
		"z": { "65": "ざ", "73": "じ", "85": "ず", "69": "ぜ", "79": "ぞ",
			"y" : {
				"65": "じゃ", "73": "じぃ", "85": "じゅ", "69": "じぇ", "79": "じょ"
			}
		},
		"d": { "65": "だ", "73": "ぢ", "85": "づ", "69": "で", "79": "ど",
			"y" : {
				"65": "ぢゃ", "73": "ぢぃ", "85": "ぢゅ", "69": "ぢぇ", "79": "ぢょ"
			}
		},
		"b": { "65": "ば", "73": "び", "85": "ぶ", "69": "べ", "79": "ぼ",
			"y" : {
				"65": "びゃ", "73": "びぃ", "85": "びゅ", "69": "びぇ", "79": "びょ"
			}
		},
		"p": { "65": "ぱ", "73": "ぴ", "85": "ぷ", "69": "ぺ", "79": "ぽ",
			"y" : {
				"65": "ぴゃ", "73": "ぴぃ", "85": "ぴゅ", "69": "ぴぇ", "79": "ぴょ"
			}
		},
		"j": { "65": "じゃ", "73": "じ", "85": "じゅ", "69": "じぇ", "79": "じょ" },
		"f": { "65": "ふぁ", "73": "ふぃ", "85": "ふ", "69": "ふぇ", "79": "ふぉ" },
		"l": { "65": "ぁ", "73": "ぃ", "85": "ぅ", "69": "ぇ", "79": "ぉ" },
		"x": { "65": "ぁ", "73": "ぃ", "85": "ぅ", "69": "ぇ", "79": "ぉ" },
		"c": { "65": "か", "73": "し", "85": "く", "69": "せ", "79": "こ" },
		"v": { "65": "ヴァ", "73": "ヴィ", "85": "ヴ", "69": "ヴェ", "79": "ヴォ" },
		"q": { "65": "くぁ", "73": "くぃ", "85": "く", "69": "くぇ", "79": "くぉ" }
	}
}
