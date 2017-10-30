<?php
if(!empty($_POST)){
header("Location:{$_SERVER['REQUEST_URI']}");
}
?>
<DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8" />
        <title>typingmachine</title>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <div class="container">
            <div id="typstring">Text is empty. Please create.</div>
        <div id="stopwatch">STATUS<br>ALL : 0 Collect : 0 left : 0 miss : 0</div>
            <!-- フォーム -->
            <form method="POST" action="index.php">
                <!-- 時刻表示 -->
                <div id="time">
                    <?php
                      $date = date("Y/m/d H:i:s");
                ?>
                </div>
                <div id="name">
                    <label for="name">Name:</label>
                    <input id="name" name="name" />
                </div>
                <div>
                    <label for="message">input practice text and push create</label>
                    <textarea id="message" name="message"></textarea>
                </div>
                    <button type="submit">create</button>
        <button type="button" onClick="gameSet()" name="startGame" value="start">
            <font>Press Space to start</font>
    </button>
            </form>
        </div>
        <!-- 接続 -->
        <?php
//mysqliクラスのオブジェクトを作成
        require_once(dirname ( __FILE__ ).'/../cfg.php');
if($_SERVER['SERVER_NAME'] == "localhost") {
    //ローカルの接続設定
    $mysqli = new mysqli($db['host'], $db['username'], $db['password'], $db['database']);
  } else {
      //XREAサーバの接続設定
      $mysqli = new mysqli($db['X_host'], $db['X_username'], $db['X_password'], $db['X_database']);
  }
//エラーが発生したら
if ($mysqli->connect_error){
  print("接続失敗：" . $mysqli->connect_error);
  exit();
}
?>
            <!-- Insertの例 -->
            <?php
//プリペアドステートメントを作成　ユーザ入力を使用する箇所は?にしておく
$stmt = $mysqli->prepare("INSERT INTO datas (name, message) VALUES (?, ?)");
//$_POST["name"]に名前が、$_POST["message"]に本文が格納されているとする。
//?の位置に値を割り当てる
$stmt->bind_param('ss', $_POST["name"], $_POST["message"]);
//実行
$stmt->execute();
?>
                <div id="result">
                    <!-- SELECTの例 -->
                    <?php
//datasテーブルから日付の降順でデータを取得
        //変更--最新のテキストデータをjavascript に渡すためDESCを外す
$result = $mysqli->query("SELECT * FROM datas ORDER BY created");
if($result){
  //1行ずつ取り出し
  while($row = $result->fetch_object()){
    //エスケープして表示
    $name = htmlspecialchars($row->name);
    $message = htmlentities($row->message);
  }
}
  //javascript<->PHP間の変数受け渡しテスト
//改行をなくす
$message =str_replace(array("\r\n","\r","\n"), '', $message);
//バックスラッシュをエスケープ
$message = str_replace("\\", "\\\\", $message);
//ダブルクウォートをエスケープ(javascriptに渡すときにダブルクウォートで囲っているため)
//$tojavascript = str_replace("\"", "\\\"", $tojavascript1);
//scriptはこの後に書かないと変数を渡せないようだ
$tojavascript = $message;
?>
                        <!-- 切断 -->
                        <?php
$mysqli->close();
?>
                        <script type="text/javascript">
                            //外部javascriptに渡す文字列(グローバル変数になる)
                            var tojavascript = "<?php echo $tojavascript; ?>";
                        </script>
                        <script type="text/javascript" src="typing.js">
                        </script>
    </body>
    </html>