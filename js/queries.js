const pendingContainer = document.querySelector('.tabs #pending .cards');
const respondedContainer = document.querySelector('.tabs #responded .cards');
const ignoredContainer = document.querySelector('.tabs #ignored .cards');
const tab = document.querySelectorAll('.tabs > div');
const barItm = document.querySelectorAll('.bar > .item');

let clickEvent = new Event('click');

//Render queries

const renderQueries = async () => {
    const res = await fetch('https://kagaba-etienne.cyclic.app/Queries', {
        method: 'GET'
    })

    doc = await res.json();

    let pendingcards = '';
    let respondedcards = '';
    let ignoredcards = '';

    doc.forEach(element => {
        if (element.status=="pending"){

            pendingcards += `<div class="card card${element.id}">
            <div class="visible">
                <div class="photo"></div>
                <div class="data">
                    <p class="name">${element.name}</p>
                    <p class="date">${element.date}</p>
                </div>
                <div class="actions">
                    <div class="respond" id="${element.id}">
                        <img src="./assets/Reply.svg" alt="">
                    </div>
                    <div class="ignore" id="${element.id}"></div>
                </div>
            </div>
            <div class="hidden">
                <div class="text">
                    <p>${element.message}</p>
                </div>
            </div>
            </div>`

        }
        else if (element.status =="responded"){

            respondedcards += `<div class="card card${element.id}">
            <div class="visible">
                <div class="photo"></div>
                <div class="data">
                    <p class="name">${element.name}</p>
                    <p class="date">${element.date}</p>
                </div>
                <div class="actions">
                    <div class="responded"></div>
                    <div class="delete" id="${element.id}"><div>
                </div>
            </div>
            <div class="hidden">
                <div class="text">
                    <p>${element.message}</p>
                </div>
            </div>
            </div>`

        }
        else {

            ignoredcards += `<div class="card card${element.id}">
            <div class="visible">
                <div class="photo"></div>
                <div class="data">
                    <p class="name">${element.name}</p>
                    <p class="date">${element.date}</p>
                </div>
                <div class="actions">
                    <div class="respond" id="${element.id}">
                        <img src="./assets/Reply.svg" alt="">
                    </div>
                    <div class="delete" id="${element.id}"></div>
                </div>
            </div>
            <div class="hidden">
                <div class="text">
                    <p>${element.message}</p>
                </div>
            </div>
            </div>`

        }
    });

    pendingContainer.innerHTML = pendingcards;
    respondedContainer.innerHTML = respondedcards;
    ignoredContainer.innerHTML = ignoredcards;
}

const deleteQuery = () => {
    const deleteBtns = document.querySelectorAll('.actions .delete');
    
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
        
            await fetch(`https://kagaba-etienne.cyclic.app/Queries/${btn.id}`, {
                method: 'DELETE',
            })
            
            renderQueries();
        });
    })
}
const ignoreQuery = () => {
    const ignoreBtns = document.querySelectorAll('.actions .ignore');
    
    ignoreBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const res = {
                status: "ignored"
            }
        
            await fetch(`https://kagaba-etienne.cyclic.app/Queries/${btn.id}`, {
                method: 'PATCH',
                body: JSON.stringify(res),
                headers: {'content-type' : 'application/json'}
            })
            
            renderQueries();
        });
    })
}

const respondQuery = async () => {
    const sendResBtn = document.querySelector('.form.responding-frm form button');
    const resFrm = document.querySelector('.form.responding-frm form');

    let res = await (await fetch(`https://kagaba-etienne.cyclic.app/Queries/${sendResBtn.id}`)).json();

    resFrm.to.value = res.email;
    resFrm.response.value = `Dear ${res.name.split(" ")[0]},\n`;

    sendResBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const response = {
            Host: "smtp.elasticemail.com",
            Username: "kagabaetienne365@gmail.com",
            Password: "66D53E188CF75A303678B1E649EA951F71F0",
            To: resFrm.to.value,
            From: "kagabaetienne365@gmail.com",
            Subject: resFrm.subject.value,
            Body: resFrm.response.value
        }
        Email.send(response)
        .then(function (message) {
            alert('mail sent successfully')
        });

        res.status = 'responded';

        await fetch(`https://kagaba-etienne.cyclic.app/Queries/${sendResBtn.id}`, {
            method: 'PATCH',
            body: JSON.stringify(res),
            headers: {'content-type': 'application/json'}
        })
    })
}

//tab management

function setActive() {
    for(var j=0; j<barItm.length; j++) {
        barItm[j].classList.remove('active');
    }
    this.classList.add('active');

    for(var j=0; j<tab.length; j++) {
        tab[j].classList.remove('active');
        if(tab[j].id == this.id) {
            tab[j].classList.add('active');
        }
    }
}

for(var j=0; j<barItm.length; j++) {
    barItm[j].addEventListener('click', setActive);
}


window.addEventListener('DOMContentLoaded', async () => {
    await renderQueries();
    ignoreQuery();
    deleteQuery();

    const visibleRegions = document.querySelectorAll('.card .visible');
    visibleRegions.forEach(region => {
        region.addEventListener('click', () => {
            region.nextElementSibling.classList.toggle('active');
        })
    })

    const closeForm = document.querySelector('.form.responding-frm .close');
    const respondForm = document.querySelector('.form.responding-frm');
    const respondBtns = document.querySelectorAll('.card .actions .respond');
    const submitResponse = document.querySelector('.form.responding-frm form button');


    respondBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        submitResponse.id = btn.id;
        await respondQuery();
        tab.forEach(element => {
            element.classList.remove('active')
        });
        respondForm.classList.add('active');
    })

    closeForm.addEventListener('click', (e) => {
        respondForm.lastElementChild.reset();
        respondForm.classList.remove('active');
        barItm.forEach(item => {
            if (item.classList.contains('active')) {
                item.dispatchEvent(clickEvent);
            }
        })
    }) 
    });
})



