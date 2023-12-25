const cl = console.log;

const addPlace = document.getElementById('addPlace');
const placeContainer = document.getElementById('placeContainer');
const placeForm = document.getElementById('placeForm')
const ourPlaces = document.getElementById('ourPlaces');
const placeNameCtrl = document.getElementById('placeName');
const cityCtrl = document.getElementById('city');
const submitBtn = document.getElementById('submitBtn');
const updateBtn = document.getElementById('updateBtn');

const showForm = () => {
    ourPlaces.classList.toggle('visible');
}

let placeArr = [];

const templating = (arr) => {
    let result = ``;
    arr.forEach(place => {
        result += `<div class="col-md-4 my-3" id="${place.placeId}">
                        <div class="card">
                          <div class="card-body" id="updatePlace">
                          <p class="m-0"><b>Place Name : </b> ${place.placeName}</p>
                          <p class="m-0"><b>Location : </b> ${place.placeCity}</p>
                          </div>
                        <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-success" onclick="editPlace(this)">Edit</button>
                        <button class="btn btn-danger" onclick="deletePlace(this)">Delete</button>
                        </div>
                    </div>
                </div>`
    })
    placeContainer.innerHTML = result;
}

const editPlace = (ele) => {
    let id = ele.parentElement.parentElement.parentElement.id;
    cl(id);

    let placeObj = placeArr.find(ele => {
        return ele.placeId === id;
    });
    localStorage.setItem('editObj',JSON.stringify(placeObj));
    placeNameCtrl.value = placeObj.placeName;
    cityCtrl.value = placeObj.placeCity;

    ourPlaces.classList.toggle('visible');
    submitBtn.classList.add('d-none');
    updateBtn.classList.remove('d-none');
}

if(localStorage.getItem('placeArray')){
    placeArr = JSON.parse(localStorage.getItem('placeArray'));
}

templating(placeArr);

const generateUuid = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
        const random = (Math.random() * 16) | 0;
        const value = character === "x" ? random : (random & 0x3) | 0x8;

        return value.toString(16);
  });
};

const addPlaceFun = (eve) => {
         eve.preventDefault();

         let placeObj = {
             placeName : placeNameCtrl.value,
             placeCity : cityCtrl.value,
             placeId : generateUuid()
         }
         placeArr.unshift(placeObj);
         eve.target.reset();
         localStorage.setItem("placeArray",JSON.stringify(placeArr));

         const ele = document.createElement('div');
         ele.className = `col-md-4 my-3`;
         ele.id = placeObj.placeId;
         ele.innerHTML = `
                        <div class="card">
                           <div class="card-body">
                            <p class="m-0"><b>Place Name : </b> ${placeObj.placeName}</p>
                            <p class="m-0"><b>Location : </b> ${placeObj.placeCity}</p>
                            </div>
                            <div class="card-footer d-flex justify-content-between">
                            <button class="btn btn-success" onclick="editPlace(this)">Edit</button>
                            <button class="btn btn-danger" onclick="deletePlace(this)">Delete</button>
                            </div>
                        </div>`
        placeContainer.append(ele);
        Swal.fire({
            icon: `success`,
            title: `${placeObj.placeName} and ${placeObj.placeCity} add in Places List`,
            timer: 4000
      })
    ourPlaces.classList.toggle('visible');
}

const updatePlace = () => {
    let updateValue1 = placeNameCtrl.value;
    let updateValue2 = cityCtrl.value;

    let getEditObj = JSON.parse(localStorage.getItem('editObj'));

    for(let i=0;i<placeArr.length;i++){
        if(placeArr[i].placeId === getEditObj.placeId){
            placeArr[i].placeName = updateValue1;
            placeArr[i].placeCity = updateValue2;
            break;
        }
    }
    localStorage.setItem('placeArray',JSON.stringify(placeArr));
    
   let childrenPlace = document.getElementById(getEditObj.placeId).children;
   let child1 = childrenPlace[0].children;
   let child2 = child1[0].children
   child2[0].innerHTML = `<b>Place Name : </b> ${updateValue1}`;
   child2[1].innerHTML = `<b>Location : </b> ${updateValue2}`;
       

    Swal.fire({
        title : `${getEditObj.placeName} updated to ${updateValue1} and ${getEditObj.placeCity} updated to ${updateValue2}`,
        icon : `success`,
        timer : 3000
  })
  placeForm.reset();
  updateBtn.classList.add('d-none');
  submitBtn.classList.remove('d-none'); 
  ourPlaces.classList.add('d-none');
}

const deletePlace = (ele) => {
    Swal.fire({
        title: "Are you sure,you want to delete this place details?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
        }).then((result) => {
        if (result.isConfirmed) {
            let deletedId = ele.parentElement.parentElement.parentElement.id;
              cl(deletedId);
              let getIndex = placeArr.findIndex(obj =>{
                    return obj.placeId === deletedId;
              })
              placeArr.splice(getIndex,1);
              cl(placeArr);
              localStorage.setItem('placeArray',JSON.stringify(placeArr));
        // templating(todoArr);
        ele.parentElement.parentElement.remove();

        Swal.fire({
              title: "Deleted!",
              text: "Your place details has been deleted.",
              icon: "success",
              timer : 3000
        });
        }
        });
}

placeForm.addEventListener('submit',addPlaceFun);
addPlace.addEventListener('click',showForm);
updateBtn.addEventListener('click',updatePlace);