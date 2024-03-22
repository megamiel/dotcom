document.getElementById("evalButton").addEventListener("click", () => {
    var divElement = document.getElementById("evalDiv");
    var name = document.getElementById("evalName").value;
    if (name == "") {
        divElement.innerHTML = "";
        return;
    }
    divElement.innerHTML = "<div class='centering'><p>データ取得中...</p></div>";
    document.getElementById("loanName").value = name;
    var canvasDiv = document.getElementsByClassName("canvas")[0];
    canvasDiv.innerHTML = "";
    var recentDiv = document.getElementsByClassName("recent")[0];
    recentDiv.innerHTML = "";

    const apiURL = 'https://script.googleusercontent.com/macros/echo?user_content_key=BOGdYm1y3kE77zyKdhnsRfW5T6buYk8z8GlynOB2Fq0oIEtRLwPdrpuQEZ6jnY0Bc42H-nBJpBz3TEYuKZ1aKwyWQwRMBcicm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnBEac8yhMX_UGTRK0AmiD8wOBJ35tBimKZrrn5UGOz62eovfTyB1c6F0y4wx9TsrkmGJSNT4kJlBMnzlTuB8tvJ_6xO983bD7tz9Jw9Md8uu&lib=MMcLF4_2FiLZJ-kSjkX5mU7SAidacjQG-';

    loadData();
    async function loadData() {
        const response = await fetch(apiURL);
        const data = await response.json();
        var datas = { 情報セキュリティ: [], 経営戦略: [], データベース: [], プロジェクトマネジメント: [], サービスマネジメント: [], 組込みシステム開発: [] };
        data.forEach(entry => {
            if (name == entry.name && entry.subject != "午前問題") {
                datas[entry.subject].push(entry.score);
            }
        });
        var recentSubjects = [];
        var recentScores = [];
        var recentTotalScore = 0;
        for (var i = data.length - 1; i >= 0; i--){
            var ename = data[i].name;
            var esubject = data[i].subject;
            var escore = data[i].score;
            if (name==ename&&esubject!="午前問題"&&!recentSubjects.includes(esubject)) {
                recentSubjects.push(esubject);
                recentScores.push(escore);
                recentTotalScore += Math.floor(escore / 0.5) / 10;
            }

            if (recentSubjects.length == 5) {
                break;
            }
        }
        // datasの情報セキュリティからfor文で数値データを算出し、順位付け、分析結果文章を作成し、出力
        // 試験回数
        // 合計点
        // 平均点
        // 最高点
        // 最低点
        // 標準偏差
        // 最近側の点数が影響しやすい計算方法の点数
        var evalDatas = { 情報セキュリティ: [], 経営戦略: [], データベース: [], プロジェクトマネジメント: [], サービスマネジメント: [], 組込みシステム開発: [] };
        Object.keys(datas).forEach(key => {
            var array = datas[key];
            var num = array.length;
            var total = 0;
            var average = 0;
            var max = 0;
            var min = 100;
            var newScore = 0;
            const sColorStyle="color: transparent;background: linear-gradient(0deg, #58c6ff 0%, #076ad9 40%, #ff3bef 80%);-webkit-background-clip: text;-webkit-text-fill-color: transparent"
            const judgeColorStyles = ["color: transparent;background: linear-gradient(0deg, #B67B03 0%, #DAAF08 45%, #FEE9A0 70%, #DAAF08 85%, #B67B03 90% 100%);   -webkit-background-clip: text;-webkit-text-fill-color: transparent","color: transparent;	background: repeating-linear-gradient(0deg, #757575 0%, #9E9E9E 45%, #E8E8E8 70%, #9E9E9E 85%, #757575 90% 100%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;","color:violet","color:#0067C0","color:green","color:brown"];
            array.forEach(score => {
                total += score;
                if (max < score) {
                    max = score;
                }
                if (min > score) {
                    min = score;
                }
                if (newScore == 0) {
                    newScore = score;
                } else {
                    newScore = newScore * 0.7 + score * 0.3;
                }
            });
            if (num > 0) {
                average = total / num;
            }
            var deviationSum = 0;
            array.forEach(score => {
                deviationSum += (score - average) * (score - average);
            });
            var standardDeviation = Math.sqrt(deviationSum / num);
            var passJudge = "<div class='textCentering'>合格判定:null</div>";
            if (newScore >= 90) {
                passJudge = "<div class='textCentering' style='"+sColorStyle+"'>合格判定:S</div>";
            } else {
                for (var i = 0; i < 6; i++){
                    if (newScore >= 80 - i * 10) {
                        passJudge="<div class='textCentering' style='"+judgeColorStyles[i]+"'>合格判定:" + String.fromCharCode("A".charCodeAt(0) + i) + "</div>";
                        break;
                    }
                }
            }
            evalDatas[key].push(num, total, average, max, min, standardDeviation, newScore, passJudge);
        });

        var favorite = "情報セキュリティ";
        var weak = "情報セキュリティ";
        Object.keys(evalDatas).forEach(key => {
            if (key != "情報セキュリティ") {
                if (evalDatas[favorite][6] < evalDatas[key][6]) {
                    favorite = key;
                } else if (evalDatas[weak][6] > evalDatas[key][6]) {
                    weak = key;
                }
            }
        });

        divElement.innerHTML = '<div class="marginTopHalf"><div class="fuchidori"><div class="blueLine"><h2>' + name + 'の科目ごとの分析/評価</h2></div></div></div>';

        Object.keys(evalDatas).forEach(key => {
            var subjectElement = document.createElement("h2");
            if (key == favorite) {
                subjectElement.innerHTML = '<span style="color: #0083ce">' + key + '</span>';
            } else if (key == weak) {
                subjectElement.innerHTML = '<span style="color: #ff0000">' + key + '</span>';
            } else {
                subjectElement.innerHTML = '<span style="color: orange">' + key + '</span>';
            }
            divElement.appendChild(subjectElement);
            var elements = document.createElement("h1");
            elements.innerHTML = "<div class='textCentering'>試験回数:" + evalDatas[key][0] + "回</div>";
            elements.innerHTML += "<div class='textCentering'>平均点　:" + Math.floor(evalDatas[key][2] * 10) / 10.0 + "</div>";
            elements.innerHTML += "<div class='textCentering'>最高点　:" + Math.floor(evalDatas[key][3] * 10) / 10.0 + "</div>";
            elements.innerHTML += "<div class='textCentering'>最低点　:" + Math.floor(evalDatas[key][4] * 10) / 10.0 + "</div>";
            elements.innerHTML += "<div class='textCentering'>標準偏差:" + Math.floor(evalDatas[key][5] * 10) / 10.0 + "</div>";
            elements.innerHTML += "<div class='textCentering'>総合評価:" + Math.floor(evalDatas[key][6] * 10) / 10.0 + "</div>";
            elements.innerHTML += evalDatas[key][7];
            elements.innerHTML += "<div class='marginBottomQuarter'></div>";
            divElement.appendChild(elements);
            var evalTextElement = document.createElement("h1");
            evalTextElement.innerHTML = "<div class='centering'>分析結果</div>"
            divElement.appendChild(evalTextElement);

            var evalElement = document.createElement("p");
            if (evalDatas[key][5] > 15) {
                evalElement.innerHTML += "<div class='centering'>点数の上下が激しく、不安定です</div>";
            } else if (evalDatas[key][5] > 10) {
                evalElement.innerHTML += "<div class='centering'>点数が一定で収束しており、安定しています</div>";
            } else {
                evalElement.innerHTML += "<div class='centering'>平均点とほぼ同じ点数を継続して取り続けています</div>";
            }
            if (evalDatas[key][6] > evalDatas[key][2]) {
                evalElement.innerHTML += "<div class='centering'>初期の頃と比べ、得点率に成長が見られます</div>";
            } else if (evalDatas[key][6] + 10 < evalDatas[key][2]) {
                evalElement.innerHTML += "<div class='centering'>初期の頃と比べ、得点率が低下しています</div>";
            } else {
                evalElement.innerHTML += "<div class='centering'>初期の頃と得点率に変わりが見られません</div>";
            }
            if (key == favorite) {
                evalElement.innerHTML += "<div class='centering'>あなたが最も得意としている科目です</div>";
            } else if (key == weak) {
                evalElement.innerHTML += "<div class='centering'>あなたが最も苦手としている科目です</div>";
            }

            evalElement.innerHTML += "<div class='marginBottomHalf'></div>";
            divElement.appendChild(evalElement);

            var canvas = document.createElement("canvas");
            canvas.width = 800;

            var count = [];
            for (var i = 0; i < datas[key].length; i++) {
                count.push(i + 1);
            }

            new Chart(canvas, {
                type: 'line',
                data: {
                    labels: count,
                    datasets: [{
                        lineTension: 0, // ベジェ曲線を無効化
                        label: key + " 点数表",
                        data: [...datas[key], 0, 100],
                        borderColor: key == favorite ? "rgba(0,83,206)" : key == weak ? "rgba(255,0,0)" : "orange",
                        backgroundColor: "rgba(0,0,0,0)"
                    }],
                },
                options: {
                    responsive: false,
                }
            });
            divElement.appendChild(canvas);
        });
        Chart.defaults.global.defaultFontFamily = "クラフト明朝";
        var h1 = document.createElement("h1");
        h1.innerHTML = "<div class='centering'>総合評価レーダーチャート</div>";
        canvasDiv.appendChild(h1);
        var myRadarElement = document.createElement("canvas");
        canvasDiv.appendChild(myRadarElement);
        new Chart(myRadarElement, {

            type: 'radar', // チャートのタイプ
            data: { // チャートの内容
                labels: ["情報セキュリティ", "経営戦略", "データベース", "サービスマネジメント", "プロジェクトマネジメント", "組込みシステム開発"],

                datasets: [
                {
                    label: "総合評価",
                    lineTension: 0, // ベジェ曲線を無効化
                    data: [evalDatas["情報セキュリティ"][6],evalDatas["経営戦略"][6], evalDatas["データベース"][6], evalDatas["サービスマネジメント"][6], evalDatas["プロジェクトマネジメント"][6], evalDatas["組込みシステム開発"][6]],
                    backgroundColor: 'RGBA(77,169,155, 0.4)',
                    borderColor: 'blue',
                    borderWidth: 1,
                    pointBackgroundColor: 'blue'
                },]
            },
            options: { // チャートのその他オプション
                scale: {
                    pointLabels: {       // 軸のラベル（"国語"など）
                        fontSize: 22,         // 文字の大きさ
                        fontColor: "black"    // 文字の色
                    },
                    ticks: {             // 目盛り
                        min: 0,              // 最小値
                        max: 100,            // 最大値
                        stepSize: 20,        // 目盛の間隔
                        fontSize: 16,        // 目盛り数字の大きさ
                        fontColor: "purple"  // 目盛り数字の色
                    },
                    angleLines: {        // 軸（放射軸）
                        display: true,
                        color: "purple"
                    },
                    gridLines: {         // 補助線（目盛の線）
                        display: true,
                        color: "lime"
                    }
                }
            }
        });

        recentDiv.innerHTML += "<h1 style='color:green'><div class='centering'>直近5科目の学習結果</div></h1>";
        recentDiv.innerHTML += "<h1><div class='textCentering'>合計点数:" + Math.floor(recentTotalScore*10)/10 + "</div></h1>";
        recentDiv.innerHTML += "<h1><div class='textCentering'>試験結果:" + (recentTotalScore >= 60 ? "合格" : "不合格") + "</div></h1>";
        var canva = document.createElement("canvas");
        recentDiv.appendChild(canva);
        new Chart(canva, {
            type: "bar",    // ★必須　グラフの種類
            data: {
                labels: recentSubjects,
                datasets: [
                {
                    label: "直近点数",
                    lineTension: 0, // ベジェ曲線を無効化
                    data:recentScores,
                    backgroundColor: 'RGBA(77,169,155, 0.4)',
                    borderColor: 'blue',
                    borderWidth: 1,
                    pointBackgroundColor: 'blue'
                },]
            },
            options: {                       // オプション
                responsive: true,  // canvasサイズ自動設定機能を使わない。HTMLで指定したサイズに固定
                scales: {                          // 軸設定
                    xAxes: [{
                        ticks: {                       // 目盛り
                            fontSize: 16,        // 目盛り数字の大きさ
                            fontColor: "black"  // 目盛り数字の色
                        },
                    }],
                    yAxes: [{
                        display: true,                 // 表示の有無
                        ticks: {                       // 目盛り
                            min: 0,                        // 最小値
                            max: 100,                       // 最大値
                            stepSize: 10,        // 目盛の間隔
                            fontSize: 16,        // 目盛り数字の大きさ
                            fontColor: "purple"  // 目盛り数字の色
                        },
                    }],
                },
            }
        });
    }
});
