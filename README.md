# TategakiEditor
ブラウザから縦書きで表示し、サーバーにテキストを保存、編集できるプログラムです。
また、ショートカットキーや簡易的なコマンドもあり、MSワードでは上下にページがスクロールするのに対し、このプログラムでは。左右にページがスクロールします。

## Requirements
MySQLを利用

## Installation
1. MySQLの情報を設定
     init.propertiesファイルのdatabase-name, database-user, database-passwordをそれぞれ使用するデータベース名、ユーザー名、パスワードに書き換える

2. cloneしたディレクトリから以下のコマンドの実行してtomcatサーバーを起動
    ```
    $ cd tategaki-editor
    $ ./gradlew tRW
    ```

3. webブラウザからURLにhttp://localhost:8100/tategaki-editorを指定してアクセス
    ※localhost、8100の部分は設定や利用方法により異なる

4. ログイン画面下部にある新規登録からアカウントを作成して利用してください

## Usage
* ショートカットキー

       * \<CTL-J\>  カーソル移動[Down]
       * \<CTL-K\>  カーソル移動[Up]
       * \<CTL-L\>  カーソル移動[Right]
       * \<CTL-H\>  カーソル移動[Left]
       * \<CTL-D\>  カーソルの前にある文字を１文字削除[BackSpace]
       * \<CTL-S\>  ファイルを上書き保存
       * \<CTL-I\>  次のファイルを開く
       * \<CTL-O\>  前のファイルを開く
       * \<CTL-F\>  「ファイルを開く」ダイアログを開く
       * \<CTL-,\>  次の検索語句に進む
       * \<CTL-.\>  前の検索語句に進む
       * \<\\\>  語句検索を開始する
       * \<CTL-C\>  選択範囲をコピー
       * \<CTL-V\>  ペースト

* コマンド（「：」キーで開始）
       * \<:(w|s|save)\>                            ファイルを上書き保存
       * \<:(w|s|save) ファイル名\>                  名前をつけて保存
       * \<:(o|open|e|n(ew)?)\>                    「newfile」という名前でファイルを新規作成する
       * \<:(o|open|e) ファイル名\>                  ファイルを開く
       * \<:n(ew)? ファイル名\>                    「ファイル名」という名前でファイルを新規作成する
       * \<:(jr|jumpr|jumprow) [1-9]+[0-9]*\>       (指定した数値)行目にジャンプする
       * \<:(jp|jumpp|jumppage) [1-9]+[0-9]*\>     （指定した数値)ページ目の１行目にジャンプする
       * \<:(d|del|delete)\>                         今開いているファイルを削除する
       * \<:(d|del|delete) ファイル名\>            「ファイル名」という名前のファイルを削除する
       * \<:next\>                                   次のファイルを開く
       * \<:prev\>                                   前のファイルを開く
       * \<:(t|title|name) ファイル名\>              現在開いているファイルの名前を「ファイル名」に変更する(これだけでは保存されません)
       * \<:mkdir ディレクトリ名\>                 「ディレクトリ名」という名前でディレクトリを作成する
       * \<:mv ファイル名 ディレクトリ名\>         「ファイル名」を「ディレクトリ名」の中に移動する
       * \<:deldir ディレクトリ名\>                  ディレクトリ「ディレクトリ名」を削除する
       * \<:noh\>                  							語句検索を終了する
