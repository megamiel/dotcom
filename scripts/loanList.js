document.getElementById("loanButton").addEventListener("click", () => {
    var ulElement = document.getElementById("loanUl");
    ulElement.innerHTML = "<p>　　　データ取得中...</p>";
    var todaysSubjects = [document.getElementById("todaysSubject1"),document.getElementById("todaysSubject2")];

    // 名前を取得し、借金一覧を表示する
    var name = document.getElementById("loanName").value;
    document.getElementById("evalName").value = name;
    var today = new Date();
    var start = new Date(2024, 0, 22);
    var diffMilliSec = today - start;
    /*ミリ秒を日数に変換*/
    var diffDays = parseInt(diffMilliSec / 1000 / 60 / 60 / 24);
    var numStr = ['令和5年秋期', '令和5年春期', '令和4年秋期', '令和4年春期', '令和3年秋期', '令和3年春期', '令和2年秋期', '令和元年秋期', '平成31年春期', '平成30年秋期', '平成30年春期', '平成29年秋期', '平成29年春期', '平成28年秋期', '平成28年春期', '平成27年秋期', '平成27年春期', '平成26年秋期', '平成26年春期', '平成25年秋期', '平成25年春期', '平成24年秋期', '平成24年春期', '平成23年秋期', '平成23年特別', '平成22年秋期', '平成22年春期', '平成21年秋期', '平成21年春期'];
    var subsStr = ['情報セキュリティ', '経営戦略', 'データベース', 'サービスマネジメント', 'プロジェクトマネジメント', '組込みシステム開発'];
    const todayExam = Math.floor(diffDays / 3);
    const todayFinalSubject = diffDays % 3 * 2 + 1;
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
        data.forEach(entry => {
            if (name == entry.name) {
                const tmpExamSub = entry.examTime + ' ' + entry.subject;
                for (var i = 0; i < array.length; i++) {
                    if (array[i] == tmpExamSub) {
                        array[i] = null;
                        break;
                    }
                }
            }
        });
        ulElement.innerHTML = "";
        for (var i = 0; i < array.length; i++) {
            if (array[i] != null) {
                var liElement = document.createElement('li');
                liElement.textContent = array[i];
                ulElement.appendChild(liElement);
            }
        }

        for (var i = 0; i < todaysSubjects.length; i++){
            if (!array.includes(todaysSubjects[i].innerHTML.replace("<br>", " "))) {
                todaysSubjects[i].style.color="gray";
            }
        }
    }
});
