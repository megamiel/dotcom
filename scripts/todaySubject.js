var today = new Date();
var start = new Date(2024, 0, 22);
var diffMilliSec = today - start;
/*ミリ秒を日数に変換*/
var diffDays = parseInt(diffMilliSec / 1000 / 60 / 60 / 24);
var numStr = ["令和5年秋期", "令和5年春期", "令和4年秋期", "令和4年春期", "令和3年秋期", "令和3年春期", "令和2年秋期", "令和元年秋期", "平成31年春期", "平成30年秋期", "平成30年春期", "平成29年秋期", "平成29年春期", "平成28年秋期", "平成28年春期", "平成27年秋期", "平成27年春期", "平成26年秋期", "平成26年春期", "平成25年秋期", "平成25年春期", "平成24年秋期", "平成24年春期", "平成23年秋期", "平成23年特別", "平成22年秋期", "平成22年春期", "平成21年秋期", "平成21年春期"];
var subsStr = ["情報セキュリティ", "経営戦略", "データベース", "サービスマネジメント", "プロジェクトマネジメント", "組込みシステム開発"];

var subIds = [0, 1, 5, 9, 8, 6];
write(0);
write(1);

function copy(event, index) {
    event.preventDefault();
    var prompt = "/*prompt:" + numStr[Math.floor(diffDays / 3)] + " " + subsStr[diffDays % 3 * 2 + index]+"*/\n";
    prompt += "document.getElementsByName('check_all')[1].click();document.getElementsByName('check_all')[3].click();"
    var exam = Math.floor(diffDays / 3);
    var sub = subIds[diffDays % 3 * 2 + index];
    prompt += "document.getElementsByName('times[]')[" + exam + "].click();"
    prompt += "document.getElementsByName('categories[]')[" + sub + "].click();"
    prompt+="document.getElementsByClassName('submit')[0].click();"
    copyToClipboard(prompt);
    localStorage.setItem("extm", numStr[exam]);
    localStorage.setItem("subj", subsStr[diffDays%3*2+index]);
    window.open("https://www.ap-siken.com/apkakomon_pm.php");
}

// クリップボードへコピー
function copyToClipboard(text) {
    if (navigator.clipboard) {
        return navigator.clipboard.writeText(text).then(function (){});
    } else {
        tagText.select();
        document.execCommand('copy');
    }
}

function write(index) {
    document.getElementById("todaysSubject" + (index + 1)).innerHTML="<a href='' onclick='copy(event,"+index+")'>"+numStr[Math.floor(diffDays / 3)] + "<br>" + subsStr[diffDays % 3 * 2 + index]+"</a>";
}
