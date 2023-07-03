const subject = document.querySelector('#sub');
const question = document.querySelector('#ques');
const quesitems = document.querySelector('#queslist');
let subm = document.querySelector('#submit');
let activeQues;
let res;
let quesArr=[];
getFromLocalStorage();
function showNewQuestion(){
    let div2 = document.getElementById('c2');
    div2.innerHTML="";
    div2.innerHTML=`
        <h1>Welcome to Discussion Portal!</h1>
        <p id="c22">Enter a Subject and Question to get started</p>
        <input id="sub" type="text" placeholder="Subject"><br>
        <textarea id="ques" type="text" placeholder="Question"></textarea><br>
        <button id="submit">Submit</button>
    `;
    subm=document.querySelector('#submit');
    subm.addEventListener('click',function(event){
        const subject = document.querySelector('#sub');
        const question = document.querySelector('#ques');
        if(subject.value.trim()===''){
            alert('Subject field cannot be empty');
            subject.value='';
        }
        else if(question.value.trim()===''){
            alert('Question field cannot be empty');
            question.value='';
        }
        else
            addQues(subject.value ,question.value);
    });
}
subm.addEventListener('click',function(event){
    if(subject.value.trim()===''){
        alert('Subject field cannot be empty');
        subject.value='';
    }
    else if(question.value.trim()===''){
        alert('Question field cannot be empty');
        question.value='';
    }
    else
        addQues(subject.value ,question.value);
});
function addQues(subj,quest){
    const data={
        id:Date.now(),
        sub:subj,
        que:quest,
        fav:false,
        responses:[]
    };
    quesArr.push(data);
    addToLocalStorage(quesArr);
    question.value='';
    subject.value='';
}
function getFromLocalStorage(){
    const ref = localStorage.getItem('tasks');
    if(ref){
        quesArr=JSON.parse(ref);
        renderList(quesArr);
    }
}
function addToLocalStorage(quesArr){
    localStorage.setItem('tasks',JSON.stringify(quesArr));
    renderList(quesArr);
}

function renderList(quesArr){
    quesitems.innerHTML='';
    quesArr.forEach(function(item){
        const li=document.createElement('li');
        li.setAttribute('class','item');
        li.setAttribute('id',item.id);
        li.innerHTML=`
        <h2 class="itemsub">${item.sub}</h2>
        <p class="itemque">${item.que}</p>
        `;
        quesitems.append(li);
    });
}
quesitems.addEventListener('click',function(event){
    let litem;
    let tag=event.target.className;
    if(tag=='item'){
        litem=event.target.id;
    }
    else if(tag=='itemsub' || tag=='itemque') {
        litem=event.target.parentElement.id;
    }
    else{
        return;
    }
    showQues(litem);
});
function showQues(litem){
    activeQues=litem;
    let div2 = document.getElementById('c2');
    let cont = document.getElementById(litem);
    div2.innerHTML="";
    div2.innerHTML=`
    <h3 id="question">Question</h3>
    <div class="quesdiv">
    ${cont.innerHTML}
    </div>
    <button id="resol">Resolve</button>
    <h3 id="resp">Response</h3>
    <ul id="reslist"></ul>
    <h3 id="addresp">Add Response</h3>
    <input id="ressub" type="text" placeholder="Enter Name"><br>
    <textarea id="rescom" type="text" placeholder="Enter Comment"></textarea><br>
    <button id="submitres">Submit</button>
    `;
    let resarr;
    const reslist=document.getElementById("reslist");
    quesArr.forEach(function(item){
        if(item.id==litem)
            resarr=item.responses;
    });
    renderRes();
    function renderRes(){
        resarr.forEach(function(item){
            const li=document.createElement('li');
            li.setAttribute('class','item');
            li.innerHTML=`
            <h2 class="ressub">${item.name}</h2>
            <p class="resque">${item.com}</p>
            `;
            reslist.append(li);
        });
    }

    resbut=document.getElementById("submitres");
    const name=document.getElementById("ressub");
    const comment = document.getElementById("rescom");
    resbut.addEventListener('click',function(event){
        
        if(name.value.trim()===''){
            alert('Name cannot be empty');
            name.value='';
        }
        else if(comment.value.trim()===''){
            alert('Comment cannot be empty');
            comment.value='';
        }
        else
            addResp(name.value ,comment.value);
    });
    function addResp(resname,rescomment){
        const data={
            name:resname,
            com:rescomment,
        };
        resarr.push(data);
        localStorage.setItem('tasks',JSON.stringify(quesArr));
        name.value='';
        comment.value='';
        const li=document.createElement('li');
        li.setAttribute('class','item');
        li.innerHTML=`
        <h2 class="ressub">${data.name}</h2>
        <p class="resque">${data.com}</p>
        `;
        reslist.append(li);
    }
    res=document.getElementById('resol');
    res.addEventListener('click',function(event){
        //console.log(activeQues);
        document.getElementById(activeQues).remove();
        quesArr=quesArr.filter(function(ques){
            return ques.id!=activeQues;
        });
        localStorage.setItem('tasks',JSON.stringify(quesArr));
        showNewQuestion();
    });
}
document.getElementById('newques').addEventListener('click',function(event){
    document.getElementById('c2').innerHTML='';
    showNewQuestion();
});
let search=document.getElementById("searchques");
search.addEventListener('keyup',function(event){
    let ressub=[];
    let cont=[];
    if(search.value==''){
        renderList(quesArr);
    }
    quesArr.forEach(function(item){
        if(item.sub.includes(search.value)){
            ressub.push(item);
        }
        else if(item.que.includes(search.value)){
            cont.push(item);
        }
    });
    quesitems.innerHTML='';
    if(ressub.length==0 && cont.length==0){
        const li=document.createElement('li');
        li.setAttribute('class','item');
        li.innerHTML=`
        <h2 class="itemsub">No match found</h2>
        `;
        quesitems.append(li);
    }
    else{
        renderListSearch(ressub,search.value);
        renderListSearch(cont,search.value);
    }
    console.log(ressub);
});
function renderListSearch(quesAr, searched){
    quesAr.forEach(function(item){
        const li=document.createElement('li');
        li.setAttribute('class','item');
        li.setAttribute('id',item.id);
        let re = new RegExp(searched,"g"); // search for all instances
		let hsub = item.sub.replace(re, `<mark>${searched}</mark>`);
        let hque = item.que.replace(re, `<mark>${searched}</mark>`);
        li.innerHTML=`
        <h2 class="itemsub">${hsub}</h2>
        <p class="itemque">${hque}</p>
        `;
        quesitems.append(li);
    });
}