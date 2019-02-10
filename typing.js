document.onkeydown = typeGame; //キー押下時に関数tpypeGame()を呼び出す
document.onkeyup = shiftUp;
//文字を格納する配列(keyCodeの並び順と同じ並びにする)
var upperElement = ["A", "B", "C", "D", "E", "F", "G", "H", "I",
    "J", "K", "L", "M", "N", "O", "P", "Q", "R",
    "S", "T", "U", "V", "W", "X", "Y", "Z",
    " ", "_", "+", "\|", "~", "{", "}", ":", "\"", "<", ">", "?",
    ")", "!", "@", "#", "$", "%", "^", "&", "*", "(",
];
var lowerElement = ["a", "b", "c", "d", "e", "f", "g", "h", "i",
    "j", "k", "l", "m", "n", "o", "p", "q", "r",
    "s", "t", "u", "v", "w", "x", "y", "z",
    " ", "-", "=", "\\", "\`", "[", "]", ";", "'", ",", ".", "/",
                    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9","↲",
];
//キーコードを格納する配列(upper/lowerElementと同じ並びにする)
var keyCode = [65, 66, 67, 68, 69, 70, 71, 72, 73,
    74, 75, 76, 77, 78, 79, 80, 81, 82,
    83, 84, 85, 86, 87, 88, 89, 90,
    32, 189, 187, 220, 192, 219, 221, 186, 222, 188, 190, 191,
               48, 49, 50, 51, 52, 53, 54, 55, 56, 57,13,
];
//問題文字列の文字が大文字か小文字かを区別するためのフラグ
var shiftFlg = [];

//inputKeycode ==keyCode[ elementIndex[0] ]みたいに使う
//つまり、keyCode配列の添字として使う。
var elementIndex = [];

//グローバル変数群
var typStrings = ""; //問題の文字列すべてを格納
var cnt = 0; //何文字目かを格納
var miss = 0; //ミスタイプの数
var typStart, typEnd; //開始時と終了時の時刻を格納
var ans = 0; //回答数
var typStringsLength = 0; //問題文の長さ
var nowGaming = false; //ゲーム中かどうかフラグ
var gameSetFlag = false; //ゲームを最後までやったかフラグ
var shiftCheck = 0; //シフトが押された状態かを区別する
//dat配列にMessageを一文字ずつ格納していく関数
var dat = [];

