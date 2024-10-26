this.verifyForm = document.getElementById('verifyForm');
this.resetForm = document.getElementById('resetForm');

function controlForm (form){
    if(!['verify','reset'].includes(form)) {
        console.error(`Invalid form name : ${form}`)
    }
    
    this.verifyForm.classList.add('hidden');
    this.resetForm.classList.add('hidden');

    const targetForm = document.getElementById(`${form}Form`);
    if (targetForm){
        targetForm.classList.remove('hidden');
    } else {
        console.error(`Form ID ${form}Form not found`)
    }
}