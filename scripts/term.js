document.getElementById("termButton").addEventListener("click", e => {
    let subjectElement = document.getElementById("termSubject");
    let selectSubject = subjectElement.value;
    let termUl = document.getElementById("termUl");
    if (selectSubject == "- 選択 -") {
        termUl.innerHTML = "";
        return;
    }
    termUl.innerHTML="<p style='text-align:center'>データ取得中...</p>"
    const apiURL = 'https://script.googleusercontent.com/macros/echo?user_content_key=BOGdYm1y3kE77zyKdhnsRfW5T6buYk8z8GlynOB2Fq0oIEtRLwPdrpuQEZ6jnY0Bc42H-nBJpBz3TEYuKZ1aKwyWQwRMBcicm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnBEac8yhMX_UGTRK0AmiD8wOBJ35tBimKZrrn5UGOz62eovfTyB1c6F0y4wx9TsrkmGJSNT4kJlBMnzlTuB8tvJ_6xO983bD7tz9Jw9Md8uu&lib=MMcLF4_2FiLZJ-kSjkX5mU7SAidacjQG-';

    loadData();
    async function loadData() {
        const response = await fetch(apiURL);
        const data = await response.json();
        let terms = {};
        data.forEach(entry => {
            if (entry.subject == selectSubject && entry.keyword != "なし") {
                if (terms[entry.name]==null) {
                    terms[entry.name] = [];
                }
                terms[entry.name].push(entry.keyword);
            }
        });
        let names = Object.keys(terms);
        names.sort((a, b) => terms[b].length - terms[a].length);
        termUl.innerHTML = "";
        names.forEach(name => {
            let nameElement = document.createElement('p');
            nameElement.className = "termName";
            nameElement.textContent = name;
            termUl.appendChild(nameElement);
            terms[name].forEach(term =>{
                let liElement = document.createElement('li');
                liElement.className = "termClass";
                liElement.innerHTML = "<p>"+term.replaceAll("\n","<br>").replaceAll("(","（").replaceAll(")","）")+"</p>";
                termUl.appendChild(liElement);
            });
            termUl.innerHTML += "<br>";
        });
    }

});
