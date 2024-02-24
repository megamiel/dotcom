document.getElementById("evalButton").addEventListener("click", () => {
    var divElement = document.getElementById("evalDiv");
    divElement.innerHTML = "<div class='centering'><p>データ取得中...</p></div>";
    var name = document.getElementById("evalName").value;
    document.getElementById("loanName").value = name;
    if (name == "") {
        divElement.innerHTML = "";
        return;
    }

    const apiURL = 'https://script.googleusercontent.com/macros/echo?user_content_key=BOGdYm1y3kE77zyKdhnsRfW5T6buYk8z8GlynOB2Fq0oIEtRLwPdrpuQEZ6jnY0Bc42H-nBJpBz3TEYuKZ1aKwyWQwRMBcicm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnBEac8yhMX_UGTRK0AmiD8wOBJ35tBimKZrrn5UGOz62eovfTyB1c6F0y4wx9TsrkmGJSNT4kJlBMnzlTuB8tvJ_6xO983bD7tz9Jw9Md8uu&lib=MMcLF4_2FiLZJ-kSjkX5mU7SAidacjQG-';

    loadData();
    async function loadData() {
        const response = await fetch(apiURL);
        const data = await response.json();
        var datas = {情報セキュリティ:[],経営戦略:[],データベース:[],プロジェクトマネジメント:[],サービスマネジメント:[],組込みシステム開発:[]};
        data.forEach(entry => {
            if (name == entry.name&&entry.subject!="午前問題") {
                datas[entry.subject].push(entry.score);
            }
        });
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
                deviationSum+=(score - average)*(score-average);
            });
            var standardDeviation = Math.sqrt(deviationSum / num);
            evalDatas[key].push(num, total, average, max, min, standardDeviation, newScore);
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

        divElement.innerHTML = '<div class="marginTopHalf"><div class="fuchidori"><div class="blueLine"><h2>'+name+'の科目ごとの分析/評価</h2></div></div></div>';

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
            elements.innerHTML += "<div class='textCentering'>全体評価:" + Math.floor(evalDatas[key][6] * 10) / 10.0 + "</div>";
            elements.innerHTML += "<div class='marginBottomQuarter'></div>";
            divElement.appendChild(elements);
            var evalTextElement = document.createElement("h1");
            evalTextElement.innerHTML = "<div class='centering'>分析結果</div>"
            divElement.appendChild(evalTextElement);

            var evalElement = document.createElement("p");
            if (evalDatas[key][5] > 15) {
                evalElement.innerHTML += "<div class='centering'>点数の上下が激しく、不安定です</div>";
            } else if (evalDatas[key][5] > 10) {
                evalElement.innerHTML+="<div class='centering'>点数が一定で収束しており、安定しています</div>";
            } else {
                evalElement.innerHTML+="<div class='centering'>平均点とほぼ同じ点数を継続して取り続けています</div>";
            }
            if (evalDatas[key][6] > evalDatas[key][2]) {
                evalElement.innerHTML+="<div class='centering'>初期の頃と比べ、得点率に成長が見られます</div>";
            } else {
                evalElement.innerHTML+="<div class='centering'>初期の頃と得点率に変わりが見られません</div>";
            }
            if (key == favorite) {
                evalElement.innerHTML+="<div class='centering'>あなたが最も得意としている科目です</div>";
            } else if (key == weak) {
                evalElement.innerHTML+="<div class='centering'>あなたが最も苦手としている科目です</div>";
            }

            evalElement.innerHTML += "<div class='marginBottomHalf'></div>";
            divElement.appendChild(evalElement);

            // var centering = document.createElement("div");
            // centering.className = "graphCentering";
            var canvas = document.createElement("canvas");
            canvas.width = 800;

            var count = [];
            for (var i = 0; i < datas[key].length; i++){
                count.push(i + 1);
            }

            new Chart(canvas, {
                type: 'line',
                data: {
                    labels: count,
                    datasets: [{
                        label: key+" 点数表",
                        data: [...datas[key], 0, 100],
                        borderColor: key==favorite?"rgba(0,83,206)":key==weak?"rgba(255,0,0)":"orange",
                        backgroundColor: "rgba(0,0,0,0)"
                    }],
                },
                options: {
                    responsive: false,
                }
            });
            // centering.appendChild(canvas);
            divElement.appendChild(canvas);
        });
    }

});
