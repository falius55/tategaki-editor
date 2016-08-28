/*
 *	オブジェクト指向
 *	Paragraph,Row,Charは、親や子の参照を保持するのはもちろんのこと、木構造を無視して異なる親であっても次と前にある同種オブジェクトの参照を持つ
 *	Dom要素の参照を持つコンポジション
 *	要素の再利用のため、要素作成のみクロージャで行う
 *	jQyeryの使用箇所:width(),height(),addwheelEventlistener(),removeWheelEventListener(),bootstrap関係
 */
console.log('object.js');
const Util = {
	// baseArrayをcnt個ずつの配列に分割する
	splitArray:function(baseArray,cnt) {
		'use strict';
		const b = baseArray.length;
		const newArray = [];

		for (let i = 0,j,p; i < Math.ceil(b/cnt); i++) {
			j = i*cnt;
			p = baseArray.slice(j,j+cnt);
			newArray.push(p);
		}
		return newArray;
	},
	copyArray:function (array) {
		'use strict';
		const retArray = [];
		for (let value of array) {
			retArray.push(value);
		}
		return retArray;
	},
	// ２点間の距離を計算する
	computeDistanceP2P:function(x1,y1,x2,y2) {
		'use strict';
		// ２乗を使っているので、戻り値は必ず正の数になる
		// √{(b.x - a.x)^2+ (b.y - a.y)^2}
		return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
	},
	post: function (url,data,callback) {
		'use strict';
		const xhr = new XMLHttpRequest();
		xhr.responseType = 'json';
		xhr.open('POST',url);
		xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded;charset=UTF-8');

		let sendData = '';
		for (let name in data) {
			if (sendData != '') {
				sendData += '&';
			}
			sendData += name + '=' + encodeURI(data[name]).replace(/&/g,'%26');
		}

		xhr.addEventListener('load',function (e) {
			'use strict';
			if (xhr.response) {
				callback(xhr.response);
			} else {
				console.log('unsuccess');
			}
		});
		xhr.addEventListener('abort',function (e) {
			'use strict';
			alert('abort');
		});
		xhr.send(sendData);
	}
};
// closer
Util.createCharElement = (function () {
	'use strict';
	const eCharTemplate = document.createElement('span');
	eCharTemplate.classList.add('char');
	eCharTemplate.classList.add('display');

	return function (data) {
		const eChar = eCharTemplate.cloneNode(true);
		const char = data['char'];
		const classArr = data['decolation'];
		const fontSize = data['fontSize'];
		eChar.textContent = char;
		eChar.dataset.fontSize = fontSize || 'auto';
		for (let decolation of classArr) {
			eChar.classList.add(decolation);
		}

		// 文字の種類に応じて付与するクラス
		if (/[。、,.,]/.test(char))
			eChar.classList.add('vertical-dot');
		else if (/[「『]/.test(char))
			eChar.classList.add('vertical-before-kagi-bracket');
		else if (/[」』]/.test(char))
			eChar.classList.add('vertical-after-kagi-bracket');
		else if (/[（\[<\{【\(［〈]/.test(char))
			eChar.classList.add('vertical-before-bracket');
		else if (/[\)\]>\}】）］〉]/.test(char))
			eChar.classList.add('vertical-after-bracket');
		else if (/[-ー―〜]/.test(char))
			eChar.classList.add('character-line');
		else if (/[a-z]/.test(char))
			eChar.classList.add('alphabet');
		else if (/[１-９]/.test(char))
			eChar.classList.add('number');
		else if (/[っゃゅょぁぃぅぇぉァィゥェォッャュョ]/.test(char))
			eChar.classList.add('yoin');

		return eChar;
	}
})();
Util.createRowElement = (function () {
	'use strict';
	/*
	 *	[												 // 各文字のオブジェクトが配列で格納される
	 *		{											 // 文字を表すオブジェクト
	 *			"char":"あ",
	 *			"decolation":["decolation-color-blue"]
	 *		},
	 *		{
	 *			"char":"い",
	 *			"decolation":null
	 *		}
	 *	]
	 */
	const eRowTemplate = document.createElement('div');
	eRowTemplate.classList.add('row');
	eRowTemplate.classList.add('display');
	const eEOL = document.createElement('span');
	eEOL.classList.add('char');
	eEOL.classList.add('EOL');
	eEOL.classList.add('display');
	eRowTemplate.appendChild(eEOL);

	return function (data) {
		const eRow = eRowTemplate.cloneNode(true);
		return eRow;
	}
})();
Util.createParagraphElement = (function () {
	'use strict';
	// 決まった形のオブジェクトを引数にして、paragraphのhtml文字列を作成する
	/*
	 * 			[
	 * 				["decolation-textalign-center"],		 // 段落のクラスが文字列の配列で格納される
	 * 				[												 // 各文字のオブジェクトが配列で格納される
	 * 					{											 // 文字を表すオブジェクト
	 * 						"char":"あ",
	 * 						"decolation":["decolation-color-blue"]
	 * 					},
	 * 					{
	 * 						"char":"い",
	 * 						"decolation":[]
	 * 					}
	 * 					]
	 * 			]
	 */
	const eParagraphTemplate = document.createElement('div');
	eParagraphTemplate.classList.add('paragraph');

	return function (data) {
		const eParagraph = eParagraphTemplate.cloneNode(true);
		// 段落そのものにクラスを付与する
		for (let className of data[0]) {
			eParagraph.classList.add(className);
		}
		return eParagraph;
	}
})();
Util.createCharPosElement = (function () {
	'use strict';
	const eCharPosTemplate = document.createElement('span');
	eCharPosTemplate.classList.add('char-pos');

	return function (strLen) {
		const flagment = document.createDocumentFragment();
		for (var i = 0; i <= strLen; i++) { // EOLの分も作成する
			const eCharPos = eCharPosTemplate.cloneNode(true);
			flagment.appendChild(eCharPos);
		}
		return flagment;
	}
})();
Util.createConvertViewElement = (function () {
	'use strict';
	const eViewTemplate = document.createElement('div');
	eViewTemplate.classList.add('convert-view');

	return function () {
		'use strict';
		const eView = eViewTemplate.cloneNode(true);
		return eView;
	}
})();
// file_listの中に入れるファイル行を作成する
Util.createFileElement = (function () {
	'use strict';
	/*
	 * 作成例
	 * <li>
	 * <a class="file"
	 * data-type="file"
	 * href="#"
	 * data-file-id="1"
	 * data-file-name="filename"
	 * >
	 * filename
	 * </a>
	 * </li>
	 */
	const eFileTemplate = document.createElement('li');
	eFileTemplate.classList.add('fileLi');
	const eFileLinkTemplate = document.createElement('a');
	eFileLinkTemplate.classList.add('file');
	eFileLinkTemplate.dataset.type = 'file';
	eFileLinkTemplate.href = '#';

	return function (id,filename) {
		const eFile = eFileTemplate.cloneNode(true);
		const eFileLink = eFileLinkTemplate.cloneNode(true);
		eFileLink.dataset.fileId = id;
		eFileLink.dataset.fileName = filename;
		eFileLink.textContent = filename;
		eFile.appendChild(eFileLink);
		return eFile;
	}
})();
// file_listの中に入れるディレクトリ行を作成する
Util.createDirectoryElement = (function () {
	'use strict';
	/*
	 * 作成例
	 * <li>
	 * 	<a class="directory"
	 * 	data-type="directory"
	 * 	data-toggle="collapse"
	 * 	data-directory-id="1"
	 * 	data-directory-name="filename.directoryname"
	 * 	href="#directory1"
	 * 	>
	 *		<span
	 *		class="glyphicon glyphicon-folder-close"
	 *		aria-hidden="true">
	 *		</span>
	 *		filename.directoryname
	 *		</a>
	 *
	 *		<div class="collapse" id="directory1">
	 *			<div class="well">
	 *				<ul>
	 *					<li>filename</li>
	 *					<li>filename</li>
	 *					<li>filename</li>
	 *				</ul>
	 *			</div>
	 *		</div>
	 *	</li>
	 */
	const eDirectoryTemplete = document.createElement('li');
	eDirectoryTemplete.classList.add('dirLi');
	const eDirLinkTemplete = document.createElement('a');
	eDirLinkTemplete.classList.add('directory');
	eDirLinkTemplete.dataset.type = 'directory';
	eDirLinkTemplete.dataset.toggle = 'collapse';
	eDirLinkTemplete.innerHTML = '<span class="glyphicon glyphicon-folder-close" aria-hidden="true"></span>'; // フォルダアイコン

	const eCollapseTemplate = document.createElement('div');
	const eInnerUlTemplate = document.createElement('ul');
	const eWellTemplate = document.createElement('div');
	eCollapseTemplate.classList.add('collapse');
	eWellTemplate.classList.add('well');

	return function (id,innerData) {
		const eDirectory = eDirectoryTemplete.cloneNode(true);
		const eDirLink = eDirLinkTemplete.cloneNode(true);
		const directoryname = innerData.directoryname;
		eDirLink.dataset.directoryId = id;
		eDirLink.dataset.directoryName = directoryname;
		eDirLink.href = '#directory' + id;
		eDirLink.insertAdjacentHTML('beforeend',directoryname);

		eDirectory.appendChild(eDirLink);

		const eCollapse = eCollapseTemplate.cloneNode(true);
		const eInnerUl = eInnerUlTemplate.cloneNode(true);
		const eWell = eWellTemplate.cloneNode(true);
		eCollapse.id = 'directory' + id;

		// eInnerUl内にファイルリストを加える

		eCollapse.appendChild(eWell);
		eWell.appendChild(eInnerUl);

		eDirectory.appendChild(eCollapse); // コラプスも加える
		return eDirectory;
	}
})();

