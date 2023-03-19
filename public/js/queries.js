const tab = document.querySelectorAll('.tabs > div');
const barItm = document.querySelectorAll('.bar > .item');

let clickEvent = new Event('click');


const deleteQuery = () => {
    const deleteBtns = document.querySelectorAll('.actions .delete');
    
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
        
            await fetch(`https://kagaba-etienne.cyclic.app/admin/queries/${btn.id}`, {
                method: 'DELETE',
            })
            
            location.assign('/admin/queries');
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
        
            await fetch(`https://kagaba-etienne.cyclic.app/admin/queries/${btn.id}`, {
                method: 'PATCH',
                body: JSON.stringify({ res }),
                headers: {'content-type' : 'application/json'}
            })
            
            location.assign('/admin/queries');
        });
    })
}

const respondQuery = async () => {
    const sendResBtn = document.querySelector('.form.responding-frm form button');
    const resFrm = document.querySelector('.form.responding-frm form');

    let res = await (await fetch(`https://kagaba-etienne.cyclic.app/admin/queries/${sendResBtn.id}`)).json();

    resFrm.to.value = res.email;
    resFrm.response.value = `Dear ${res.name.split(" ")[0]},\n`;

    sendResBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const response = {
            To: resFrm.to.value,
            Subject: resFrm.subject.value,
            Body: resFrm.response.value
        }

        res.status = 'responded';

        await fetch(`https://kagaba-etienne.cyclic.app/admin/queries/${sendResBtn.id}`, {
            method: 'PATCH',
            body: JSON.stringify({res, response}),
            headers: {'content-type': 'application/json'}
        });
        location.assign('/admin/queries');
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


window.addEventListener('DOMContentLoaded', () => {
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