function createDat() {
    tojavascript = tojavascript .replace(/&lt;/g, '<') .replace(/&gt;/g, '>') .replace(/&quot;/g, '"') .replace(/&#039;/g, '\'') .replace(/&#044;/g, ',') .replace(/&amp;/g, '&').replace(/\r\n/g, "↲").replace(/(\n|\r)/g, "↲").replace(/\t/g, "    ");
    for (var i = 0; i < tojavascript.length; i++) {
        dat[i] = tojavascript.charAt(i);
    }
}

//問題の文字列をキーボード番号に対応させる。
function mapTypStrings(typStrings) {
    shiftUp();
    for (var i = 0; i < typStrings.length; i++) {
        //問題の文字列のi番目の文字を探すためにserchに文字を格納する。
        var serch = typStrings.charAt(i);
        console.log(serch + "をserchします");
        //これでアクセスできるやん
        //        console.log("test : "+ element[i]['upperElement']);
        //serchが大文字の要素の何番目にあるかを探し、
        //後にkeyCodeの添字として使うためにelementIndex配列に格納していく。
        elementIndex[i] = lowerElement.indexOf(serch);
        if (elementIndex[i] != -1) {
            shiftFlg[i] = 0;
            console.log("elementIndexが見つかりました : " + elementIndex[i] + "shiftflg : " + shiftFlg[i]);
        }
        //見つからない場合は-1を返す→大文字の要素の方から探す。
        if (elementIndex[i] < 0) {
            elementIndex[i] = upperElement.indexOf(serch);
            shiftFlg[i] = 1;
            console.log("見つからないのでUpperから探しelementindexは : " + elementIndex[i] + "shiftflg : " + shiftFlg[i]);
        }
    }
}
//表示の方法を検討
//TODO改行の連続する箇所、<tr>が抜けるはずだが何故かうまく表示されている
//TODO ゲーム性
function showtypStrings(typStrings) {

    //htmlには問題文にタグを付けて送る。
    var decolatedTypString = "<table class='Q'>";
    decolatedTypString += "<tr>";
    //内側のループで一文字ずつにタグをつける。
    for(let c in typStrings){
        if( typStrings[c] == '↲' ){
            decolatedTypString += "<td id='word" + c + "'>" + typStrings[c] + "</td>" + "</tr>";                                
        }else{
            decolatedTypString += "<td id='word" + c + "'>" + typStrings[c] + "</td>";                
       }         
    }
    decolatedTypString += "</table>";
    document.getElementById("typstring").innerHTML = decolatedTypString;
}

//タイピングゲームの問題をセットする関数
function gameSet() {
    window.focus();
    nowGaming = true; //ゲーム中になる
    gameSetFlag = false; //ゲーム中になる
    //問題文とカウント数をクリアする
    cnt = 0;
    miss = 0;
    typStrings = "";
    //問題文の作成
    createDat();
    //typStringsにつなげる。
    for (var i = 0; i < dat.length; i++) {
        //typStrings = typStrings + dat[i]['c_word'];
        //phpから受け取った文字列を配列に１文字ずつ格納したものをtypStringsに格納する
        typStrings = typStrings + dat[i];
    }
    //作成された問題文の文字がそれぞれelementの何番目かをelementIndex配列に格納していく。
    mapTypStrings(typStrings);
    //終了判定のために問題文の長さを格納する。
    typStringsLength = typStrings.length;
    //問題枠に表示する
    showtypStrings(typStrings);
}

//受け取ったcssIDの文字色を点滅させる。のは後でやる。
var flg = true;
//var countBlink = 0;
var nextIdName = 0;

//shiftが押された場合は1を返す。
function shiftDwn() {
    if (event.keyCode == '16') {
        shiftCheck = 1;
    }
    console.log("shiftCheck : " + shiftCheck);
}

//document.onkeyupで呼ばれる関数。キーが離されたときに呼ばれる。
//shiftが離された場合は0を返す。
function shiftUp() {
    if (event.keyCode == '16') {
        shiftCheck = 0;
    }
    console.log("shiftCheck : " + shiftCheck);
}
//キー入力を受け取る関数
function typeGame(evt) {
    var inputKeycode; //入力されたキーコードを格納する変数

    //点滅のカウントをクリア
    countBlink = 0;

    //入力されたキーのキーコードを取得
    if (document.all) {
        inputKeycode = event.keyCode;
    } else {
        inputKeycode = evt.which;
    }
    //シフトが押されたらshiftCheckを1にする。
    shiftDwn();
    //スペースが押されたらゲームスタート
    if (inputKeycode == '32' && !nowGaming) gameSet();
    //rが押されたらリスタート
    if (inputKeycode == '82' && gameSetFlag) gameSet();
    //ゲーム中にescが押されたらリスタート
    if (inputKeycode == '27' && nowGaming) gameSet();
    console.log("inputKeycode is : " + inputKeycode);
    //入力されたキーコードと、問題文のキーコードを比較
    if (inputKeycode == keyCode[elementIndex[cnt]] && shiftCheck == shiftFlg[cnt]) {
        //キーコードが一致した時の処理

        //最初の1文字が入力された時間を記録する
        if (cnt == 0) {
            typStart = new Date();
        }

        //入力されたセルの文字色を黒色にする
        var idName = "word" + cnt;
        document.getElementById(idName).style.color = "#370f29";
        document.getElementById(idName).style.background = "#370f29";

        //次の文字は赤くする。
        nextIdName = "word" + (cnt + 1);
        if ((cnt + 1) < typStringsLength) {
            document.getElementById(nextIdName).style.color = "#370f29";
            document.getElementById(nextIdName).style.background = "#21f838";
        }
        cnt++; //カウント数を＋１にする

        //全文字入力したか確認
        if (cnt < typStringsLength) {

            //問題枠に表示する
            document.getElementById("stopwatch").innerHTML = "STATUS<br>" + "ALL : " + typStringsLength + " Collect : " + cnt +
                " left : " + (typStringsLength - cnt) + " miss : " + miss;

        } else {
            //全文字入力していたら、終了時間を記録する
            typEnd = new Date();

            //終了時間－開始時間で掛かったミリ秒を取得する
            var keika = typEnd - typStart;

            //1000で割って「切捨て」、秒数を取得
            var sec = Math.floor(keika / 1000);

            //1000で割った「余り(%で取得できる）」でミリ秒を取得
            var msec = keika % 1000;

            //問題終了を告げる文字列を作成
            var fin = "finish ： " + sec + " sec " + msec + " m ";

            //ゲームセットの判定
            gameSetFlag = true;

            //問題枠にゲーム終了を表示
            document.getElementById("typstring").innerHTML = fin;
            document.getElementById("stopwatch").innerHTML = "STATUS<br>" + "ALL : " + typStringsLength + " Collect : " + cnt + " left : " + (typStringsLength - cnt) + " miss : " + miss;

        }
    } else { //不正解の場合はここにelse
        if (cnt !== 0 && gameSetFlag !== true) miss++;
        document.getElementById("stopwatch").innerHTML = "STATUS<br>" + "ALL : " + typStringsLength + " Collect : " + cnt + " left : " + (typStringsLength - cnt) + " miss : " + miss;
    }
}
