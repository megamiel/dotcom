document.getElementById("loanButton").addEventListener("click", () => {
    var ulElement = document.getElementById("loanUl");
    // 名前を取得し、借金一覧を表示する
    var name = document.getElementById("loanName").value;
    if (name == "") {
        ulElement.innerHTML = "";
        return;
    }
    if (name.includes("&") && name.includes("$")) {
        ulElement.innerHTML = "無効なコマンドです";
        return;
    }

    var todaysSubjects = [document.getElementById("todaysSubject1")];
    ulElement.innerHTML = "<p>　　　データ取得中...</p>";
    if (name.split(/[&|$]/).length==1) {
        document.getElementById("evalName").value = name;
    }
    var today = new Date();
    var start = new Date(2025, 4, 1);
    var diffMilliSec = today - start;
    /*ミリ秒を日数に変換*/
    var diffDays = parseInt(diffMilliSec / 1000 / 60 / 60 / 24);
    var numStr = ['令和5年秋期', '令和5年春期', '令和4年秋期', '令和4年春期', '令和3年秋期', '令和3年春期', '令和2年秋期', '令和元年秋期', '平成31年春期', '平成30年秋期', '平成30年春期', '平成29年秋期', '平成29年春期', '平成28年秋期', '平成28年春期', '平成27年秋期', '平成27年春期', '平成26年秋期', '平成26年春期', '平成25年秋期', '平成25年春期', '平成24年秋期', '平成24年春期', '平成23年秋期'];
    numStr=numStr.reverse();
    var subsStr = ['情報セキュリティ', '経営戦略', 'データベース', 'サービスマネジメント', 'プロジェクトマネジメント', '組込みシステム開発'];
    const todayExam = Math.floor((diffDays) / 3);
    const todayFinalSubject = diffDays % 3 * 2;
    var array = [];
    for (var i = 0; i <= todayExam; i++) {
        for (var j = 0; j < subsStr.length; j++) {
            if (i == todayExam && j > todayFinalSubject) {
                break;
            }
            array.push(numStr[i] + ' ' + subsStr[j]);
        }
    }

    const apiURL = 'https://script.googleusercontent.com/macros/echo?user_content_key=BOGdYm1y3kE77zyKdhnsRfW5T6buYk8z8GlynOB2Fq0oIEtRLwPdrpuQEZ6jnY0Bc42H-nBJpBz3TEYuKZ1aKwyWQwRMBcicm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnBEac8yhMX_UGTRK0AmiD8wOBJ35tBimKZrrn5UGOz62eovfTyB1c6F0y4wx9TsrkmGJSNT4kJlBMnzlTuB8tvJ_6xO983bD7tz9Jw9Md8uu&lib=MMcLF4_2FiLZJ-kSjkX5mU7SAidacjQG-';

    loadData();
    async function loadData() {
        const response = await fetch(apiURL);
        const data = await response.json();

        // 左側の借金かつ右側の未借金であるものを借金として表示する
        if (name.includes("$")) {
            var names = name.split("$");
            var main = names[0];
            var sub = [...names];
            sub.shift();
            var subArray = [...array];
            data.forEach(entry => {
                const tmpExamSub = entry.examTime + ' ' + entry.subject;
                if (main == entry.name) {
                    array[array.indexOf(tmpExamSub)] = null;
                }else if (sub.includes(entry.name)) {
                    subArray[subArray.indexOf(tmpExamSub)] = null;
                }
            });
            for (var i = 0; i < array.length; i++){
                if (!(array[i] != null && subArray[i] == null)) {
                    array[i] = null;
                }
            }
        } else {
            var names = name.split("&");
            for (var i = 0; i < names.length; i++) {
                data.forEach(entry => {
                    if (names[i] == entry.name) {
                        const tmpExamSub = entry.examTime + ' ' + entry.subject;
                        array[array.indexOf(tmpExamSub)] = null;
                    }
                });
            }
        }

        for (var i = 0; i < todaysSubjects.length; i++){
            var todaysSubject = todaysSubjects[i].innerHTML.replaceAll("<br>"," ").replaceAll(/<[^>]+>/g,"");
            if (!array.includes(todaysSubject)) {
                todaysSubjects[i].getElementsByTagName("a")[0].style.color = "gray";
            } else {
                todaysSubjects[i].getElementsByTagName("a")[0].style.color = "black";
            }
            array[array.indexOf(todaysSubject)] = null;
        }
        

        ulElement.innerHTML = "";
        var count = 0;
        for (var i = 0; i < array.length; i++) {
            if (array[i] != null) {
                count++;
            }
        }
        ulElement.innerHTML = count + "個の借金があります</div>";

        for (var i = 0; i < array.length; i++) {
            if (array[i] != null) {
                var liElement = document.createElement('li');
                liElement.innerHTML = "<a href='' onclick='loanCopy(event,"+i+")'>"+ array[i]+"</a>";
                ulElement.appendChild(liElement);
            }
        }
    }
});

function loanCopy(event, i) {
    event.preventDefault();
    // var prompt = "/*prompt:" + numStr[Math.floor(i / 6)] + " " + subsStr[i % 6]+"*/\n";
    // prompt += "document.getElementsByName('check_all')[1].click();document.getElementsByName('check_all')[3].click();";
    var exam = Math.floor(i/6);
    var sub = i % 6;
    // prompt += "document.getElementsByName('times[]')[" + exam + "].click();";
    // prompt += "document.getElementsByName('categories[]')[" + sub + "].click();";
    // prompt += "document.getElementsByClassName('submit')[0].click();";
    // copyToClipboard(prompt);
    localStorage.setItem("extm", numStr[exam]);
    localStorage.setItem("subj", subsStr[sub]);
    window.open("subPages/postToDojo.html");
}
