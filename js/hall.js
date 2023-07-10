let selectSeanse = JSON.parse(sessionStorage.selectSeanse);
let bodyRequest = `event=get_hallConfig&timestamp=${selectSeanse.seanceTimeStamp}&hallId=${selectSeanse.hallId}&seanceId=${selectSeanse.seanceId}`;

document.addEventListener("DOMContentLoaded", () => {

  let buyingInfoHall = document.querySelector('.buying__info-hall');
  let buyingInfoTitle = document.querySelector('.buying__info-title');
  let buyingInfoStart = document.querySelector('.buying__info-start');
  let priceStandart = document.querySelector('.price-standart');
  let confStepWrapper = document.querySelector('.conf-step__wrapper');
  let acceptinButton = document.querySelector('.acceptin-button');
  
  buyingInfoHall.innerHTML = selectSeanse.hallName;
  buyingInfoTitle.innerHTML = selectSeanse.filmName;
  buyingInfoStart.innerHTML = `Начало сеанса ${selectSeanse.seanceTime}`;
  
  priceStandart.innerHTML = selectSeanse.priceStandart;

  getRequest(bodyRequest, (response) => {
    if (response) {
      selectSeanse.hallConfig = response;
    }
    confStepWrapper.innerHTML = selectSeanse.hallConfig;
    
    let chairs = Array.from(document.querySelectorAll('.conf-step__row .conf-step__chair'));

    acceptinButton.setAttribute("disabled", true);
    
    chairs.forEach((chair) => {
      chair.addEventListener('click', (event) => {
        if (event.target.classList.contains('conf-step__chair_taken')) {
          return;
        };
        event.target.classList.toggle('conf-step__chair_selected');
        let chairsSelected = Array.from(document.querySelectorAll('.conf-step__row .conf-step__chair_selected'));
        if (chairsSelected.length > 0) {
          acceptinButton.removeAttribute("disabled");
        } else {
          acceptinButton.setAttribute("disabled", true);
        };
      });
    });
  });
  
  acceptinButton.addEventListener("click", (event) => {
    event.preventDefault();
    
    let selectPlaces = Array();
    let rows = Array.from(document.getElementsByClassName("conf-step__row"));
    
    for (let i = 0; i < rows.length; i++) {
      let spanPlaces = Array.from(rows[i].getElementsByClassName("conf-step__chair"));
      for (let j = 0; j < spanPlaces.length; j++) {
        if (spanPlaces[j].classList.contains("conf-step__chair_selected")) {
          let typePlace = (spanPlaces[j].classList.contains("conf-step__chair_standart")) ? "standart" : "vip";
          selectPlaces.push({
            "row": i+1,
            "place": j+1,
            "type":  typePlace,
          });
        };
      };
    };
    
    let configurationHall = document.querySelector('.conf-step__wrapper').innerHTML;
    selectSeanse.hallConfig = configurationHall;
    selectSeanse.salesPlaces = selectPlaces;
    
    sessionStorage.setItem('selectSeanse', JSON.stringify(selectSeanse));
    
    window.location.href = "payment.html";
  });
});