// Class
(function () {
	'use strict';
	class Menu {
		constructor(sentenceContainer) {
			this._sentenceContainer = sentenceContainer;
			this.addEventListeners();
		}

		// 現在アクティブになっている文字装飾のクラスを配列にする
		charDecolations() {
			const ret = [];
			if (this.boldButton()) {
				ret.push('decolation-font-bold');
			}
			if (this.italicButton()) {
				ret.push('decolation-font-italic');
			}
			if (this.colorButton() !== 'black') {
				ret.push('decolation-color-'+ this.colorButton());
			}
			return ret;
		}

		// --参照取得

		sentenceContainer() {
			return this._sentenceContainer;
		}

		// --判定

		// --Style

		// 文字色ボタンに色を付ける
		// 引数省略で現在の色を取得
		colorButton(color) {
			const eColorButton = document.getElementById('color_btn');
			if(color) {
				const oldColor = eColorButton.className.match(/select-\S+/);
				if (oldColor) eColorButton.classList.remove(oldColor[0]);
				if (color === 'black') return this;
				eColorButton.classList.add('select-'+ color);
				return this;
			}
			if (color === undefined) {
				color = eColorButton.className.match(/select-(\S+)/);
				return color ? color[1] : 'black';
			}
		}
		// 選択範囲の文字色を変える
		addColor(color) {
			const chars = this.sentenceContainer().selectChars();
			for (let char of chars) {
				char.color(color);
			}
			getSelection().removeAllRanges(); // 選択を解除する
			return this;
		}
		// trueで付与、falseで解除
		italic(bl) {
			const chars = this.sentenceContainer().selectChars();
			for (let char of chars) {
				char.italic(bl);
			}
			getSelection().removeAllRanges(); // 選択を解除する
			return this;
		}
		bold(bl) {
			const chars = this.sentenceContainer().selectChars();
			for (let char of chars) {
				char.bold(bl);
			}
			getSelection().removeAllRanges(); // 選択を解除する
			return this;
		}
		fontSize(size) {
			const chars = this.sentenceContainer().selectChars();
			for (let char of chars) {
				char.fontSize(size);
			}
			getSelection().removeAllRanges(); // 選択を解除する
			return this;
		}
		// 'center','left','right'
		align(align) {
			const cursorParagraph = this.sentenceContainer().cursor().getParagraph();
			cursorParagraph.align(align);
		}
		// 引数省略で、現在の太字ボタンのオンオフをbool値で返す
		// trueで太字ボタンをオンにする。falseでオフにする
		boldButton(bl) {
			const eButton = document.getElementById('btn-bold');
			if (bl === undefined) {
				return eButton.classList.contains('active');
			}
			if (bl) {
				eButton.classList.add('active');
			} else {
				eButton.classList.remove('active');
			}
			return this;
		}
		italicButton(bl) {
			const eButton = document.getElementById('btn-italic');
			if (bl === undefined) {
				return eButton.classList.contains('active');
			}
			if (bl) {
				eButton.classList.add('active');
			} else {
				eButton.classList.remove('active');
			}
			return this;
		}

		addEventListeners() {
			// メニューボタン
			document.getElementById('menu_new').addEventListener('click',function (e) { this.sentenceContainer().newFile(); }.bind(this),false);
			document.getElementById('menu_save').addEventListener('click',function (e) { this.sentenceContainer().saveFile(); }.bind(this),false);
			document.getElementById('menu_delete').addEventListener('click',function (e) { this.sentenceContainer().fileList().currentFile().delete(); }.bind(this),false);
			document.getElementById('modal_fileopen_link').addEventListener('click',function (e) {
				const filterInputElem = this.sentenceContainer().fileList().filterInputElem();
				// モーダルが開くのはブートストラップで行われるので、その前処理だけを行う
				filterInputElem.value = '';
				filterInputElem.focus();
				this.sentenceContainer().fileList().resetList();
			}.bind(this),false);

			// モーダル開閉
			$('div.modal').on('shown.bs.modal',function (e) {
				this.sentenceContainer().removeKeydownEventListener();
				if (this.sentenceContainer().inputBuffer().isDisplay()) {
					this.sentenceContainer().inputBuffer().empty().hide();
				}
			}.bind(this));
			$('div.modal').on('hidden.bs.modal',function (e) {
				if (this.sentenceContainer().command().isActive()) { return; }
				this.sentenceContainer().addKeydownEventListener();
			}.bind(this));

			// パレットボタン
			// 文字色ボタン
			document.getElementById('color_btn').addEventListener('click',function (e) {
				this.addColor(this.colorButton());
			}.bind(this),false);
			// 文字色ドロップダウン
			this.addColorSelectClickEvent();

			// bold italic
			document.getElementById('btn-bold').addEventListener('click',function (e) {
				const eBtn = document.getElementById('btn-bold');
				eBtn.classList.toggle('active');
				this.bold(this.boldButton());
			}.bind(this),false);
			document.getElementById('btn-italic').addEventListener('click',function (e) {
				const eBtn = document.getElementById('btn-italic');
				eBtn.classList.toggle('active');
				this.italic(this.italicButton());
			}.bind(this),false);

			// align
			this.addAlignClickEvent();

			// font size
			this.addFontSizeEvnet();
		}

		// 文字色(ドロップダウンの方)をクリックするとボタンの色が変わるイベントを付加する
		addColorSelectClickEvent() {
			const eSelectColors = document.querySelectorAll('#color_dropdown a');
			for (let i = 0,eSelColor; eSelColor = eSelectColors[i]; i++) {
				const color = eSelColor.dataset.color;
				eSelColor.addEventListener('click',function (e) {
					this.colorButton(color);
					this.addColor(color);
				}.bind(this),false);
			}
			return this;
		}
		// 段落のtext-align
		addAlignClickEvent() {
			const eAligns = document.querySelectorAll('#align_btns button');
			for (let i = 0,eAlign; eAlign = eAligns[i]; i++) {
				eAlign.addEventListener('click',function (e) {
					const align = eAlign.id.match(/text-btn-(\S+)/);
					this.align(align[1]);
				}.bind(this),false);
			}
		}

		// font size

		addFontSizeEvnet() {
			const eFontSizeDropdowns = document.querySelectorAll('#fontsize_dropdown a');
			const eInput = document.getElementById('input_text_size');
			for (let i = 0,eFontSize; eFontSize = eFontSizeDropdowns[i]; i++) {
				eFontSize.addEventListener('click',function (e) {
					const size = parseInt(e.target.dataset.size);
					eInput.value = size;
					this.fontSize(size);
				}.bind(this),false);
			}
			return this;
		}
	}
	class CommandLine {
		constructor(sentenceContainer) {
			this._elem = document.getElementById('command');
			this._sentenceContainer = sentenceContainer;
		}

		// --参照取得

		elem() {
			return this._elem;
		}
		sentenceContainer() {
			return this._sentenceContainer;
		}
		fileList() {
			return this.sentenceContainer().fileList();
		}

		// --判定

		isActive() {
			return this.elem().classList.contains('active');
		}

		// --Style

		active() {
			this.elem().classList.add('active');
			return this;
		}
		unActive() {
			this.elem().classList.remove('active');
			return this;
		}
		focus() {
			this.elem().focus();
			return this;
		}
		displayFileModal() {
			this.fileList().$modal().addClass('command-modal').modal();
			$('.modal-backdrop.fade.in').addClass('none_modal-backdrop'); // モーダルウィンドウ表示時の半透明背景を見えなくする
			return this;
		}
		hideFileModal() {
			if (this.fileList().isOpen()) {
				// あらかじめbootstrapより先回りしてstyle適用で非表示にしておかなければ、消える前に一瞬中央表示になってしまう
				this.fileList().$modal()
					.attr('style','display: none;')
					.removeClass('command-modal')
					.modal('hide');
			}
			this.fileList().resetList();

			return this;
		}


		// --DOM

		val(text) {
			if (text === undefined) {
				return this.elem().value;
			} else {
				this.elem().value = text;
				return this;
			}
		}
		start() {
			this.active();
			this.sentenceContainer().removeKeydownEventListener();
			this.focus().val(':');
			this.addKeyupEventListener().addFocusoutEventListener();
			return this;
		}
		stop() {
			this.unActive();
			this.removeKeyupEventListener().removeFocusoutEventListener();
			this.sentenceContainer().addKeydownEventListener();
			this.hideFileModal();
			return this;
		}

		// --イベント

		addKeyupEventListener() {
			if (this._keyupArg) return this;
			this._keyupArg = this.onKeyup.bind(this); // removeするときと引数を同一にするためプロパティに保持する(それぞれでbindすると異なる参照になる？)
			document.addEventListener('keyup',this._keyupArg);
			return this;
		}
		removeKeyupEventListener() {
			if (!this._keyupArg) return this;
			document.removeEventListener('keyup',this._keyupArg);
			this._keyupArg = null;
			return this;
		}
		onKeyup(e) {
			'use strict';
			let keycode;
			if (document.all) {
				// IE
				keycode = e.keyCode
			} else {
				// IE以外
				keycode = e.which;
			}
			if (keycode === 123) { return; } // F12のみブラウザショートカットキー
			this.runKeyup(e,keycode);
			// デフォルトの動作を無効化する
			e.preventDefault();
		}
		runKeyup(e,keycode) {
			if (keycode == 13) {
				// enter
				this.runCommand();
				this.stop();
				e.stopPropagation(); // 親要素へのイベントの伝播(バブリング)を止める。そうしなければ先にaddeventlistenerをしてしまっているので、documentにまでエンターキーが渡ってしまい改行されてしまう。
			} else if (keycode == 27 || this.val() == '') {
				// Esc
				//command あるいは全文字削除
				this.stop();
				e.stopPropagation();
			} else {
				// :eなどの後に途中まで引数を打てばファイルの検索ダイアログが出るようにする
				let command = this.val().split(' ');
				if (command.length < 2) command = this.val().split('　'); // 全角スペースも区切りとして有効。ただし、半角スペースとの混在は現状不可
				switch (command[0]) {
					case ':e':
					case ':o':
					case ':open':
					case ':mv':
					case ':delete':
					case ':del':
					case ':d':
					case ':え':
					case ':お':
					case ':おぺｎ':
					case ':ｍｖ':
					case ':でぇて':
					case ':でｌ':
					case ':ｄ':
							 if (keycode !== 8 && command[1] && !($('body').hasClass('modal-open'))) {
								 // モーダルウィンドウを表示する
								 this.displayFileModal();
								 this.fileList().filter(command[1]);
							 } else if (keycode === 8 && !(command[1])) {
								 // BSを押した結果、引数がなくなった
								 this.hideFileModal();
							 } else if (command[1] && command[2]) {
								 // 引数ふたつ目
								 this.fileList().filter(command[2]);
							 } else if (command[1]) {
								 // 引数ひとつ
								 this.fileList().filter(command[1]);
							 }
							 break;
					default:
							 break;
				}
			}
			e.preventDefault();
		}
		addFocusoutEventListener() {
			if (this._focusoutArg) return this;
			this._focusoutArg = this.onFocusout.bind(this); // removeするときと引数を同一にするためプロパティに保持する(それぞれでbindすると異なる参照になる？)
			document.addEventListener('focusout',this._focusoutArg);
			return this;
		}
		removeFocusoutEventListener() {
			if (!this._focusoutArg) return this;
			document.removeEventListener('focusout',this._focusoutArg);
			this._focusoutArg = null;
			return this;
		}
		onFocusout(e) {
			this.stop();
		}
		runCommand() {
			let command = this.val().split(' ');
			// 半角スペースで区切られていないようなら、全角スペースの区切りでも可
			if (command.length === 1) command = this.val().split('　');
			switch (command[0]) {
				case ':w':
				case ':save':
				case ':s':
				case ': ｗ':
				case ':さヴぇ':
				case ':ｓ':
						 if (command[1]) {
							 this.saveAsFile(command[1]);
						 } else {
							 this.sentenceContainer().saveFile();
						 }
						 break;
				case ':e':
				case ':o':
				case ':open':
				case ':え':
				case ':お':
				case ':おぺｎ':
						 if (command[1]) {
							 const files = this.fileList().findFile(commnad[1]);
							 files.length > 0 && files[0].open();
						 } else {
							 this.sentenceContainer().newFile();
						 }
						 break;
				case ':jumpr':
				case ':jumprow':
				case ':jr':
				case ':じゅｍｐｒ':
				case ':じゅｍｐろｗ':
				case ':ｊｒ':
						 if (command[1]) this.sentenceContainer().cursor().jumpRow(parseInt(command[1]));
						 break;
				case ':jumpp':
				case ':jumppage':
				case ':jp':
				case ':じゅｍっｐ':
				case ':じゅｍっぱげ':
				case ':ｊｐ':
						 if (command[1]) this.sentenceContainer().cursor().jumpPage(parseInt(command[1]));
						 break;
				case ':new':
				case ':n':
				case ':ねｗ':
				case ':ｎ':
						 this.sentenceContainer().newFile(command[1]);
						 break;
				case ':delete':
				case ':del':
				case ':d':
				case ':rm':
				case ':でぇて':
				case ':でｌ':
				case ':ｄ':
				case ':ｒｍ':
						 if (command[1]) {
							 this.fileList().deleteFile(command[1]);
						 } else {
							 const currentFile = this.fileList().currentFile();
							 currentFile && currentFile.delete();
						 }
						 break;
				case ':next':
				case ':ねｘｔ':
						 // 次のファイルを開く
						 this.fileList().openNextFile();
						 break;
				case ':prev':
				case ':ｐれｖ':
						 // 前のファイルを開く
						 this.fileList().openPrevFile();
						 break;
				case ':title':
				case ':name':
				case ':t':
				case ':ちｔぇ':
				case ':なめ':
				case ':ｔ':
						 if (command[1]) {
							 this.sentenceContainer().filename(command[1]);
						 }
						 break;
				case ':mv':
				case ':ｍｖ':
						 this.fileList().moveFile(command[1],command[2]);
						 break;
				case ':mkdir':
				case ':ｍｋぢｒ':
							 this.fileList().mkdir(command[1]);
						 break;
				case ':deldir':
				case ':でｌぢｒ':
						 this.fileList().deleteDirectory(command[1],false);
						 break;
				case ':noh':
				case ':のｈ':
						 this.sentenceContainer().stopSearchMode();
						 break;
				case '::':
						 this.sentenceContainer().cursor().insert(':');
						 break;
				case ':;':
						 this.sentenceContainer().cursor().insert(';');
						 break;
				case ':/':
						  this.sentenceContainer().cursor().insert('/');
						  break;
				case ':i':
						 command[1] && this.sentenceContainer().cursor().insert(command[1]);
						 break;
				case ':bold':
						 this.sentenceContainer().menu().boldButton(!this.sentenceContainer().menu().boldButton());
						 break;
				case ':italic':
						 this.sentenceContainer().menu().italicButton(!this.sentenceContainer().menu().italicButton());
						 break;
				default:
						 break;
			}
		}
	}
	// 段落最後のEOL以外のEOLにカーソルは止まらない(EOLは基本、文字挿入のために存在)
	class Cursor {
		constructor(sentenceContainer) {
			this._sentenceContainer = sentenceContainer;
			this._cursorLineElem = document.getElementById('cursor_line');
		}
		init() {
			const firstChar = this.sentenceContainer().firstChild().firstChild().firstChild();
			this._char = firstChar;
			this.createCursorLine();
			this._char.addCursor().setPosMemory();
			return this;
		}

		// --参照取得

		sentenceContainer() {
			return this._sentenceContainer;
		}
		getChar() {
			return this._char;
		}
		getRow() {
			return this.getChar().row();
		}
		getParagraph() {
			return this.getRow().paragraph();
		}
		cursorLineElem() {
			return this._cursorLineElem;
		}

		// --参照操作

		setChar(newChar) {
			this._char = newChar;
			return this;
		}
		addCursor(char,isShift) {
			if (this.getChar()) {
				this.memorySelection();
				this.getChar().removeClass('cursor');
			}
			char.addClass('cursor');
			this.setChar(char);

			// 前の文字に装飾があれば、そのボタンをオンにする
			const prevChar = char.prevCharOnParagraph();
			const menu = this.sentenceContainer().menu();
			menu.colorButton(prevChar ? prevChar.color() : 'black');
			menu.boldButton(prevChar ? prevChar.isBold() : false);
			menu.italicButton(prevChar ? prevChar.isItalic() : false);

			// シフトキーが押されながらなら、選択範囲を広げる
			this.extendSelection(isShift);
			this.sentenceContainer().printInfo();
			return this;
		}

		// --Status

		getPosMemory() {
			const eCharPoses = this.cursorLineElem().children;
			for (let i = 0,eCharPos; eCharPos = eCharPoses[i]; i++) {
				if (eCharPos.classList.contains('cursor-pos-memory'))
					return i;
			}
			return -1;
		}
		setPosMemory(index) {
			const oldPos = this.getPosMemory();
			if (index === oldPos) {
				return this;
			}
			const eCharPoses = this.cursorLineElem().children;
			if (eCharPoses[oldPos]) eCharPoses[oldPos].classList.remove('cursor-pos-memory');
			const maxIndex = eCharPoses.length - 1;
			if (index > maxIndex) index = maxIndex;
			eCharPoses[index].classList.add('cursor-pos-memory');
			return this;
		}
		// 現在行のうち何文字目にいるか
		// 行頭カーソルなら０、EOLカーソルならその直前の文字が何文字目か
		currentCharPos() {
			return this.getChar().index(); // 行頭は０なので、+1はしなくてもいい
		}
		// 現在行の総文字数
		strLenOfRow() {
			return this.getRow().charLen();
		}
		// 現在ページで何行目にいるか
		// isPageBreak()は異常がなければ必ず見つかるため、rowにnullが入ってisPageBreak()がnullpointerになったり、cntにずれが生じる状況は考えなくてもいい
		currentRowPos() {
			for (let row = this.getRow(),cnt = 1; row; row = row.prev(),cnt++) {
				if (row.isPageBreak()) return cnt;
			}
			return -1;
		}
		// 現在ページの行数(最終ページのみ設定行数と異なるため計算)
		// isPageLast()は異常がなければ必ず見つかるため、rowにnullが入ってisPageLast()がnullpointerになったり、cntにずれが生じる状況は考えなくてもいい
		rowLenOnPage() {
			for (let row = this.getRow(),cnt = this.currentRowPos(); row; row = row.next(),cnt++) {
				if (row.isPageLast()) return cnt;
			}
			return -1;
		}
		// 現在ページ
		currentPage() {
			let cnt = 0;
			for (let row = this.getRow(); row; row = row.prev()) {
				if (row.isPageBreak()) cnt++;
			}
			return cnt;
		}

		// --DOM操作

		// cursor-pos-memoryは、カーソルの左右移動の際にカーソルが何文字目の位置から移動してきたのかを記憶する要素
		createCursorLine() {
			const eCursorLine = document.getElementById('cursor_line');
			const eOldCharPoses = eCursorLine.children;
			for (let i = 0,eOldCharPos; eOldCharPos = eOldCharPoses[0]; i++) {
				eCursorLine.removeChild(eOldCharPos);
			}
			eCursorLine.appendChild(Util.createCharPosElement(this.sentenceContainer().strLenOnRow()));
			return this;
		}

		// カーソル位置に文字を挿入する
		insert(str) {
			const cursorChar = this.getChar();
			for (let char of str) {
				const newChar = new Char(cursorChar.createData(char));
				cursorChar.before(newChar);
			}

			cursorChar.paragraph().cordinate().checkKinsoku();
			this.getChar().setPosMemory(); // cordinate()によってカーソル文字が変わっている可能性があるため、cursorCharは使えず取得しなおし
			this.sentenceContainer().changeDisplay(true).breakPage().printInfo();
			return this;
		}
		// カーソル位置でバックスペース
		backSpace() {
			const cursorChar = this.getChar();
			if (!cursorChar.prev()) return this; // 文章先頭からのバックスペースは何もしない

			// 段落先頭からのバックスペースでは、前の行に段落をつなげる
			if (cursorChar.isFirst() && cursorChar.row().isFirst()) {
				const cursorParagraph = cursorChar.row().paragraph();
				const newParagraph = cursorParagraph.prev(); // 融合先の段落
				for (let moveRow of cursorParagraph.rows()) {
					moveRow.moveLastBefore();
				}
				newParagraph.cordinate().checkKinsoku();
				this.sentenceContainer().changeDisplay(true).breakPage().printInfo();
				return this;
			}

			//  段落先頭以外からのバックスペース
			//  カーソルの前の位置にある文字を削除する(行頭なら行をまたいで前の文字)
			if (!(cursorChar.isFirst() && cursorChar.row().isFirst())) {
				cursorChar.prevChar().delete();
				this.sentenceContainer().changeDisplay(true).breakPage().printInfo();
				return this;
			}
		}

		// カーソル位置で改行する
		lineBreak() {
			// 段落の分割
			const cursorParagraph = this.getParagraph().divide(this.getChar());
			// 新しくできた段落の最初の文字にカーソルを移動する
			const newParagraph = cursorParagraph.next(); // divide()で新しく挿入された段落
			newParagraph.firstChild().firstChild().addCursor().setPosMemory();
			this.sentenceContainer().changeDisplay(true).breakPage().printInfo();
			return this;
		}

		// --カーソル操作

		// カーソル移動
		moveNext(isShift) {
			const nextChar = this.getChar().next();
			if (!nextChar) return this;
			nextChar.slideNextCursor().addCursor(isShift).setPosMemory();
			this.sentenceContainer().changeDisplay();
			return this;
		}
		movePrev(isShift) {
			const prevChar = this.getChar().prev();
			if (!prevChar) return this;
			prevChar.slidePrevCursor().addCursor(isShift).setPosMemory();
			this.sentenceContainer().changeDisplay();
			return this;
		}
		moveRight(isShift) {
			const prevRow = this.getChar().row().prev();
			this.moveRow(prevRow,isShift);
			this.sentenceContainer().changeDisplay();
			return this;
		}
		moveLeft(isShift) {
			const nextRow = this.getChar().row().next();
			this.moveRow(nextRow,isShift);
			this.sentenceContainer().changeDisplay();
			return this;
		}
		// 引数で指定された行にカーソルを移動する
		moveRow(row,isShift) {
			const index = this.getPosMemory();
			if (!row) return this;
			const char = row.children(index); // 同じインデックスの文字がprevRowに存在しなければ、children()内でlastChild()が選択される
			char.slidePrevCursor().addCursor(isShift);
			return this;
		}
		jumpRow(num) {
			if (typeof num !== 'number') return this;
			const row = this.sentenceContainer().row(num);
			if (row) {
				row.firstChild().addCursor().setPosMemory();
				this.sentenceContainer().changeDisplay(false,'center');
			}
			return this;
		}
		jumpPage(num) {
			if (typeof num !== 'number') return this;
			const row = this.sentenceContainer().pageRow(num);
			if (row) {
				row.firstChild().addCursor().setPosMemory();
				this.sentenceContainer().changeDisplay(false,'right');
			}
			return this;
		}
		// 次の検索語句にカーソルを移動する
		nextSearch() {
			const next = this.nextSearchChar();
			if (!next) { return this; }
			next.addCursor().setPosMemory();
			this.sentenceContainer().changeDisplay();
			return this;
		}
		nextSearchChar() {
			for (let char = this.getChar().nextChar() || this.sentenceContainer().firstChar(); !char.is(this.getChar()); (char = char.nextChar()) || (char = this.sentenceContainer().firstChar())) {
				if (char.hasClass('search-label')) return char;
			}
			return null;
		}
		prevSearch() {
			const prev = this.prevSearchChar();
			if (!prev) { return this; }
			prev.addCursor().setPosMemory();
			this.sentenceContainer().changeDisplay();
			return this;
		}
		prevSearchChar() {
			for (let char = this.getChar().prevChar() || this.sentenceContainer().lastChar(); !char.is(this.getChar()); (char = char.prevChar()) || (char = this.sentenceContainer().lastChar())) {
				if (char.hasClass('search-label')) return char;
			}
			return null;
		}
		// カーソル移動前に、selectionにカーソル位置を覚えさせる
		memorySelection() {
			const selection = getSelection();
			if (selection.rangeCount === 0) {
				selection.selectAllChildren(this.getChar().elem());
			}
			return this;
		}
		// 選択範囲を動かす(カーソル移動時)
		extendSelection(bShift) {
			const selection = getSelection();
			if (bShift) {
				// シフトキーが押されていれば、カーソルのオフセット０までselectionを拡張
				selection.extend(this.getChar().elem(),0);
			} else {
				// シフトキー無しでカーソルが動いたならselectionを解除する
				selection.removeAllRanges();
			}
		}
	}

	// 文書を構成する各クラスの基底クラス
	class Sentence {
		constructor(elem) {
			this._elem = elem;
			this._parent = null;
			this._next = null;
			this._prev = null;
			this._children = [];
			this._width = null;
			this._height = null;
		}

		// --参照取得

		elem() {
			return this._elem;
		}
		parent(newParent) {
			if (newParent === undefined) { // nullが渡されることもあるのでundefinedと厳密に比較
				return this._parent;
			} else {
				this._parent = newParent;;
				return this;
			}
		}
		next(newNext) {
			if (newNext === undefined) {
				return this._next;
			} else {
				this._next = newNext;
				return this;
			}
		}
		prev(newPrev) {
			if (newPrev === undefined) {
				return this._prev;
			} else {
				this._prev = newPrev;
				return this;
			}
		}
		children(index) {
			if (index === undefined) {
				return Util.copyArray(this._children);
			} else {
				return this._children[index];
			}
		}
		firstChild() {
			if (this.hasChild()) {
				return this._children[0];
			} else {
				return null;
			}
		}
		lastChild() {
			if (this.hasChild()) {
				return this._children[this.childLength()-1];
			} else {
				return null;
			}
		}

		// --判定

		// 引数が自分と同じオブジェクトならtrueを返す
		is(obj) {
			return obj === this;
		}
		hasClass(className) {
			return this._elem.classList.contains(className);
		}
		hasChild() {
			return this._children.length > 0;
		}
		isOnlyChild() {
			return this.parent().childLength() === 1
				&& this.parent().children(0) === this;
		}
		isEmpty() {
			return this._children.length === 0;
		}
		hasNextSibling() {
			if (this.next()) {
				return this.next().parent() === this.parent();
			} else {
				return false;
			}
		}
		hasPrevSibling() {
			if (this.prev()) {
				return this.prev().parent() === this.parent();
			} else {
				return false;
			}
		}
		// １文字目、一行目などその親の中で最初の子であればtrue
		isFirst() {
			return !this.hasPrevSibling();
		}
		// 最終文字、最終行などその親の中で最後の子であればtrue
		// Charの場合は、hasNextSibling()はEOLの前の文字とEOL自身でfalseを返すため、isLast()でもEOLの前の文字とEOLの２つでtrueを返す
		isLast() {
			return !this.hasNextSibling();
		}

		// --参照操作

		pushChild(child) {
			this._children.push(child);
			return this;
		}
		insertChild(pos,child) {
			// 配列の範囲外の数値を渡されたらpushに切り替える
			if (pos < 0 || pos >= this._children.length) {
				return this.pushChild(child);
			}
			this._children.splice(pos,0,child);
			return this;
		}
		deleteChild(child) {
			const pos = child.index();
			this._children.splice(pos,1);
			child.parent(null);
			return this;
		}
		replaceChild(oldChild,newChild) {
			const pos = oldChild.index();
			this._children.splice(pos,1,newChild);
			return this;
		}
		emptyChild() {
			this._children = [];
			return this;
		}

		// --Status

		text() {
			return this.elem().textContent;
		}
		// 文字数
		length() {
			return this.text().length;
		}
		// 同一の親を持つ兄弟の中での０始まりのインデックス
		index() {
			const siblings = this.parent().children();
			const index = siblings.indexOf(this);
			return index;
		}
		// Rowではchildren()の意味が違うので、混同しないようchildren()をさけて直接プロパティにアクセスする
		childLength() {
			return this._children.length;
		}

		// --Style

		className(className) {
			return this._elem.className || ''; // クラスがひとつもなければ空文字
		}
		addClass(className) {
			this._elem.classList.add(className);
			return this;
		}
		removeClass(className) {
			this._elem.classList.remove(className);
			return this;
		}
		removeClassAll(className) {
			for (let child of this._children) {
				child.removeClass(className);
			}
			return this;
		}
		// elementが不可視状態にあれば長さが０になったり、ブラウザごとに取得手段に違いがあったり直接指定されているstyleとcssでの指定の違い、cssでの指定が'auto'になっていると文字列が返ってきたりと
		// javascriptでのcss値の取得は複雑で困難であることから、jQueryの使用が適していると判断した(不可視の要素は一時的に可視状態にしてから取得するので、レンダリングが発生する可能性は高い)
		// 読み込み時には時間がかかるが、キャッシュすることで行移動などでは最低限の計算になると期待
		// useCache: キャッシュを使わず計算し直す場合にfalseを渡す
		height(useCache) {
			if (useCache == undefined) useCache = true;
			if (useCache && this._height) {
				return this._height;
			}
			return this._height = parseInt($(this.elem()).css('height'));
		}
		width(useCache) {
			if (useCache == undefined) useCache = true;
			if (useCache && this._width) {
				return this._width;
			}
			return this._width = parseInt($(this.elem()).css('width'));
		}
		// 要素左上のX座標
		x() {
			return this.elem().getBoundingClientRect().left + window.pageXOffset;
		}
		// 要素左上のY座標
		y() {
			return this.elem().getBoundingClientRect().top + window.pageYOffset;
		}
		// ある点からオブジェクトの中心点までの距離を計算する
		computeDistanceFromPoint(x,y) {
			const ownPos = this.computeCenterPoint();
			return Util.computeDistanceP2P(x,y,ownPos.x,ownPos.y);
		}
		computeCenterPoint() {
			return {
				x: this.x() + this.width()/2,
				y: this.y() + this.height()/2
			}
		}

		// --DOM操作関係

		emptyElem() {
			const children = this.elem().children;
			let child;
			while (child = children[0]) {
				this.elem().removeChild(child);
			}
			return this;
		}
		empty() {
			this.emptyElem();
			this.emptyChild();
			return this;
		}

		// --イベント

		addKeydownEventListener() {
			if (this._keydownArg) return this;
			this._keydownArg = this.onKeydown.bind(this); // removeするときと引数を同一にするためプロパティに保持する(それぞれでbindすると異なる参照になる？)
			document.addEventListener('keydown',this._keydownArg);
			return this;
		}
		removeKeydownEventListener() {
			if (!this._keydownArg) return this;
			document.removeEventListener('keydown',this._keydownArg);
			this._keydownArg = null;
			return this;
		}
		onKeydown(e) {
			'use strict';
			let keycode;
			if (document.all) {
				// IE
				keycode = e.keyCode
			} else {
				// IE以外
				keycode = e.which;
			}
			if (keycode === 123) { return; } // F12のみブラウザショートカットキー
			this.runKeydown(e,keycode);
			// デフォルトの動作を無効化する
			e.preventDefault();
		}
		runKeydown(e,keycode) {
		}
		addClickEventListener() {
			if (this._clickArg) return this;
			this._clickArg = this.onClick.bind(this); // removeするときと引数を同一にするためプロパティに保持する(それぞれでbindすると異なる参照になる？)
			this.elem().addEventListener('click',this._clickArg);
			return this;
		}
		removeClickEventListener() {
			if (!this._clickArg) return this;
			this.elem().removeEventListener('click',this._clickArg);
			this._clickArg = null;
			return this;
		}
		onClick(e) {
			this.runClick(e);
		}
		runClick(e) {
		}
		addWheelEventListener() {
			if (this._wheelArg) return this;
			this._wheelArg = this.onWheel.bind(this); // removeするときと引数を同一にするためプロパティに保持する(それぞれでbindすると異なる参照になる？)
			const selector = '#' + this.elem().id;
			$('body').on('mousewheel',selector,this._wheelArg)
			return this;
		}
		removeWheelEventListener() {
			if (!this._wheelArg) return this;
			const selector = '#' + this.elem().id;
			$('body').off('mousewheel',selector,this._wheelArg);
			this._wheelArg = null;
			return this;
		}
		onWheel(e,delta,deltaX,deltaY) {
			this.runWheel(e,delta > 0);
		}
		runWheel(e,isUp) {
		}
	}

	class Char extends Sentence {
		/*
		 *		文字を表すオブジェクト
		 *		{
		 *			"char":"あ",
		 *			"decolation":["decolation-color-blue"]
		 *			"fontSize": "auto"
		 *		}
		 */
		constructor(data) {
			super(data.char ? Util.createCharElement(data) : data); // dataオブジェクトにcharプロパティがなければEOLからの呼び出しで、dataにはエレメントが入っている
			this._isEOL = false;
			data.fontSize && (this._fontSize = data.fontSize);
		}

		// --参照取得

		row(newRow) {
			return this.parent(newRow);
		}
		paragraph() {
			return this.row().paragraph();
		}
		sentenceContainer() {
			return this.paragraph().container();
		}
		cursor() {
			return this.row().paragraph().container().cursor();
		}
		// Cursor用
		// カーソル文字として不適ならその次の文字を返す
		slideNextCursor() {
			// 段落最後のEOL以外のEOLには止まらない
			// 段落途中のEOLならその次の文字に変更する
			if (this.isEOL() && this.row().hasNextSibling()) {
				return this.next();
			} else {
				return this;
			}
		}
		// カーソル文字として不適ならその前の文字を返す
		slidePrevCursor() {
			// 段落最後のEOL以外のEOLには止まらない
			// 段落途中のEOLならその前の文字に変更する
			if (this.isEOL() && this.row().hasNextSibling()) {
				return this.prev();
			} else {
				return this;
			}
		}
		// EOLを含まない(段落最後であるなど関係なく、EOLは完全排除)
		nextChar() {
			if (this.next() && this.next().isEOL()) {
				return this.next().nextChar();
			} else {
				return this.next();
			}
		}
		prevChar() {
			if (this.prev() && this.prev().isEOL()) {
				return this.prev().prevChar();
			} else {
				return this.prev();
			}
		}
		// 同一段落内で次の文字
		nextCharOnParagraph() {
			if (this.hasNextCharOnParagraph()) {
				return this.nextChar();
			}
			return null;
		}
		prevCharOnParagraph() {
			if (this.hasPrevCharOnParagraph()) {
				return this.prevChar();
			}
			return null;
		}

		// --判定

		isEOL() {
			return this._isEOL;
		}
		hasCursor() {
			return this.hasClass('cursor');
		}
		isDisplay() {
			return this.hasClass('display');
		}
		// 同一行内で最終文字でなければtrue、最終文字ならfalse。EOLは含まない(次の文字がEOLならfalse,自身がEOLの場合もfalse)
		hasNextSibling() {
			return !(this._isEOL || this.next().isEOL());
		}
		// 同一段落内で次のCharがあるか
		hasNextCharOnParagraph() {
			return this.nextChar() && this.nextChar().paragraph() === this.paragraph();
		}
		hasPrevCharOnParagraph() {
			return this.prevChar() && this.prevChar().paragraph() === this.paragraph();
		}
		// この要素がrangeの中にあればtrue
		isInRange(range) {
			const charRange = document.createRange();
			// 現在の要素を囲む範囲をcharRangeとして設定。selectNodeContentsをselectNodeにする、あるいは引数をテキストノードではなくspan要素にすると、選択中最初と最終文字が反応しないことがある
			charRange.selectNodeContents(this.elem().childNodes.item(0));
			// 開始位置が同じかselectの開始位置より文字の開始位置が後ろにあり、
			// 終了位置が同じかselectの終了位置より文字の終了位置が前にある
			if (charRange.compareBoundaryPoints(Range.START_TO_START,range) >= 0
					&& charRange.compareBoundaryPoints(Range.END_TO_END,range) <= 0) {
				charRange.detach();
				return true;
			}
			charRange.detach();
			return false;
		}
		isBold() {
			return this.hasClass('decolation-font-bold');
		}
		isItalic() {
			return this.hasClass('decolation-font-italic');
		}

		// --Status

		data() {
			const data = {};
			data['char'] = this.text();
			data['decolation'] = this.classArray();
			data['fontSize'] = this.fontSize() + '';
			return data;
		}
		classArray() {
			return this.className().match(/decolation-\S+/g) || [];
		}

		// --Style

		addCursor(isShift) {
			this.cursor().addCursor(this,isShift);
			return this;
		}

		fontSize(fontSize) {
			if (fontSize) {
				this._fontSize = fontSize;
				this._elem.dataset.fontSize = fontSize;
				// フォントサイズが変更されると行の幅が変わる可能性があるため、計算し直しておく
				this.row().width(false);
				return this;
			} else {
				if (this._fontSize) {
					if (this._fontSize === 'auto') {
						return this._fontSize;
					} else {
						return parseInt(this._fontSize);
					}
				} else {
					return 'auto';
				}
			}
		}
		color(color) {
			if (color) {
				this.addColor(color);
				return this;
			}
			if (color === false) {
				this.removeColor();
				return this;
			}
			if (color === undefined) {
				const color = this.className().match(/decolation-color-(.+)/);
				return color ? color[1] : 'black';
			}
		}
		// trueなら太字にして、falseなら外す
		bold(bl) {
			if (bl) {
				this.addClass('decolation-font-bold');
			} else {
				this.removeClass('decolation-font-bold');
			}
			return this;
		}
		italic(bl) {
			if (bl) {
				this.addClass('decolation-font-italic');
			} else {
				this.removeClass('decolation-font-italic');
			}
			return this;
		}
		addColor(color) {
			// 同一種のクラスをすでに持っていたら外す
			this.removeColor();
			if (color === 'decolation-color-black') return; // ブラックなら外して終わり
			this.addClass('decolation-color-'+ color);
			return this;
		}
		removeColor() {
			const regexp = new RegExp('decolation-color-\\S+');
			const rmClass = this.className().match(regexp);
			if (rmClass) { this.removeClass(rmClass[0]); }
			return this;
		}
		// この文字から始まる文字列がstrと合致するなら、その文字列のCharにクラスを付与する
		// １文字ずつ比較し、渡された文字列の長さ分のループを終えるまでに異なる文字が現れるか段落に残りの文字がなくなればreturn
		// 最初のループを無事に終えればこの文字から始まる文字列はstrに合致しているということなので、それぞれクラスを付与する
		markSearchPhrase(str) {
			// 合致しているかの判定
			// 合致しない文字が現れたか、文字列を比較し終える前に段落の最後に達したらreturn
			for (let i = 0,len = str.length,char = this; i < len; i++,char = char.nextCharOnParagraph()) {
				if (!char || str.charAt(i) !== char.text()) return this;
			}

			// クラスの付与
			this.addClass('search-label');
			for (let i = 0,len = str.length,char = this; i < len; char = char.nextChar(),i++) {
				char.addClass('search-word');
			}
			return this;
		}

		// --DOM操作関係

		before(char) {
			// DOM
			// this.elem().before(char.elem()); // before(),after()はまだサポートされず
			this.row().elem().insertBefore(char.elem(),this.elem());

			// ポインタ調整
			// oldPrev - char - this

			// char
			const oldPrev = this.prev();
			oldPrev && this.prev().next(char);
			char.prev(oldPrev);
			char.next(this);
			this.prev(char);
			// parent
			char.row(this.row());
			const pos = this.index();
			this.row().insertChar(pos,char);
			return this;
		}
		after(char) {
			if (this.isEOL()) { return this; } // todo: 例外を使用したほうがいいかも EOLからのafterはできない
			// DOM
			if (this.hasNextSibling()) {
				this.row().elem().insertBefore(char.elem(),this.next().elem());
			} else {
				this.row().elem().appendChild(char.elem());
			}

			// ポインタ調整
			// this - char - oldNextChar

			// char
			const oldNextChar = this.next();
			this.next(char);
			char.prev(this);
			char.next(oldNextChar);
			oldNextChar && oldNextChar.prev(char);
			// parent
			char.row(this.row());
			const pos = this.index() + 1;
			this.row().insertChar(pos,char);
			return this;
		}
		// 要素と参照の削除
		remove() {
			if (this.isEOL()) return this; // EOLは削除不可
			const row = this.row();
			row.elem().removeChild(this.elem());
			// oldPrev - this - oldNext →　oldPrev - oldNext
			const oldPrev = this.prev();
			const oldNext = this.next();
			if (oldPrev) oldPrev.next(oldNext);
			if (oldNext) oldNext.prev(oldPrev);
			// 古い親の配列から削除
			row.deleteChar(this);
			return this;
		}
		// 文書整形も含む削除
		delete() {
			const row = this.row();
			const paragraph = row.paragraph();
			this.remove();

			// 段落先頭以外の行で、文字を削除した結果行が空になった場合、その行を削除する
			if (!row.isFirst() && row.isEmpty()) {
				row.lastChild().hasCursor() && row.prev().EOL().addCursor().setPosMemory(); // 削除行にカーソルがあれば、その前の行のEOLにカーソルを移動する
				row.remove();
			}

			paragraph.cordinate().checkKinsoku();
			return this;
		}
		// 自分自身をnewCharと入れ替える
		replace(newChar) {
			newChar.prev(this.prev());
			newChar.next(this.next());
			if (this.prev()) { this.prev().next(newChar); }
			if (this.next()) { this.next().prev(newChar); }
			this.prev(null);
			this.next(null);
			this.row().replaceChild(this,newChar);
			this.row(null);
			return this;
		}
		// 前の行の最後に移動する
		moveLastBefore() {
			if (this.isEOL() || !this.isFirst()) { return this; } // 各行最初の文字でのみ有効
			if (this.row().isFirst()) return this; // 段落はまたがない

			const oldRow = this.row();
			this.remove(); // delete()内でcordinate()を使い、cordinate()内でmoveLastBefore()を使っているので、ここでdelete()を使うと無限再帰の恐れあり
			oldRow.prev().append(this);

			// 移動した結果、空行ができたら削除する
			if (oldRow.isEmpty()){
				oldRow.hasCursor() && this.next().addCursor(); // 削除行にカーソルが含まれていれば移動する
				oldRow.remove();
			}
			this.setPosMemory();
			return this;
		}
		// 次の行の最初に移動する
		moveFirstAfter() {
			if (this.isEOL() || !this.isLast()) return this; // 各行最後の文字でのみ有効
			if (this.row().isLast()) return this; // 段落はまたがない

			const oldRow = this.row();
			// 次の行がなければ新しく作る
			if (oldRow.isLast()) {
				oldRow.after(Row.createEmptyRow());
				oldRow.container().changeDisplay();
			}

			this.remove();
			oldRow.next().prepend(this);

			this.setPosMemory(); // カーソルが付与されている文字は変わらないが、その文字の位置が変わる可能性があるためposMemoryを付け替える
			return this;
		}
		// 自分を含めて、自分以降で同じ段落内のChar全てに処理を行う(EOLは含まない)
		afterEach(func) {
			func(this);
			for (let char = this; char.hasNextSibling(); ) {
				char = char.next();
				func(this);
			}
			return this;
		}

		// --Display関係
		// trueなら表示、falseなら非表示
		display(bDisplay) {
			if (bDisplay) {
				this._elem.classList.add('display');
			} else {
				this._elem.classList.remove('display');
			}
			return this;
		}

		// Utility

		createData(c) {
			const ret = {};
			ret["char"] = c;
			const menu = this.paragraph().container().menu();
			ret["decolation"] = menu.charDecolations();
			ret["fontSize"] = Char.currentFontSize();
			return ret;
		}
		static currentFontSize() {
			const ret = 'auto';
			return ret;
		}
		static createPlainCharData(c) {
			const ret = {};
			ret['char'] = c;
			ret['decolation'] = [];
			ret['fontSize'] = 'auto';
			return ret;
		}

		// -- other

		setPosMemory() {
			const index = this.index();
			this.cursor().setPosMemory(index);
			return this;
		}

		afterEach(func) {
			const index = this.index();
			let cnt = 0;
			for (let char of this.row().chars()) {
				if (cnt >= index) func(char);
				cnt++;
			}
			return this;
		}
	}

	class EOL extends Char {
		// Rowとともに要素を作ってしまうため、要素を引数に取る必要がある。CharとEOLはis-a関係が成り立つと考え、継承を選択
		constructor(elem) {
			super(elem); // 最初にスーパークラスのコンストラクタを呼ばなければエラー
			this._isEOL = true;
		}

		// -- Status

		index() {
			return this.row().childLength();
		}

		// --DOM操作

		// EOLは各行一文字目であるのとDom要素が先に作られるためRowのappend()が利用できない
		appended(row) {
			// EOLがappendedされるのはまだrowが文書内に組み込まれる前なので、nextとprevの操作は不要
			row.elem().appendChild(this.elem());
			this.row(row);
			return this;
		}
	}

	class Row extends Sentence {
		constructor(data) {
			// 配列が渡されたら新しく要素を作り、そうでなければ要素が渡されたとしてそれを元にインスタンスを作る
			if (Array.isArray(data)) {
				super(Util.createRowElement(data));
			} else {
				// InputBufferの場合
				super(data);
				data = [];
			}
			this._EOL = new EOL(this._elem.lastElementChild);
			this._EOL.appended(this);
			if (!Array.isArray(data)) return;
			for (let charData of data) {
				const char = new Char(charData);
				this.append(char);
			}

			this.addClickEventListener();
		}

		// --参照取得

		EOL() {
			return this._EOL;
		}
		container() {
			return this.paragraph().container();
		}
		paragraph(newParagraph) {
			return this.parent(newParagraph);
		}
		cursorChar() {
			return this.paragraph().container().cursor().getChar();
		}
		// 空行ではEOLが選択されるため、firstChar()ではなくfirstChild()
		// RowではEOLが絡むためオーバーライドする
		firstChild() {
			if (this.hasChar()) {
				return this.chars()[0];
			} else {
				return this.EOL();
			}
		}
		lastChild() {
			return this.EOL();
		}
		lastChar() {
			return super.lastChild();
		}
		chars(index) { // EOLは含まれない
			return super.children(index);
		}
		// 範囲外のインデックスならEOLが返る
		children(index) { // EOLを含む
			if (index === undefined) {
				const ret = super.children(); // push()の戻り値はlenghtプロパティの値なので、一旦変数に入れる必要あり
				ret.push(this.EOL());
				return ret;
			} else {
				return super.children(index) || this.EOL();
			}
		}

		// --判定

		hasChar() {
			return super.hasChild();
		}
		// 行内にカーソルが含まれていればtrue
		hasCursor() {
			for (let char of this.children()) {
				if (char.hasCursor()) return true;
			}
			return false;
		}
		isDisplay() {
			return this.hasClass('display');
		}
		// objが行内にあるCharおよびEOLのいずれかに一致するとtrue
		contains(obj) {
			if (obj instanceof Char) {
				for (let char of this.children()) {
					if (char.is(obj)) return true;
				}
			}
			return false;
		}
		// ページ内で一行目であるか
		isPageBreak() {
			return this.hasClass('page-break');
		}
		// ページ内で最終行であるか
		isPageLast() {
			return this.hasClass('page-last-row');
		}

		// --参照操作

		pushChar(char) {
			return this.pushChild(char);
		}
		insertChar(pos,char) {
			return this.insertChild(pos,char);
		}
		deleteChar(char) {
			return this.deleteChild(char);
		}

		// --Status

		data() {
			const data = [];
			for (let char of this.chars()) {
				data.push(char.data());
			}
			return data;
		}
		charLen() {
			return super.childLength();
		}
		maxFont() {
			let max = 0; // 空行では０になる
			for (let char of this.chars()) {
				max = Math.max(max,char.fontSize() === 'auto' ? 18 : char.fontSize());
			}
			return max;
		}

		// --Style

		width(useCache) {
			return super.height(useCache);
		}
		height(useCache) {
			return super.width(useCache);
		}

		// --DOM操作関係

		// 子を空にする(自身は削除しない)
		// EOLは削除しない
		emptyElem() {
			for (let char of this.chars()) {
				this.elem().removeChild(char.elem());
			}
			return this;
		}
		// emptyElem()に加え、オブジェクト参照も切り離す
		empty() {
			this.emptyElem();
			const prevRow = this.prev();
			if (prevRow) {
				this.EOL().prev(prevRow.lastChild());
				prevRow.lastChild().next(this.EOL());
			} else {
				this.EOL().prev(null);
			}
			this.emptyChild();
			return this;
		}
		prepend(char) {
			this.firstChild().before(char);
			return this;
		}
		append(char) {
			this.EOL().before(char);
			return this;
		}
		before(row) {
			// DOM
			this.paragraph().elem().insertBefore(row.elem(),this.elem());

			// ポインタ調整
			// oldPrev - row - this

			// row
			const oldPrev = this.prev();
			oldPrev && oldPrev.next(row);
			row.prev(oldPrev);
			row.next(this);
			this.prev(row);
			// char
			oldPrev && oldPrev.lastChild().next(row.firstChild());
			oldPrev && row.firstChild().prev(oldPrev.lastChild());
			row.lastChild().next(this.firstChild());
			this.firstChild().prev(row.lastChild());
			// parent
			row.paragraph(this.paragraph());
			const pos = this.index();
			this.paragraph().insertRow(pos,row);
			return this;
		}
		after(row) {
			// DOM
			if (this.hasNextSibling()) {
				this.paragraph().elem().insertBefore(row.elem(),this.next().elem());
			} else {
				this.paragraph().elem().appendChild(row.elem());
			}

			// ポインタ調整
			// this - row - oldNext

			// row
			const oldNext = this.next();
			this.next(row);
			row.prev(this);
			row.next(oldNext);
			oldNext && oldNext.prev(row);
			// char
			this.lastChild().next(row.firstChild());
			row.firstChild().prev(this.lastChild());
			oldNext && row.lastChild().next(oldNext.firstChild());
			oldNext && oldNext.firstChild().prev(row.lastChild());
			// parent
			row.paragraph(this.paragraph());
			const pos = this.index() + 1;
			this.paragraph().insertRow(pos,row);
			return this;
		}
		// 行を削除する
		// 要素と参照のみ
		remove() {
			// 段落に自分しか行がない場合、段落ごと削除する
			if (this.isOnlyChild()) {
				this.paragraph().remove();
				return this;
			}

			this.paragraph().elem().removeChild(this.elem());
			// oldPrev - this - oldNext →　oldPrev - oldNext
			// row
			const oldPrevRow = this.prev();
			const oldNextRow = this.next();
			oldPrevRow && oldPrevRow.next(oldNextRow);
			oldNextRow && oldNextRow.prev(oldPrevRow);
			// char
			const oldPrevChar = oldPrevRow && oldPrevRow.lastChild();
			const oldNextChar = oldNextRow && oldNextRow.firstChild();
			oldPrevChar && oldPrevChar.next(oldNextChar);
			oldNextChar && oldNextChar.prev(oldPrevChar);

			this.paragraph().deleteRow(this);

			this.next(null);
			this.prev(null);
			this.firstChild().prev(null);
			this.lastChild().next(null);
			return this;
		}
		// 文章整形を含む削除
		// カーソルが含まれていれば前の行に平行移動する
		// カーソルを動かしたくなければremove()を使う
		delete() {
			const oldPrevRow = this.prev();
			const oldNextRow = this.next();

			this.remove();

			// カーソルが削除行に含まれていれば、その前の行にカーソルを移動する
			if (this.hasCursor()) {
				if (oldPrevRow) {
					this.cursor().moveRow(oldPrevRow);
				} else {
					this.cursor().moveRow(oldNextRow);
				}
			}
			return this;
		}
		// 前の段落の最終行として移動する
		moveLastBefore() {
			if (!this.isFirst()) { return this; } // 各段落最初の行でのみ有効
			if (this.paragraph().isFirst()) return this; // 文章先頭では無効

			const prevParagraph = this.paragraph().prev();

			// 空行を移動しようとした時の処理
			if (this.isEmpty()) {
				// 前の段落に移動せず削除する
				// カーソルが含まれていれば、カーソルを前の行のEOLに移動
				this.remove();
				this.hasCursor() && prevParagraph.lastChild().EOL().addCursor().setPosMemory();
				return this;
			}

			// 空行ではない
			if (!this.isEmpty()) {
				this.remove(); // カーソルはいじる必要なし
				prevParagraph.append(this);
				return this;
			}
		}
		// 隣のRowの第一文字を、自らの最後に移動する
		// 段落内でのみ有効
		bringChar() {
			if (this.isLast()) return this;
			this.next().firstChild().moveLastBefore();
			return this;
		}
		bringChars(num) {
			for (let i = 0; i < num; i++) {
				this.bringChar();
			}
			return this;
		}
		// 自分の最後の文字を、次の行の最初に移動する
		takeChar() {
			if (!this.hasChar()) return this; // lastChar()でnullが取得される可能性があるため
			this.lastChar().moveFirstAfter(); // lastChild()では毎回EOLが取得されるのでlastChar()
			return this;
		}
		takeChars(num) {
			for (let i = 0; i < num; i++) {
				this.takeChar();
			}
			return this;
		}
		// 引数の文字列から、装飾のない文字を中に追加する
		createPlainContent(str) {
			for (let c of str) {
				this.append(new Char(Char.createPlainCharData(c)));
			}
			return this;
		}

		// --文章整理

		// 空行の整理
		// 指定文字数と異なる文字数なら、指定文字数に合わせて文字数を調節する
		cordinate() {
			if (this.index > 0 && this.isEmpty()) return this.delete(); // 空段落以外での空行は削除する

			const strLen = this.container().strLenOnRow();
			const len = this.charLen();
			if (len === strLen) return;
			if (len < strLen) {
				this.bringChars(strLen - len);
			}
			if (len > strLen) {
				this.takeChars(len - strLen);
			}
			return this;
		}
		checkKinsoku() {
			if (this.isEmpty()) { return this; }
			// 行頭にあるべきではないもの
			for (let firstText = this.firstChild().text(); !this.isFirst() && /[」』）。、？]/.test(firstText); firstText = this.firstChild().text()) {
				this.firstChild().moveLastBefore();
			}
			// 行末にあるべきではないもの
			for (let lastText = this.lastChar().text(); !this.isLast() && /[「『（]/.test(lastText); lastText = this.lastChar().text()) {
				this.lastChar().moveFirstAfter();
			}
			return this;
		}

		// --Display関係

		// displayがtrueであれば、first文字以降でその行に収まる文字を表示し、それ以外の文字は非表示にする
		display(bDisplay,first) {
			if (!bDisplay) {
				this.elem().classList.remove('display');
				return this;
			}

			this.elem().classList.add('display');
			const dispHeight = this.height();
			let heightSum = 0;
			const addArray = [];
			for (let array of this.chars().entries()) {
				const index = array[0];
				const char = array[1];
				if (index < first) {
					char.display(false);
					continue;
				}
				const fontHeight = char.fontSize(); // sizeの取得はDOMにアクセスせずに行っているため、ここではレンダリングは発生しない
				heightSum += fontHeight === 'auto' ? 18 : fontHeight;
				char.display(index >= first && heightSum < dispHeight); // trueになれば表示、falseになれば非表示
			}
			return this;
		}
		computeDisplayCharPos() {
			const cursorIndex = this.cursorChar().index();
			const currentFirst = this.firstDisplayCharPos();
			const currentEnd = this.lastDisplayCharPos();
			if (cursorIndex <= currentFirst) {
				// カーソルが前にある
				return cursorIndex;
			} else if ( cursorIndex > currentEnd) {
				// カーソルが後ろにある
				return currentFirst + (cursorIndex - currentEnd);
			} else {
				return currentFirst;
			}
		}
		firstDisplayCharPos() {
			for (let char of this.children()) {
				if (char.isDisplay()) return char.index();
			}
			return -1; // displayがひとつもない(EOLは常にdisplayなので、ここまで来たら異常)
		}
		lastDisplayCharPos() {
			if (!this.hasChar) return -1;
			for (let i = this.charLen()-1,char; char = this.chars(i); i--) {
				if (char.isDisplay()) return char.next().isEOL() ? i + 1 : i; // すべての文字がdisplayしていればEOLのインデックスを返す
			}
			return -1;
		}

		// --イベント

		// 行をクリックすると、最も近い文字にカーソルが当たる
		runClick(e) {
			if (this.container().inputBuffer().isDisplay()) return;
			const clickX = e.pageX;
			const clickY = e.pageY;
			let min = Number.MAX_VALUE;
			let closestChar;

			for (let char of this.children()) {
				const distance = char.computeDistanceFromPoint(clickX,clickY);
				if (distance < min) {
					min = distance;
					closestChar = char;
				}
			}
			closestChar.slidePrevCursor().addCursor(e.shiftKey).setPosMemory();
		}

		// --静的メソッド

		static createEmptyRow() {
			return new Row([]);
		}

		// -- other

		// 同一段落で自分以降の行に処理を行う
		// 処理中に同一段落の行でなくなったなどしても影響しない
		afterEach(func) {
			const index = this.index();
			let cnt = 0;
			for (let row of this.paragraph().rows()) {
				if (cnt >= index) func(row);
				cnt++;
			}
			return this;
		}

	}

	class Paragraph extends Sentence {
		constructor(data) {
			super(Util.createParagraphElement(data));
			const strLen = 40;
			const spArray = Util.splitArray(data[1],strLen); // data[1]が空配列なら、spArrayにも空配列が入る
			for (let charArray of spArray) {
				this.append(new Row(charArray));
			}
			// data[1]が空配列 = 空段落(空行)の場合は上記for文が実行されないので、別に空行を作成して連結する
			if (spArray.length === 0) {
				this.append(Row.createEmptyRow());
			}
		}

		// --参照取得

		container(newContainer) {
			return this.parent(newContainer);
		}
		rows(index) {
			return this.children(index);
		}

		// --判定

		hasRow() {
			return this.hasChild();
		}
		// 内部に行が存在しないか、空行が一つだけならtrue
		// 空行は空段落にしか存在しないのが正常
		isEmpty() {
			return !this.hasChild() || this.firstChild().isEmpty();
		}
		// 段落内にカーソルが含まれていればtrue
		hasCursor() {
			for (let row of this.rows()) {
				if (row.hasCursor()) return true;
			}
			return false;
		}
		// 引数で渡されたオブジェクトが段落内にある行か文字のいずれかに一致するとtrue
		contains(obj) {
			for (let row of this.rows()) {
				if (row.is(obj)) return true;
				if (row.contains(obj)) return true;
			}
			return false;
		}

		// --参照操作

		pushRow(row) {
			return this.pushChild(row);
		}
		insertRow(pos,row) {
			return this.insertChild(pos,row);
		}
		deleteRow(row) {
			return this.deleteChild(row);
		}

		// --Status

		// data用の形式に変換する
		data() {
			const data = [];
			data[0] = this.classArray();
			const charArray = [];
			for (let row of this.rows()) {
				for (let char of row.chars()) {
					charArray.push(char.data());
				}
			}
			data[1] = charArray;
			return data;
		}
		classArray() {
			return this.elem().className.match(/decolation-\S+/g) || [];
		}
		// 段落内の文字数
		countChar() {
			let cnt = 0;
			for (let row of this.rows()) {
				cnt += row.charLen();
			}
			return cnt;
		}

		// --Style

		align(align) {
			if (align === undefined) {
				const align = this.className().match(/decolation-textalign-(\S+)/);
				return align ? align[1] : 'left';
			}
			if (align) {
				const oldAlign = this.className().match(/decolation-textalign-\S+/);
				if (oldAlign) this.removeClass(oldAlign[0]);
				if (align !== 'left') this.addClass('decolation-textalign-'+ align);
			} else {
				const oldAlign = this.className().match(/decolation-textalign-\S+/);
				if (oldAlign) this.removeClass(oldAlign[0]);
			}
			return this;
		}

		// すべてのCharから指定クラスを除去する
		removeClassAllChar(className) {
			for (let row of this.rows()) {
				row.removeClassAll(className);
			}
			return this;
		}
		search(str) {
			this.removeClassAllChar('search-label');
			this.removeClassAllChar('search-word');
			for (let row of this.rows()) {
				for (let char of row.chars()) {
					char.markSearchPhrase(str);
				}
			}
			return this;
		}

		// --DOM操作関係

		append(row) {
			this.elem().appendChild(row.elem());
			row.paragraph(this);
			const nextParagraph = this.next();
			// rowの後側接続
			if (nextParagraph) {
				// row
				const nextRow = nextParagraph.firstChild();
				nextRow.prev(row);
				row.next(nextRow);
				// char
				nextRow.firstChild().prev(row.lastChild());
				row.lastChild().next(nextRow.firstChild());
			}
			// rowの前側接続
			const oldLastRow = this.hasRow() ? this.lastChild() : (this.prev() ? this.prev().lastChild() : null); // 自段落の最終行　→　前の段落の最終行　→　null

			this.pushRow(row);
			if (oldLastRow === null) {
				// 一行も存在しない状態からのappend
				return this;
			}
			// row
			oldLastRow.next(row);
			row.prev(oldLastRow);
			// char
			oldLastRow.lastChild().next(row.firstChild());
			row.firstChild().prev(oldLastRow.lastChild());

			return this;
		}
		after(paragraph) {
			// DOM
			if (this.hasNextSibling()) {
				this.container().elem().insertBefore(paragraph.elem(),this.next().elem());
			} else {
				this.container().elem().appendChild(paragraph.elem());
			}

			// ポインタ調整
			// this - paragraph - oldNext

			// paragraph
			const oldNext = this.next();
			this.next(paragraph);
			paragraph.prev(this);
			paragraph.next(oldNext);
			oldNext && oldNext.prev(paragraph);
			// row
			this.lastChild().next(paragraph.firstChild());
			paragraph.firstChild().prev(this.lastChild());
			oldNext && paragraph.lastChild().next(oldNext.firstChild());
			oldNext && oldNext.firstChild().prev(paragraph.lastChild());
			// char
			this.lastChild().lastChild().next(paragraph.firstChild().firstChild());
			paragraph.firstChild().firstChild().prev(this.lastChild().lastChild());
			oldNext && paragraph.lastChild().lastChild().next(oldNext.firstChild().firstChild());
			oldNext && oldNext.firstChild().firstChild().prev(paragraph.lastChild().lastChild());
			// parent
			paragraph.container(this.container());
			const pos = this.index() + 1;
			this.container().insertParagraph(pos,paragraph);
			return this;
		}
		// 要素と参照の削除
		remove() {
			this.container().elem().removeChild(this.elem());
			// oldPrev - this - oldNext →　oldPrev - oldNext

			// paragraph
			// oldPrevParagraph - oldNextParagraph
			const oldPrevParagraph = this.prev();
			const oldNextParagraph = this.next();
			oldPrevParagraph && oldPrevParagraph.next(oldNextParagraph);
			oldNextParagraph && oldNextParagraph.prev(oldPrevParagraph);

			// row
			// oldPrevParagraph.lastChild() - oldNextParagraph.firstChild();
			// oldPrevRow - oldNextRow
			const oldPrevRow = oldPrevParagraph && oldPrevParagraph.lastChild();
			const oldNextRow = oldNextParagraph && oldNextParagraph.firstChild();
			oldPrevRow && oldPrevRow.next(oldNextRow);
			oldNextRow && oldNextRow.prev(oldPrevRow);

			// char
			// oldPrevRow.lastChild() - oldNextRow.lastChild();
			// oldPrevChar - oldNextChar
			const oldPrevChar = oldPrevRow && oldPrevRow.lastChild();
			const oldNextChar = oldNextRow && oldNextRow.firstChild();
			oldPrevChar && oldPrevChar.next(oldNextChar);
			oldNextChar && oldNextChar.prev(oldPrevChar);

			this.container().deleteParagraph(this);
			this.prev(null).firstChild() && this.firstChild().prev(null).firstChild() && this.firstChild().firstChild().prev(null);
			this.next(null).lastChild() && this.lastChild().next(null).lastChild() && this.lastChild().lastChild().next(null);
			return this;
		}
		// 文章整形を含む削除
		// カーソルは削除範囲直前の行に平行移動
		delete() {
			const oldPrevRow = this.prev() && this.prev().lastChild();
			const oldNextRow = this.next() && this.next().firstChild();

			this.remove();

			if (this.hasCursor()) {
				if (oldPrevRow) {
					this.cursor().moveRow(oldPrevRow);
				} else { // 直前の行がなければ直後
					this.cursor().moveRow(oldNextRow);
				}
			}
			return this;
		}
		// 渡された文字以降を新しい段落に移動して、段落を２つに分ける
		// 段落先頭から:一行目の文字が丸々新しい行に移って次の段落の一行目となる。二行目以降は行ごと次の段落へ →　基準文字のあった行は空行となりもともとの段落の唯一の行となるため、あたかも空段落が基準行の前に挿入されたようになる
		// 行頭から:基準行の文字がまるまる新しい行に移って次の段落の一行目になる。基準行以降の行は行ごと新しい段落に移る。　→　基準行以降が新しい段落に移り、それ以前の行はもともとの段落に残るため、段落が２つに別れる。この時点では、もともとの段落の最後に空行が残っている状態なので、cordinate()で対応する
		// 行の途中から:基準文字以降の同じ行の文字が新しい行に移って次の段落の一行目になる。それ以降は行ごと次の段落に移る。　→　基準文字以降が新しい段落になる。この時点では一行目の文字数がおかしいので、cordinate()で調整する
		// 段落最後のEOLから: 基準文字のインデックスが同一行の他の文字より大きいため、afterEach()が一度も実行されない。次の行も存在しないのでnextRowが存在せず、nextRow.afterEach()は実行されない。ただし、新しい行はnewParagraphを作成した時点で存在している。 →　新しい段落が今いる段落の後ろに追加されるだけ
		divide(char) {
			if (!this.contains(char)) return this;
			const paragraph = char.row().paragraph();
			const newParagraph = Paragraph.createEmptyParagraph().align(paragraph.align()); // 作成時点で空行が含まれている 段落にテキストアラインが付与されていれば、新しい段落も同様にする
			const nextRow = char.row().hasNextSibling() ? char.row().next() : null; // この行以降を新しい段落に移動
			// 一行目
			// 基準文字以降を新しい行に移し、新しい段落に挿入する
			// 元々の行は空になってもそのまま
			const newRow = newParagraph.firstChild();
			char.afterEach(function (c) {
				c.remove();
				newRow.append(c);
			});

			// 二行目以降
			// 行ごと新しい段落に移動
			if (nextRow) {
				nextRow.afterEach(function (row) {
					row.remove();
					newParagraph.append(row);
				});
			}

			this.after(newParagraph);
			paragraph.cordinate().checkKinsoku();
			newParagraph.cordinate().checkKinsoku();
			return this;
		}

		// --文章整理

		cordinate() {
			// エラー原因まとめ
			// ここで一旦rows()の内容が保存され、そこから一つ一つrowを取り出す(rows()はコピーされた配列が返される)
			// row.cordinate()内のbringChar()によって、最終行が削除されることがある
			// 削除された最終行でも、先に保存されていたためrow.cordinate()が実行される
			// 削除行の参照は保持されているのでcordinate()はエラーが起きずに実行される
			// ただしremove()された時にparentにnullが代入されているので、内部でparagraph().container()が実行されるときにNullPointer
			for (let row of this.rows()) {
				if (!row.paragraph()) continue; // cordinate()内で行が削除された場合の対策
				row.cordinate();
			}
			return this;
		}
		checkKinsoku() {
			for (let row of this.rows()) {
				if (!row.paragraph()) continue;
				row.checkKinsoku();
			}
			return this;
		}

		static createEmptyParagraph() {
			const arg = [];
			arg[0] = [];
			arg[1] = [];
			return new Paragraph(arg);
		}
	}

	// classは巻き上げが起こらないため、Char・Rowの下に作る必要がある。ただし、SentenceContainer内で利用するのでSentenceContainerよりは上になければならない
	class ConvertView extends Sentence {
		// 文節番号は、ConvertViewのindex()と同じ
		constructor(data) {
			super(Util.createConvertViewElement());
			data[1].push(data[0]); // 末尾に明確にひらがなを入れる
			for (let str of data[1]) {
				const row = Row.createEmptyRow();
				row.createPlainContent(str);
				this.append(row);
			}
			this.removeClass('paragraph');
			this.addClass('convert-view');
		}

		// --参照取得

		container(newContainer) {
			return this.parent(newContainer);
		}
		rows(index) {
			return this.children(index);
		}
		// 現在選択中の行を取得する
		getSelect() {
			for (let row of this.rows()) {
				if (row.hasClass('select')) return row;
			}
			return this.lastChild(); // 選択行がなければひらがな行
		}

		// --判定
		isActive() {
			return this.hasClass('active');
		}

		// --Status

		// 文節のひらがなを文字列で返す
		hiragana() {
			return this.lastChild().text(); // 最終行は必ずひらがな
		}

		// ひらがなでの文字数
		kanaLength() {
			return this.hiragana().length;
		}
		phraseNum() {
			return this.index();
		}

		// --Style
		active() {
			for (let view of this.container().views()) {
				if (view.hasClass('active')) { view.removeClass('active'); }
			}
			this.addClass('active');
			return this;
		}
		selectLeft() {
			const index = this.getSelect().index() + 1;
			this.select(index);
			return this;
		}
		selectRight() {
			const index = this.getSelect().index() - 1;
			this.select(index);
			return this;
		}

		// --DOM操作

		// index行目を選択
		select(index) {
			if (index < 0) index = 0;
			if (index >= this.childLength()) index = this.childLength() - 1;

			for (let row of this.rows()) {
				if (row.hasClass('select')) row.removeClass('select');
			}
			const newRow = this.rows(index);
			newRow.addClass('select');
			this.container().inputBuffer().insertPhrase(this.phraseNum(),newRow.text());
			return this;
		}
		append(row) {
			// DOM
			this.elem().appendChild(row.elem());
			// ポインタ調整
			// view
			if (this.hasChild()) {
				this.lastChild().next(row);
				row.prev(this.lastChild());
			}
			// parent
			row.parent(this);
			this.pushChild(row);
			return this;
		}
		before(view) {
			// DOM
			this.container().elem().insertBefore(view.elem(),this.elem());

			// ポインタ調整
			// oldPrev - view - this

			// view
			const oldPrev = this.prev();
			oldPrev && oldPrev.next(view);
			view.prev(oldPrev);
			view.next(this);
			this.prev(view);
			// paretn
			view.container(this.container());
			const pos = this.index();
			this.container().insertChild(pos,view);
			return this;
		}
		after(view) {
			// DOM
			if (this.hasNextSibling()) {
				this.container().elem().insertBefore(view.elem(),this.next().elem());
			} else {
				this.container().elem().appendChild(view.elem());
			}

			// ポインタ調整
			// this - view - oldNext

			// view
			const oldNext = this.next();
			this.next(view);
			view.prev(this);
			view.next(oldNext);
			oldNext && oldNext.prev(view);
			// parent
			view.container(this.container());
			const pos = this.index() + 1;
			this.container().insertChild(pos,view);
			return this;
		}
		remove() {
			// DOM
			this.container().elem().removeChild(this.elem());

			// ポインタ調整
			// oldPrev - this - oldNext →　oldPrev - oldNext

			// view
			const oldPrev = this.prev();
			const oldNext = this.next();
			oldPrev && oldPrev.next(oldNext);
			oldNext && oldNext.prev(oldPrev);
			this.prev(null);
			this.next(null);
			// parent
			this.container().deleteChild(this);
			this.container(null);
			return this;
		}
		replace(view) {
			this.before(view);
			if (this.isActive()) view.active();
			return this.remove();
		}
		toKatakana() {
			this.container().inputBuffer().insertPhrase(this.phraseNum(),this.getKatakana());
			return this;
		}
		getKatakana() {
			const str = this.hiragana();
			let rtnKatakana = '';
			for (let char of str) {
				const cKatakana = key_table.katakana[char];
				if (cKatakana) {
					rtnKatakana += cKatakana;
				} else {
					// 変換できなければ元の文字をそのまま連結
					rtnKatakana += char;
				}
			}
			return rtnKatakana;
		}
	}
	class ConvertContainer extends Sentence {
		constructor(inputBuffer) {
			super(document.getElementById('convert_container'));
			this._inputBuffer = inputBuffer;
		}

		// --参照取得

		inputBuffer() {
			return this._inputBuffer;
		}
		views(index) {
			return super.children(index);
		}
		activeView() {
			for (let view of this.views()) {
				if (view.isActive()) return view;
			}
			return null;
		}

		// --判定
		isActive() {
			return this.childLength() > 0;
		}

		// --Style

		reposition() {
			const x = this.cursorX();
			const y = this.cursorY();
			this.elem().style.top = y + 'px';
			this.elem().style.left = (x - this.width()) + 'px';
			return this;
		}
		cursorX() {
			return this.inputBuffer().cursorX();
		}
		cursorY() {
			return this.inputBuffer().cursorY();
		}
		show() {
			this.elem().style.display = 'block';
			return this;
		}
		hide() {
			this.elem().style.display = 'none';
			this.removeKeydownEventListener();
			return this;
		}

		// --DOM操作

		// 文字を挿入してviewsを破棄する
		input() {
			this.inputBuffer().input();
			return this;
		}
		createViews(data) {
		/*
		 * data形式
		 * [[ひらがな,[漢字１,漢字２,漢字３]],[ひらがな２,[漢字４,漢字５]],[[ひらがな３,[漢字６,漢字７]]]]
		 */
			this.empty();
			for (let phraseData of data) {
				this.append(new ConvertView(phraseData));
			}
		}
		// 初変換
		convert(str) {
			Util.post("/tategaki/KanjiProxy",{
				sentence: str
			},function (json) {
				this.createViews(json);
				this.inputBuffer().setPhraseNum();
				// すべて変換第一候補を選択する
				for (let view of this.views()) {
					view.select(0);
				}
				// 最初の文節を選択
				this.inputBuffer().select(0);

				this.reposition();
				this.addKeydownEventListener();
			}.bind(this));
			this.show();
		}
		// 文節区切りを一つ前にずらす
		shiftUp() {
			const activeView = this.activeView();

			if (activeView.kanaLength() === 1) { return this; }

			// 最終文節から
			// 最後の一字を分離して、二文節を変換し直す
			if (activeView.isLast()) {
				const activeKana = activeView.hiragana();
				const sendString = activeKana.slice(0,-1) + ',' + activeKana.slice(-1);
				Util.post("/tategaki/KanjiProxy",{
					sentence: sendString
				},function (json) {
					this.replace(activeView.phraseNum(),json);
				}.bind(this));
				return this;
			}

			// 最終文節からではない
			// 選択文字列から最後の一文字を取り除き、その次の文節の頭につなげてそれぞれを変換し直す
			if (!activeView.isLast()) {
				const activeKana = activeView.hiragana();
				const nextView = activeView.next();
				const nextKana = nextView.hiragana();
				const sendString = activeKana.slice(0,-1) + ',' + activeKana.slice(-1) + nextKana;
				Util.post("/tategaki/KanjiProxy",{
					sentence: sendString
				},function (json) {
					const newFirst = new ConvertView(json[0]);
					activeView.replace(newFirst);
					newFirst.select(0);
					const newSecond = new ConvertView(json[1]);
					nextView.replace(newSecond);
					newSecond.select(0);
				});
				return this;
			}
		}
		shiftDown() {
			const activeView = this.activeView();
			const nextView = activeView.next();

			if (activeView.isLast()) return;

			// 次の文節の文字数が１文字だけなら融合して、１文節として変換する
			if (nextView.kanaLength() === 1) {
				const nextPhrase = this.inputBuffer().phrases(nextView.phraseNum())[0];
				const sendString = activeView.hiragana() + nextView.hiragana() + ','; // 文節を区切られないよう、,を末尾に追加する
				Util.post("/tategaki/KanjiProxy",{
					sentence: sendString
				},function (json) {
					const newView = new ConvertView(json[0]);
					activeView.replace(newView);
					nextView.remove();
					nextPhrase.remove();
					newView.select(0);
					this.inputBuffer().setPhraseNum();
				}.bind(this));
				return this;
			}

			// 次の文節が二文字以上
			// 次の文節の１文字目を選択文節に移動して、それぞれを変換し直す
			const activeKana = activeView.hiragana();
			const nextKana = nextView.hiragana();
			const sendString = activeKana + nextKana.slice(0,1) + ',' + nextKana.slice(1);
			Util.post("/tategaki/KanjiProxy",{
				sentence: sendString
			},function (json) {
				const newFirst = new ConvertView(json[0]);
				activeView.replace(newFirst);
				newFirst.select(0);
				const newSecond = new ConvertView(json[1]);
				nextView.replace(newSecond);
				newSecond.select(0);
			});
			return this;
		}
		backSpace() {
			const activeView = this.activeView();
			// buffer文字がひらがなにして一文字しかない
			// 文字を削除してinput終了
			if (activeView.isOnlyChild() && activeView.kanaLength() === 1) {
				this.empty();
				this.inputBuffer().pop();
				return this;
			}

			// 文節がひらがなにして一文字しかない
			// その文節を削除してひとつ前の文節を選択する
			if (activeView.kanaLength() === 1) {
				const phraseNum = activeView.phraseNum();
				const phraseChar = this.inputBuffer().phrases(phraseNum)[0];
				phraseChar.remove();
				activeView.remove();
				this.inputBuffer().setPhraseNum()
					.select(phraseNum > 0 ? phraseNum - 1 : phraseNum); // 一つ前の文節がなければ、一つ次の文節
				return this;
			}

			// 文節にひらがなにして二文字以上ある
			// 最後の一字を削除して、その文節を変換し直す
			const phraseNum = activeView.phraseNum();
			const newString = activeView.hiragana().slice(0,-1) + ','; // 文節を区切られないよう、,を末尾に追加する
			Util.post("/tategaki/KanjiProxy",{
				sentence: newString
			},function (json) {
				this.replace(phraseNum,json);
			}.bind(this));
			return this;
		}
		// 文節番号がnumのviewをdataで入れ替える
		replace(num,data) {
			const oldView = this.views(num);
			const newViews = []; // 文節番号を振り直した後でないとview.select()できない(中でinsertPhrase()をしているため)ので、いったん新しいインスタンスを入れておく
			// viewを入れ替え、bufferにはいったんひらがなを挿入する
			for (let phraseData of data.entries()) {
				// view
				const newView = new ConvertView(phraseData[1]);
				newViews.push(newView);
				oldView.before(newView);
				// input_buffer
				// setPhraseNum()は、select()する前のviewではひらがなの長さを使って文節番号を割り振る。そのため、いったんひらがなをbufferに追加する
				if (phraseData[0] === 0) // ひとつめだけ入替えで、他はその後に追加していく
					this.inputBuffer().insertPhrase(num,oldView.prev().hiragana()); // 古いbuffer文字はここでなくなる
				else
					this.inputBuffer().insertPhraseAfter(num,oldView.prev().hiragana()); // HACK:追加分の文字の順番がこの時点ではおかしくなるが、合計のひらがなの数は正しくなっているので、buffer.setPhraseNum()とnewView.select(0)で正しく文字が置き換わる
			}
			oldView.remove();

			// 文節番号の振り直し
			this.inputBuffer().setPhraseNum();
			// 最初の候補で置き換える
			for (let newView of newViews) {
				newView.select(0);
			}
			if (oldView.isActive()) newViews[0].active();
			return this;
		}
		append(view) {
			this.elem().appendChild(view.elem());
			if (this.hasChild()) {
				this.lastChild().next(view);
				view.prev(this.lastChild());
			}
			view.container(this);
			this.pushChild(view);
			return this;
		}

		// --イベント

		addKeydownEventListener() {
			this.inputBuffer().removeKeydownEventListener()
				.container().removeKeydownEventListener();
			super.addKeydownEventListener();
			return this;
		}
		runKeydown(e,keycode) {
			switch (keycode) {
				case 8:
					this.backSpace();
					break;
				case 13:
					// Enter
					this.input();
					break;
				case 32:
				case 37:
					// space
					// Left
					this.activeView().selectLeft();
					break;
				case 38:
					// Up
					if (e.shiftKey) {
						this.shiftUp();
					} else {
						this.inputBuffer().selectPrev();
					}
					break;
				case 39:
					// Right
					this.activeView().selectRight();
					break;
				case 40:
					// Down
					if (e.shiftKey) {
						this.shiftDown();
					} else {
						this.inputBuffer().selectNext();
					}
					break;
				case 118:
					// F7
					this.activeView().toKatakana();
					break;
				default:
					break;
			}
		}
	}
	class InputChar extends Char {
		constructor(data,phraseNum) {
			super(data);
			if (phraseNum === undefined) phraseNum = -1;
			this.phraseNum(phraseNum);
		}

		// --判定
		isPhraseNum(num) {
			return num === this.phraseNum();
		}
		isSelect() {
			return this.hasClass('select-phrase');
		}

		// --Status

		phraseNum(newNum) {
			if (newNum === undefined) {
				return this._phraseNum;
			} else {
				this.elem().dataset.phraseNum = newNum;
				this._phraseNum = newNum;
				return this;
			}
		}

		// --Style

		select() {
			this.addClass('select-phrase');
			return this;
		}
		removeSelect() {
			this.removeClass('select-phrase');
			return this;
		}

	}

	class InputBuffer extends Row {
		constructor(container) {
			super(document.getElementById('input_buffer'));
			this._container = container;
			this._convertContainer = new ConvertContainer(this);
		}

		// --参照取得

		container() {
			return this._container;
		}
		cursor() {
			return this.container().cursor();
		}
		cursorChar() {
			return this.cursor().getChar();
		}
		convertContainer() {
			return this._convertContainer;
		}
		// 引数で指定された文節番号を持つInputCharを配列にして返す
		phrases(num) {
			const ret = [];
			for (let char of this.chars()) {
				if (char.isPhraseNum(num)) ret.push(char);
			}
			return ret;
		}
		selectPhrases() {
			const ret = [];
			for (let char of this.chars()) {
				if (char.isSelect()) ret.push(char);
			}
			return ret;
		}

		// --判定

		isDisplay() {
			return this.elem().style.display === 'block';
		}

		// --Status

		// ConvertViewsを作成した後に、各文字に文節番号をふる
		setPhraseNum() {
			let cnt = 0;
			for (let view of this.convertContainer().views()) {
				const num = view.phraseNum();
				const len = view.getSelect().length();
				for (let i = 0; i < len; i++,cnt++) {
					this.chars(cnt).phraseNum(num);
				}
			}
			return this;
		}
		selectIndex() {
			for (let char of this.chars()) {
				if (char.isSelect()) return char.phraseNum();
			}
			return -1;
		}

		// --Style

		width() {
			return super.super.width();
		}
		height() {
			return super.super.height();
		}
		resize() {
			const style = this.elem().style;
			style.width = this.newWidth() + 'px';
			style.height = this.newHeight() + 'px';
			return this;
		}
		move() {
			this.elem().style.left = this.cursorX() + 'px';
			this.elem().style.top = this.cursorY() + 'px';
			return this;
		}
		show() {
			this.elem().style.display = 'block';
			return this;
		}
		hide() {
			this.elem().style.display = 'none';
			this.removeKeydownEventListener();
			return this;
		}
		selectNext() {
			return this.select(this.selectIndex() + 1);
		}
		selectPrev() {
			return this.select(this.selectIndex() - 1);
		}
		// 文節番号がindexの文字を選択する
		// 引数が負になれば最後の文節を、最大の文節番号を越えれば最初の文節を選択する
		select(index) {
			const maxIndex = this.lastChar().phraseNum();
			if (index < 0) index = maxIndex;
			if (index > maxIndex) index = 0;

			for (let char of this.chars()) {
				if (char.phraseNum() === index)
					char.select();
				else
					char.removeSelect();
			}
			this.convertContainer().views(index).active();
			return this;
		}

		// --DOM操作

		empty() {
			super.empty();
			if (this.convertContainer().isActive()) {
				this.convertContainer().empty().hide();
			}
			return this;
		}
		push(keycode,isShift) {
			const newInputStr = this.newString(keycode,isShift);

			if (newInputStr === undefined || newInputStr.indexOf('undefined') !== -1) {
				// 未定義文字(alt,ctrl,tabなど)はreturn
				return this;
			}
			this.update(newInputStr);
			this.resize();
			return this;
		}
		// bufferの最後の文字を削除する
		// 文字が全てなくなればinputを終了する
		// 戻り値は削除したInputCharオブジェクト
		pop() {
			if (!this.hasChar) return this;
			const ret = this.lastChar().remove();
			this.resize();
			if (!this.hasChar()) {
				this.hide();
				this.container().addKeydownEventListener();
			}
			return ret;
		}
		update(str) {
			this.empty();
			for (let char of str) {
				this.append(new InputChar(this.cursorChar().createData(char)));
			}
			this.show();
			return this;
		}
		// カーソル位置に文字を挿入し、後処理を行ってinput状態を終了する
		input() {
			this.cursor().insert(this.text());
			this.empty().hide();
			this.container().addKeydownEventListener();
			this.container().changeDisplay();
			return this;
		}
		toKatakanaAll() {
			this.update(this.getKatakana());
			return this;
		}
		convert() {
			this.convertContainer().convert(this.text());
			return this;
		}
		// 文節文字を入れ替える
		insertPhrase(num,str) {
			const phrases = this.phrases(num);
			if (phrases.length === 0) return this; // 指定された文節番号の文字が見つからなかった
			// 新しいInputCharをもともとあった文字の前に挿入していく
			for (let c of str) {
				const newChar = new InputChar(this.cursorChar().createData(c),num);
				phrases[0].before(newChar);
				if (phrases[0].isSelect()) newChar.select(); // 選択中の文節なら入替え文字も選択
			}
			// 古い文字を削除
			for (let old of phrases) {
				old.remove();
			}
			this.resize();
			return this;
		}
		// 指定した文節の後ろに文節を追加する
		// 追加した文字の文節番号は負の値になる
		insertPhraseAfter(num,str) {
			const phrases = this.phrases(num);
			if (phrases.length === 0) return this; // 指定された文節番号の文字が見つからなかった
			const nextChar = phrases[phrases.length -1].next(); // 挿入用の文字。最後にはEOLがあるので、必ず存在する
			for (let c of str) {
				nextChar.before(new InputChar(this.getChar().createData(c),-num));
			}
			this.resize();
			return this;
		}

		// --外からの情報取得

		newString(keycode,isShift) {
			const inputStr = this.text(); //もともとの文字列
			if (isShift) {
				return inputStr + key_table.shift_key[keycode];
			} else {
				return key_table.getString(inputStr,keycode); //keycodeを加えた新しい文字列
			}
		}
		getKatakana() {
			const str = this.text();
			let rtnKatakana = '';
			for (let char of str) {
				const cKatakana = key_table.katakana[char];
				if (cKatakana) {
					rtnKatakana += cKatakana;
				} else {
					// 変換できなければ元の文字をそのまま連結
					rtnKatakana += char;
				}
			}
			return rtnKatakana;
		}
		// buffer内の文字列から、適切な幅を計算する
		newWidth() {
			const cache = {};
			let width = 0;
			for (let char of this.chars()) {
				const size = char.fontSize();
				if (cache[size]) {
					width = Math.max(width,cache[size]);
				} else {
					cache[size] = char.width();
					width = Math.max(width,char.width());
				}
			}
			return width + 5; // 5px余裕をもたせる
		}
		// buffer内の文字列から、適切な高さを計算する
		newHeight() {
			const cache = {};
			let height = 0;
			for (let char of this.chars()) {
				const size = char.fontSize();
				if (cache[size]) {
					height += cache[size];
				} else {
					cache[size] = char.height();
					height += cache[size];
				}
			}
			return height + 5; // 5px余裕をもたせる
		}
		cursorX() {
			return this.cursorChar().x();
		}
		cursorY() {
			return this.cursorChar().y();
		}

		// --イベント

		// key eventがSentenceContainerから移動するかどうかを判定して前処理を行う
		transfer(e,isShift) {
			this.push(e,isShift);
			if (this.hasChar()) {
				this.addKeydownEventListener();
				this.move();
			}
			return this;
		}
		addKeydownEventListener() {
			this.container().removeKeydownEventListener();
			this.convertContainer().removeKeydownEventListener();
			super.addKeydownEventListener();
			return this;
		}
		runKeydown(e,keycode) {
			switch (keycode) {
				case 8:
					// backspace
					this.pop();
					break;
				case 13:
					// enter
					this.input();
					break;
				case 32:
					// space
					this.convert();
					break;
				case 118:
					// F7
					this.toKatakanaAll();
					break;
				default:
					this.push(keycode,e.shiftKey);
					break;
			}
		}
	}

	class File extends Sentence {
		constructor(id,filename) {
			super(Util.createFileElement(id,filename));
			this._link = this.elem().getElementsByTagName('a')[0];
			this._id = id;
			this._name = filename;
			this._nextFile = null;
			this._prevFile = null;
			this.addClickEventListener();
		}

		// --参照取得

		fileList() {
			for (let parentDir = this.parent(); parentDir ;parentDir = parentDir.parent() ) {
				if (parentDir.isRoot()) return parentDir;
			}
			return null;
		}

		// 内部のaタグのエレメント
		link() {
			return this._link;
		}
		// 通常のnext()やprev()はディレクトリも含め同階層をつなぐ
		// nextFile()とprevFile()はファイルのみ、ディレクトリ横断的につなぐ
		nextFile(file) {
			if (file === undefined) {
				return this._nextFile;
			} else {
				this._nextFile = file;
				return this;
			}
		}
		prevFile(file) {
			if (file === undefined) {
				return this._prevFile;
			} else {
				this._prevFile = file;
				return this;
			}
		}

		// --判定

		isRoot() {
			return false;
		}
		isDirectory() {
			return false;
		}
		isFile() {
			return true;
		}
		isFirstFile() {
			return this.prevFile() === null;
		}
		isLastFile() {
			return this.nextFile() === null;
		}
		isOpen() {
			return this.fileList().sentenceContainer().fileId() === this.id();
		}
		isClose() {
			return this.fileList().sentenceContainer().fileId() !== this.id();
		}

		// --Status
		id() {
			return this._id;
		}
		name() {
			return this._name;
		}

		// --DOM操作

		// コンテナにファイルを読み込む
		open() {
			const sentenceContainer = this.fileList().sentenceContainer();

			console.time('readFile');
			const data = {};
			data.user_id = sentenceContainer.userId();
			data.file_id = this.id();
			console.time('post()');
			sentenceContainer.userAlert('読込中');
			Util.post('/tategaki/ReadJsonFile',data,function (json) {
				'use strict';
				console.timeEnd('post()');
				console.time('SentenceContainer init');
				sentenceContainer.init(json).userAlert('読み込み完了');
				console.timeEnd('SentenceContainer init');
			}.bind(this));
			return this;
		}
		delete() {
			Util.post('/tategaki/DeleteFile',{
				user_id: this.fileList().sentenceContainer().userId(),
				file_id: this.id()
			},function (json) {
				if (!result) { console.log('ファイル削除エラーです(ファイル番号：'+ this.id() + ')'); }
				// 現在開いているファイルを削除したなら、前後どちらかのファイルを開く
				// 同じディレクトリに他のファイルがなければ新しいファイルを開く
				// 最後に、ファイルリストを作り直す
				if (this.sentenceContainer().fileList().currentFile() === this) {
					const nextFile = this.next() || this.prev();
					if (nextFile) {
						nextFile.open();
						this.sentenceContainer().fileList().read();
						return;
					}
					if (!nextFile) {
						this.sentenceContainer().newFile();
						this.sentenceContainer().fileList().read();
						return;
					}
				}
				this.sentenceContainer().fileList().read();
				}.bind(this));
		}
		move(newParentDir) {
			const fileList = this.fileList();
			Util.post("/tategaki/MoveFile",{
				user_id: fileList.sentenceContainer().userId(),
				file_id: this.id(),
				directory_id: newParentDir.id()
			},function (data) {
				fileList.read();
			});
		}

		// --イベント

		// liタグの要素ではなくaタグ要素にクリックイベントを設定するためオーバーライド
		addClickEventListener() {
			this._clickArg = this.onClick.bind(this);
			this.link().addEventListener('click',this._clickArg);
			return this;
		}
		removeClickEventListener() {
			if (!this._clickArg) return this;
			this.link().removeEventListener('click',this._clickArg);
			this._clickArg = null;
			return this;
		}
		runClick(e) {
			this.open();
			$('#file_list_modal').modal('hide');
		}
	}
	class Directory extends Sentence {
		constructor(dirId,data) {
			/*
			 * dataの中身例(rootから見て)
			 * data = {
			 * 	"directoryname": "root",
			 * 	"1":"sample",
			 * 	"8":"file",
			 * 	"6": {
			 * 		"directoryname": "dirname",
			 * 		"4":"indirfile",
			 * 		"9":"file",
			 * 		"12": {
			 * 			"directoryname": "seconddir",
			 * 			"17": "file"
			 * 		}
			 * 	}
			 * }
			 * fileId:filename
			 */
			super(Util.createDirectoryElement(dirId,data));
			this._link = this.elem().getElementsByTagName('a')[0];
			this._innerList = this.elem().getElementsByTagName('ul')[0];

			this._id = parseInt(dirId);
			this._name = data['directoryname'];
			for (let id in data) {
				if (id === 'directoryname') continue;
				if (typeof data[id] === 'string') {
					this.append(new File(id,data[id]));
				} else {
					this.append(new Directory(id,data[id]));
				}
			}
		}

		// --参照取得
		link() {
			return this._link;
		}
		innerList() {
			return this._innerList;
		}
		fileList() {
			for (let parentDir = this.parent(); parentDir ;parentDir = parentDir.parent() ) {
				if (parentDir.isRoot()) return parentDir;
			}
			return null;
		}

		// --判定

		isRoot() {
			return false;
		}
		isDirectory() {
			return true;
		}
		isFile() {
			return false;
		}

		// --参照操作

		// --Status

		id() {
			return this._id;
		}
		name() {
			return this._name;
		}

		// --DOM操作
		append(file) {
			// DOM
			this.appendElem(file);

			// ポインタ調整
			// 最初の要素と最後の要素はつなげる

			if (this.hasChild()) {
				this.lastChild().next(file);
				file.prev(this.lastChild());
			}
			file.parent(this);
			this.pushChild(file);
			return this;
		}
		appendElem(file) {
			this.innerList().appendChild(file.elem());
			return this;
		}
		// ディレクトリ内にファイルがあるとき、強制的に中のファイルごと削除するときのみoptionはtrue
		delete(bl) {
			bl = bl || false; // 引数省略の場合でも、明確にfalseを入れる
			Util.post("/tategaki/DeleteDirectory",{
				directory_id: this.id(),
				option: bl
			},function (data) {
				this.fileList().read();
				if (data.result === 'within') {
					alert('ディレクトリが空ではないので削除できませんでした。');
				}
			},bind(this));
		}
	}
	class FileList extends Sentence {
		constructor(sentenceContainer,data) {
			super(document.getElementById('file_list'));
			this._sentenceContainer = sentenceContainer;
			this._$modal = $('#file_list_modal');
			this._filterInputElem = document.getElementById('file_list_filter');
			this.addEventListenerOnInput();
			if (data) {
				this.init(data);
			} else {
				this.read();
			}
		}
		init(data) {
			this.empty();
			for (let id in data) {
				if (id === 'directoryname') continue;
				if (typeof data[id] === 'string') {
					this.append(new File(id,data[id]));
				} else {
					this.append(new Directory(id,data[id]));
				}
			}
			this.chainFile();
			return this;
		}
		// --参照取得

		sentenceContainer() {
			return this._sentenceContainer;
		}
		firstFile() {
			return this.findNextFile(this);
		}
		lastFile() {
			for (let file = this.firstFile(); file; file = file.nextFile()) {
				if (file.isLastFile()) return file;
			}
			return null;
		}
		currentFile() {
			for (let file = this.firstFile(); file; file = file.nextFile()) {
				if (file.isOpen()) return file;
			}
			return null;
		}
		$modal() {
			return this._$modal;
		}
		filterInputElem() {
			return this._filterInputElem;
		}
		findFile(idOrName) {
			const ret = [];
			for (let file = this.firstFile(); file; file = file.nextFile()) {
				if (file.id() === idOrName || (typeof idOrName === 'string' && new RegExp('^'+ idOrName +'$','i').test(file.name()))) {
					ret.push(file);
				}
			}
			return ret;
		}
		// ディレクトリをIDか名前で探す
		findDirectory(idOrName) {
			const ret = [];
			this.each(function (dir) {
				if (dir.isDirectory && (dir.id() === idOrName || (typeof idOrName === 'string' && new RegExp('^'+ idOrName +'$','i').test(dir.name())))) {
					ret.push(file);
				}
			});
			return ret;
		}

		// --判定

		isRoot() {
			return true;
		}
		isFile() {
			return false;
		}
		isDirectory() {
			return false;
		}
		isOpen() {
			return this.$modal().hasClass('in');
		}
		hasFile() {
			return this.firstFile() !== null;
		}

		// --参照操作

		// 自分以降のファイル同士をポインタでつなぐ
		chainFile() {
			let prev;
			this.each(function (file) {
				if (!file.isFile()) return;
				if (prev) prev.nextFile(file);
				file.prevFile(prev);
				prev = file;
			});
			return this;
		}
		// リストで上からファイルだけを数えた場合の、引数の次のファイルを返す
		// チェックする順番は、ファイルならその次のファイルをチェックし、ディレクトリなら下に潜って最初に見つけたファイルをチェックする
		// -- 全要素を順に探索していくための道のり --
		// 引数がファイルなら。引数の次を確認する
		// 引数がディレクトリなら、その最初の子を確認する(FileListはディレクトリ扱い)
		// 空ディレクトリ(firstChild()===null)なら、引数の次を確認する
		// 引数の次が同じ階層になければ(ディレクトリ内の最後と判断する)、親ディレクトリの次を確認する(それでもなければ、さらに上の親ディレクトリの次、と繰り返す)
		// 引数の次の要素が見つからず親をたどっていく過程でルートディレクトリ(FileList)に辿り着いた場合は、探索が最後に達したとしてnullを返す
		// -- ここまでで確認要素を取得 --
		// 取得した確認要素がディレクトリなら、さらに潜って探索を次に進めるため再帰する
		// 取得した確認要素がファイルなら、その要素が引数の次のファイルなので返す
		findNextFile(file) {
			if (file.isEmpty() && file.isRoot()) return null;
			let check;
			if (file.isFile()) {
				check = file.next();
			}
			if (file.isDirectory() || file.isRoot()) {
				check = file.firstChild() || file.next();
			}
			if (!check) {
				for (let parentDir = file.parent(); !(check = parentDir.next()); parentDir = parentDir.parent()) {
					if (parentDir.isRoot()) return null;
				}
			}
			if (check.isDirectory()) {
				return this.findNextFile(check);
			}
			if (check.isFile()) {
				return check;
			}
			return null;
		}
		// すべてのファイルとディレクトリを順に引数にして関数を実行する
		// fileがファイルなら次に進む
		// ディレクトリなら子に進む
		// 次がなければ親の次に進む。それでもなければさらに親の次、と繰り返す
		// その過程でルートディレクトリが見つかれば探索終了
		each(func) {
			for (let file = this.firstChild(),temp = this;; temp = file, file = file.isFile() ?  file.next() : file.firstChild()) {
				if (!file) {
					for (let parentDir = temp.parent(); !(file = parentDir.next()); parentDir = parentDir.parent()) {
						if (parentDir.isRoot()) return null;
					}
				}
				func(file);
			}
			return this;
		}

		// --Style
		showModal() {
			this.filterInputElem().value = '';
			this.filterInputElem().focus();
			this.resetList();
			this.$modal().modal();
			return this;
		}
		hideModal() {
			this.$modal().modal('hide');
			return this;
		}

		// --DOM操作

		append(file) {
			// DOM
			this.appendElem(file);

			// ポインタ調整
			// 最初の要素と最後の要素はつなげる

			if (this.hasChild()) {
				this.lastChild().next(file);
				file.prev(this.lastChild());
			}
			file.parent(this);
			this.pushChild(file);
			return this;
		}
		appendElem(file) {
			this.elem().appendChild(file.elem());
			return this;
		}
		resetList() {
			this.emptyElem();
			this.each(function (file) {
				file.parent().appendElem(file);
			});
			return this;
		}
		// ファイルリストの内容をstrから始まる名前を持つファイル・ディレクトリのみに置き換える
		filter(str) {
			this.emptyElem();
			const regexp = new RegExp('^'+ str +'.*','i');
			this.each(function (file) {
				if (regexp.test(file.name())) {
					this.elem().appendChild(file.elem());
				}
			}.bind(this));
			if (this.elem().children.length === 0) {
				const li = document.createElement('li');
				li.textContent = '該当するファイルは見つかりませんでした。';
				this.elem().appendChild(li);
			}
			return this;
		}

		// ファイルリストをサーバーから読み込む
		read() {
			const userId = this.sentenceContainer().userId();
			Util.post("/tategaki/FileListMaker",{
				user_id: userId
			},function (json) {
				this.init(json);
			}.bind(this));
			return this;
		}
		openNextFile() {
			const currentFile = this.currentFile();
			const file = currentFile && currentFile.nextFile();
			if (file) {
				file.open();
			} else if(this.hasFile()) {
				this.firstFile().open();
			}
			return this;
		}
		openPrevFile() {
			const currentFile = this.currentFile();
			const file = currentFile && currentFile.prevFile();
			if (file) {
				file.open();
			} else {
				this.lastFile().open();
			}
			return this;
		}
		deleteFile(filename) {
			const files = this.findFile(filename);
			const fileLength = files.length;
			if (fileLength === 0) {
				this.sentenceContainer().userAlert('存在しないファイルです','red');
				return this;
			}
			if (fileLength === 1) {
				files[0].delete();
				return this;
			}
			if (fileLength > 0) {
				if (window.confirm('同一名のファイルが複数存在します。\nすべてのファイルを削除しますか。\nこのうちのどれかのファイルを削除する場合はキャンセルし、個別に削除してください。')) {
					for (let i = 0,file; file = files[i]; i++) {
						file.delete();
					}
				} else {
					console.log('[複数ファイル]削除できませんでした。:' + filename);
				}
			}
		}
		mkdir(dirname) {
			if (!dirname) return this;
			Util.post("/tategaki/DirectoryMaker",{
				user_id: this.sentenceContainer().userId(),
				directoryname: dirname,
				saved: Date.now()
			},function (data) {
				this.fileList().read();
			}.bind(this));
		}
		deleteDirectory(dirname,isForce) {
			const dirs = this.findDirectory(dirname);
			if (dirs.length === 0) return this;
			dirs[0].delete(isForce);
			return this;
		}
		moveFile(filename,dirname) {
			const files = this.findFile(filename);
			const dirs = this.findDirectory(dirname);
			if (files.length === 0 || dirs.length === 0) return this;
			files[0].move(dirs[0]);
			return this;
		}

		// --イベント

		addEventListenerOnInput() {
			// モーダルが開くと、検索欄にフォーカスが移動する
			this.$modal().on('shown.bs.modal',function (e) {
				this.filterInputElem().focus();
			}.bind(this));
			// ファイル検索欄
			this.filterInputElem().addEventListener('keyup',this.onKeyupOnInput.bind(this));
		}
		onKeyupOnInput(e) {
			let keycode;
			if (document.all) {
				// IE
				keycode = e.keyCode
			} else {
				// IE以外
				keycode = e.which;
			}
			if (keycode === 123) { return; } // F12のみブラウザショートカットキー
			if (keycode == 13) {
				// enter
				const file = this.findFile(this.filterInputElem().value)[0];
				if (file) {
					file.open();
				}
				this.hideModal();
				this.resetList();
			} else if (this.filterInputElem().value.length === 0) {
				this.resetList();
			} else {
				this.filter(this.filterInputElem().value);
			}
		}
	}

	window.SentenceContainer = class extends Sentence {
		constructor(userId,data) {
			super(document.getElementById('sentence_container'));
			if (data) this.init(data);
			this._userId = userId;
			this._titleElem = document.getElementById('file_title');
			this._searchInputElem = document.getElementById('search');
			this._userAlertElem = document.getElementById('user_info');
			this.addFileTitleEvent();
			this.addSelectEvent();
			this._cursor = new Cursor(this);
			this._inputBuffer = new InputBuffer(this);
			this._fileList = new FileList(this);
			this._command = new CommandLine(this);
			this._menu = new Menu(this);

			this.newFile();
		}
		// データの構築
		// ajax通信とのタイムラグを埋めるため、コンストラクタと切り離す
		init(data) {
			this.empty();
			// 文書情報
			this.filename(data.filename);
			this.fileId(data.fileId);
			this.saved(data.saved || (new Date(Date.now()).toLocaleDateString() + ' ' + new Date(Date.now()).toLocaleTimeString()).replace(/\//g,'-'));
			this._strLenOnRow = 40; // １行の文字数
			this._rowLenOnPage = 40; // １ページの行数
			// DOMの構築
			// if (window.container) window.container.empty();
			for (let paraData of data.data.text) {
				this.append(new Paragraph(paraData));
			}

			this.cursor().init();
			this.resetDisplay();
			this.breakPage().printInfo();
			this.addKeydownEventListener();
			this.addWheelEventListener();
			return this;
		}

		// --参照取得

		paragraphs(index) {
			return this.children(index);
		}
		firstRow() {
			return this.firstChild().firstChild();
		}
		lastRow() {
			return this.lastChild().lastChild();
		}
		// num行目のRowを取得する
		row(num) {
			if (num <= 0) return this.firstRow();
			let cnt = 0;
			for (let row = this.firstRow(); row; row = row.next()) {
				cnt++;
				if (cnt === num) return row;
			}
			return this.lastRow();
		}
		// numページ目の第一行目のRowを取得する
		pageRow(num) {
			if (num <= 0) return this.firstRow();
			let cnt = 0;
			for (let row = this.firstRow(); row; row = row.next()) {
				if (row.isPageBreak()) {
					cnt++;
					if (cnt === num) return row;
				}
			}
			return this.lastRow();
		}
		firstChar() {
			return this.firstRow().firstChild();
		}
		lastChar() {
			return this.lastEOL().prevChar();
		}
		lastEOL() {
			return this.lastRow().lastChild();
		}
		cursor() {
			return this._cursor;
		}
		cursorChar() {
			return this.cursor().getChar();
		}
		cursorRow() {
			return this.cursorChar().row();
		}
		inputBuffer() {
			return this._inputBuffer;
		}
		fileList() {
			return this._fileList;
		}
		command() {
			return this._command;
		}
		titleElem() {
			return this._titleElem;
		}
		searchInputElem() {
			return this._searchInputElem;
		}
		userAlertElem() {
			return this._userAlertElem;
		}
		menu() {
			return this._menu;
		}

		// --判定

		hasParagraph() {
			return this.hasChild();
		}

		// --参照操作

		pushParagraph(paragraph) {
			return this.pushChild(paragraph);
		}
		insertParagraph(pos,paragraph) {
			return this.insertChild(pos,paragraph);
		}
		deleteParagraph(paragraph) {
			return this.deleteChild(paragraph);
		}

		// --Status

		data() {
			const data = {};
			data.conf = {};
			const paraArr = [];
			for (let paragraph of this.paragraphs()) {
				paraArr.push(paragraph.data());
			}
			data.text = paraArr;

			return JSON.stringify(data);
		}
		userId() {
			return this._userId;
		}
		filename(newFilename) {
			if (newFilename === undefined) {
				return this._filename;
			} else {
				this._filename = newFilename;
				this.titleElem().value = newFilename;
				this.titleElem().dataset.filename = newFilename;
				return this;
			}
		}
		fileId(newId) {
			if (newId === undefined) {
				return this._fileId;
			} else {
				this._fileId = newId;
				this.titleElem().dataset.fileId = newId;
				return this;
			}
		}
		saved(newSaved) {
			if (newSaved === undefined) {
				return this._saved;
			} else {
				this._saved = newSaved;
				document.getElementById('saved').textContent = newSaved;
				return this;
			}
		}
		// 設定上の行内文字数
		strLenOnRow(newStrLen) {
			if (newStrLen === undefined) {
				return this._strLenOnRow;
			} else {
				this._strLenOnRow = newStrLen;
				return this;
			}
		}
		// 設定上のページ内行数
		rowLenOnpage(newRowLen) {
			if (newRowLen === undefined) {
				return this._rowLenOnPage;
			} else {
				this._rowLenOnPage = newRowLen;
				return this;
			}
		}
		// 全文字数
		countChar() {
			let cnt = 0;
			for (let paragraph of this.paragraphs()) {
				cnt += paragraph.countChar();
			}
			return cnt;
		}
		// 全行数
		countRow() {
			let cnt = 0;
			for (let paragraph of this.paragraphs()) {
				cnt += paragraph.childLength();
			}
			return cnt;
		}
		// 全ページ数
		countPage() {
			let cnt = 0;
			for (let row = this.firstRow(); row; row = row.next()) {
				if (row.isPageBreak()) cnt++;
			}
			return cnt;
		}

		// --Style

		width(useCache) {
			return super.height(useCache);
		}
		height(useCache) {
			return super.width(useCache);
		}
		removeClassAllChar(className) {
			for (let paragraph of this.paragraphs()) {
				paragraph.removeClassAllChar(className);
			}
			return this;
		}
		/*
		 * 字句検索
		 * 「/」で字句検索モードに入る
		 * search()に文字列を渡すと、渡された文字列を本文内から探し、見つかった文字列にsearch-wordクラスを付与する
		 * さらに、見つかった文字列の先頭文字にsearch-labelクラスを付与する
		 */
		search(str) {
			for (let paragraph of this.paragraphs()) {
				paragraph.search(str);
			}
			return this;
		}
		startSearchMode() {
			this.searchInputElem().classList.add('active');
			this.searchInputElem().focus();
			this.searchInputElem().value = '/';
			this.removeKeydownEventListener();
			if (!this._keyupOnSearchArg) {
				this._keyupOnSearchArg = this.onKeyupOnSearchMode.bind(this);
				this.searchInputElem().addEventListener('keyup',this._keyupOnSearchArg,false);
				this.searchInputElem().addEventListener('focusin',this.onFocusinOnSearchMode.bind(this));
				this.searchInputElem().addEventListener('focusout',this.onFocusoutOnSearchMode.bind(this));
			}
			return this;
		}
		stopSearchMode() {
			this.addKeydownEventListener();
			this.searchInputElem().value = '';
			this.searchInputElem().classList.remove('active');
			this.removeClassAllChar('search-label').removeClassAllChar('search-word');
			return this;
		}

		// selection
		// 選択範囲にあるCharを配列で返す
		selectChars(bl) {
			const ret = [];
			const selection = getSelection();
			if (this.selectText().length === 0) return ret; // rangeCount===0とすると、EOLのみ選択されることがある
			const selRange = selection.getRangeAt(0);
			for (let char = this.firstChar(); char; char = char.nextChar()) {
				if (char.isInRange(selRange)) ret.push(char);
			}
			selRange.detach();
			if (bl) selection.removeAllRanges(); // 選択を解除する
			return ret;
		}
		copySelectText() {
			localStorage.clipBoard = this.selectText();
			return this;
		}
		// ペースト
		pasteText() {
			console.log('paste:'+ localStorage.clipBoard);
			this.cursor().insert(localStorage.clipBoard);
			return this;
		}
		selectText() {
			const selection = getSelection();
			let ret = '';
			for (let i = 0,cnt = selection.rangeCount; i < cnt; i++) {
				const selRange = selection.getRangeAt(i);
				ret += selRange.toString();
			}
			return ret;
		}

		// --DOM操作関係

		// 子を空にする
		empty() {
			this.emptyElem();
			this.emptyChild();
			this.removeKeydownEventListener();
			this.removeWheelEventListener();
			if (this.inputBuffer().isDisplay()) {
				this.inputBuffer().empty().hide();
			}
			this.stopSearchMode();
			return this;
		}
		// TODO: 配列が渡されたらフラグメントを使ってappendする
		append(paragraph) {
			this.elem().appendChild(paragraph.elem());
			paragraph.container(this);
			if (!this.hasParagraph()) {
				this.pushParagraph(paragraph);
				return this;
			}
			// paragraph
			this.lastChild().next(paragraph);
			paragraph.prev(this.lastChild());
			// row
			const lastRow = this.lastChild().lastChild();
			lastRow.next(paragraph.firstChild());
			paragraph.firstChild().prev(lastRow);
			// char
			const lastChar = lastRow.lastChild();
			lastChar.next(paragraph.firstChild().firstChild());
			paragraph.firstChild().firstChild().prev(lastChar);

			this.pushParagraph(paragraph);
			return this;
		}
		// 文書情報を表示する
		// TODO: num -> pos
		printInfo() {
			document.getElementById('str_num').textContent = this.cursor().currentCharPos();
			document.getElementById('str_len').textContent = this.cursor().strLenOfRow();
			document.getElementById('row_num').textContent = this.cursor().currentRowPos();
			document.getElementById('row_len').textContent = this.cursor().rowLenOnPage();
			document.getElementById('page_num').textContent = this.cursor().currentPage();
			document.getElementById('page_len').textContent = this.countPage();
			return this;
		}

		// --文章整理

		// 指定文字数(strLenOnRow)と異なる文字数の行があれば調整する
		cordinate() {
			for (let paragraph of this.paragraphs()) {
				paragraph.cordinate();
			}
			return this;
		}
		// 禁則処理
		// 必ずcordinate()の後に行うこと
		checkKinsoku() {
			for (let paragraph of this.paragraphs()) {
				paragraph.checkKinsoku();
			}
			return this;
		}
		// 改ページ
		breakPage() {
			const pageNum = this.rowLenOnpage();
			// page-break
			let cnt1 = 0;
			for (let paragraph of this.paragraphs()) {
				for (let row of paragraph.rows()) {
					if (cnt1 === 0 || cnt1 % pageNum === 0) { // １行目とpageNumの倍数行目
						row.addClass('page-break');
					} else {
						row.removeClass('page-break');
					}
					cnt1++;
				}
			}
			// page-last-row
			let cnt2 = 0;
			const lastRow = this.countRow() -1;
			for (let paragraph of this.paragraphs()) {
				for (let row of paragraph.rows()) {
					if ((cnt2 + 1) % pageNum === 0 || cnt2 === lastRow) { // (pageNumの倍数-1)行目と最終行
						row.addClass('page-last-row');
					} else {
						row.removeClass('page-last-row');
					}
					cnt2++;
				}
			}
			return this;
		}
		userAlert(str,color) {
			this.userAlertElem().textContent = str;
			if (color) this.userAlertElem().style.color = color;
			else this.userAlertElem().style.color = '';
			return this;
		}

		// --ファイル操作

		readFile(fileId) {
			const file = this.fileList().findFile(fileId)[0];
			file.open();
			return this;
		}
		saveFile() {
			if (this.fileId() === -1) {
				this.saveAsFile();
				return this;
			}
			this.userAlert('保存中');
			Util.post('/tategaki/WriteJsonFile',{
				user_id: this.userId(),
				file_id: this.fileId(),
				filename: this.filename(),
				json: this.data(),
				saved: Date.now()
			},function (json) {
				this.saved(json.strDate).userAlert('保存しました');
				this.fileList().read();
			}.bind(this));
			return this;
		}
		// 名前をつけて保存
		saveAsFile(filename) {
			Util.post('/tategaki/FileMaker',{
				filename: filename,
				user_id: this.userId(),
				saved: Date.now()
			},function (data) {
				this.filename(data.filename).fileId(data.newFileId);
				const file = new File(data.newFileId,data.filename);
				this.fileList().append(file).chainFile();
				this.saveFile();
			}.bind(this));
			return this;
		}
		newFile(filename) {
			if (filename === undefined) filename = 'newfile';
			this.init({
				fileId: -1,
				filename: filename,
				data: {
					text:[[[],[]]]
				}
			}); // 空段落のデータ
			return this;
		}

		// --Display関係

		resetDisplay() {
			console.time('display');
			this.addDisplay(0,0);
			console.timeEnd('display');
			return this;
		}
		// strPos: 'center','right'
		changeDisplay(isForce,opt_pos) {
			const cursorChar = this.cursorChar();
			if (!isForce && cursorChar.isDisplay() && cursorChar.row().isDisplay()){
				return this;
			}
			console.time('change display');
			const rowPos = this.computeDisplayRowPos(opt_pos);
			const charPos = cursorChar.row().computeDisplayCharPos();
			this.addDisplay(rowPos,charPos);
			console.timeEnd('change display');
			return this;
		}
		// firstRow行目以降を表示する。文字はfirstChar文字目以降
		addDisplay(firstRow,firstChar) {
			const dispWidth = this.width();
			const cache = {};
			let cnt = 0; // 総行数をカウントする
			let sum = 0; // 表示行の幅合計
			for (let paragraph of this.paragraphs()) {
				for (let row of paragraph.rows()) {
					if (cnt < firstRow) {
						row.display(false);
						cnt++;
						continue;
					}
					// 行の幅は子の最大のフォントによって決まると考え、最大フォントごとの行幅をキャッシュする(レンダリング頻度の削減)
					const maxFont = row.maxFont();
					if (cache[maxFont]) {
						const rowWidth = cache[maxFont];
						sum += rowWidth + 2; // 2はボーダーの幅
					} else {
						cache[maxFont] = row.width();
						const rowWidth = cache[maxFont];
						sum += rowWidth + 2; // 2はボーダーの幅
					}
					row.display((sum < dispWidth),firstChar);
					cnt++;
				}
			}
			return this;
		}
		// opt_pos: 'center'なら、カーソル位置を中央にする
		// 'right'なら、カーソル位置を最も右にする
		computeDisplayRowPos(opt_pos) {
			const currentFirst = this.firstDisplayRowPos();
			const cursorIndex = this.cursorRowPos();
			const currentEnd = this.lastDisplayRowPos();

			// カーソル位置を中央にする
			// HACK:計算前のdisplayの数を基準にするので、フォントの大きさなどによってずれもありうる
			if (opt_pos === 'center') {
				const harfRange = (currentEnd - currentFirst)/2;
				const ret = cursorIndex - harfRange;
				return ret >= 0 ? ret : 0;
			} else if (opt_pos === 'right') {
				return cursorIndex;
			}

			if (cursorIndex < currentFirst) {
				// カーソルが前にある
				return cursorIndex;
			} else if (cursorIndex > currentEnd) {
				// カーソルが後ろにある
				return currentFirst + (cursorIndex - currentEnd);
			} else {
				// displayに囲まれた部分にdisplayでない行がある場合
				// 途中行数変化
				return currentFirst;
			}
		}
		firstDisplayRowPos() {
			let cnt = 0;
			for (let paragraph of this.paragraphs()) {
				for (let row of paragraph.rows()) {
					if (row.isDisplay())
						return cnt;
					cnt++;
				}
			}
			return -1;
		}
		lastDisplayRowPos() {
			for (let row = this.lastRow(),cnt = this.countRow() -1; row; row = row.prev(),cnt--) {
				if (row.isDisplay()) return cnt;
			}
			return -1;
		}
		cursorRowPos() {
			const cursorRow = this.cursor().getChar().row();
			let cnt = 0;
			for (let paragraph of this.paragraphs()) {
				for (let row of paragraph.rows()) {
					if (row === cursorRow)
						return cnt;
					cnt++;
				}
			}
			return -1;
		}
		firstDisplayRow() {
			for (let paragraph of this.paragraphs()) {
				for (let row of paragraph.rows()) {
					if (row.isDisplay()) return row;
				}
			}
			return null;
		}
		lastDisplayRow() {
			for (let row = this.lastRow(); row; row = row.prev()) {
				if (row.isDisplay()) return row;
			}
			return null;
		}

		shiftRightDisplay() {
			const charPos = this.cursorRow().computeDisplayCharPos();
			const firstDisplay = this.firstDisplayRow();
			if (!firstDisplay.prev()) { return this; }
			firstDisplay.prev().display(true,charPos);
			this.lastDisplayRow().display(false);
			return this;
		}
		shiftLeftDisplay() {
			const charPos = this.cursorRow().computeDisplayCharPos();
			const lastDisplay = this.lastDisplayRow();
			if (!lastDisplay.next()) { return this; }
			lastDisplay.next().display(true,charPos);
			this.firstDisplayRow().display(false);
			return this;
		}

		// --イベント

		// keydown
		addKeydownEventListener() {
			this.inputBuffer().removeKeydownEventListener()
				.convertContainer().removeKeydownEventListener();
			super.addKeydownEventListener();
			return this;
		}
		runKeydown(e,keycode) {
			this.userAlert('');
			if (e.ctrlKey) return this.runControlKeyDown(e,keycode);

			switch (keycode) {
				case 8:
					// backspace
					this.cursor().backSpace();
					break;
				case 13:
					// Enter
					this.cursor().lineBreak();
					break;
				case 32:
					// space
					this.cursor().insert('　');
					break;
				case 37:
					// Left
					this.cursor().moveLeft(e.shiftKey);
					break;
				case 38:
					// Up
					this.cursor().movePrev(e.shiftKey);
					break;
				case 39:
					// Right
					this.cursor().moveRight(e.shiftKey);
					break;
				case 40:
					// Down
					this.cursor().moveNext(e.shiftKey);
					break;
				case 58: // firefox developer edition
				case 186: // chrome
					// :
					this.command().start();
					break;
				case 188:
					// ,
					console.log(this);
					break;
				case 191:
					// /
					this.startSearchMode();
					break;
				default:
					this.inputBuffer().transfer(keycode,e.shiftKey);
					break;
			}
			return this;
		}
		runControlKeyDown(e,keycode) {
			switch (keycode) {
				case 67:
					// c
					this.copySelectText();
					break;
				case 18:
				case 70:
					// f
					this.fileList().showModal();
					break;
				case 72:
					// h
					this.cursor().moveLeft(e.shiftKey);
					break;
				case 73:
					// i
					this.fileList().openNextFile();
					break;
				case 74:
					// j
					this.cursor().moveNext(e.shiftKey);
					break;
				case 75:
					// k
					this.cursor().movePrev(e.shiftKey);
					break;
				case 76:
					// l
					this.cursor().moveRight(e.shiftKey);
					break;
				case 79:
					// o
					this.fileList().openPrevFile();
					break;
				case 83:
					// s
					this.saveFile();
					break;
				case 86:
					// v
					this.pasteText();
					break;
				case 188:
					// ,
					this.cursor().nextSearch();
					break;
				case 190:
					// .
					this.cursor().prevSearch();
					break;
				default:
					break;
			}
			return this;
		}

		// wheel
		runWheel(e,isUp) {
			const mvRowNum = 4; // 一度に動かす行数
			if (isUp) {
				for (let i = 0; i < mvRowNum; i++) { this.shiftRightDisplay(); }
			} else {
				for (let i = 0; i < mvRowNum; i++) { this.shiftLeftDisplay(); }
			}
			return this;
		}

		// 語句検索
		onKeyupOnSearchMode(e) {
			let keycode;
			if (document.all) {
				// IE
				keycode = e.keyCode
			} else {
				// IE以外
				keycode = e.which;
			}
			if (keycode === 13) {
				// enter
				this.searchInputElem().blur(); // enterを押しただけではフォーカスが外れない
				return;
			}

			// $findの中身が空になればfindモードを完全に終了する
			if (this.searchInputElem().value === '') {
				this.searchInputElem().blur();
				this.stopSearchMode();
				return;
			}

			this.search(this.searchInputElem().value.slice(1));
		}
		onFocusoutOnSearchMode() {
			this.addKeydownEventListener();
		}
		onFocusinOnSearchMode() {
			this.removeKeydownEventListener();
		}

		// ファイル名input
		addFileTitleEvent() {
			this.titleElem().addEventListener('focusin',function (e) {
				if (this.inputBuffer().isDisplay) { this.inputBuffer().empty().hide(); }
				this.removeKeydownEventListener();
			}.bind(this),false);
			this.titleElem().addEventListener('focusout',function (e) {
				if (this.titleElem().value === '') {
					this.userAlert('ファイル名が入力されていません','red');
					this.titleElem().value = this.titleElem().dataset.filename;
				}
				this.addKeydownEventListener();
			}.bind(this),false);
		}

		// selection
		addSelectEvent() {
			this.elem().addEventListener('mouseup',function (e) {
				const selChars = this.selectChars();
				// 選択範囲の直後にカーソルを当てる
				if (selChars.length > 0) {
					const lastCharOnSelect = selChars[selChars.length -1];
					const newCursor = lastCharOnSelect.hasNextSibling() ? lastCharOnSelect.next() : lastCharOnSelect;
					newCursor.addCursor().setPosMemory();
				}
			}.bind(this),false);
		}
	}

})();
container = new SentenceContainer(globalUserId); // グローバルオブジェクト
