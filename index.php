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
            <div id="typstring"></div>
            <div id="time"></div>
        </div>
        <button type="button" onClick="gameSet()" name="startGame" value="start">
            <font>Press Space </font>
    </button>
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
             <input  id="name" name="name" />
           </div>

        <div>
                <label for="message">practice text</label>
                <textarea id="message" name="message"></textarea>
            </div>
            <div class="button">
                <button type="submit">Send</button>
            </div>
        </form>
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
    $message = htmlspecialchars($row->message);
    $messagenl = nl2br($message);
    $created = htmlspecialchars($row->created);
//    print("$created : $name<br> $messagenl<br>");
  }
}
  //javascript<->PHP間の変数受け渡しテスト
$tojavascript = str_replace(array("\r\n","\r","\n"), ' ', $message);
//scriptはこの後に書かないと変数を渡せないようだ
?>
                </div>
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