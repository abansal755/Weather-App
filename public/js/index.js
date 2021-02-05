const searchName = document.querySelector('#search-name');
const searchLat = document.querySelector('#search-lat');
const searchLong = document.querySelector('#search-long');
const suggestions = document.querySelector('#suggestions');
const searchForm = document.querySelector('#search-name-form');
const searchLatLongForm = document.querySelector('#search-latlong-form')
const weatherCardContainer = document.querySelector('#weather-card-container');

searchName.addEventListener('input',async function(){
    if(this.value==="") return;
    const res = await fetch(`/api/search?q=${this.value}`);
    if(!res.ok) return;
    const body = await res.json();
    suggestions.replaceChildren();
    for(const loc of body){
        const opt = document.createElement('option');
        opt.value = loc.name;
        suggestions.append(opt);
    }
})

searchForm.addEventListener('submit',async function(e){
    if(!this.checkValidity()) return;
    e.preventDefault();
    const res = await fetch(`/api/current?q=${searchName.value}`);
    if(!res.ok){
        addAlert(`Unable to look for ${searchName.value}`);
        return;
    }
    const body = await res.json();
    updateWeatherCard(body);
})

searchLatLongForm.addEventListener('submit',async function(e){
    if(!this.checkValidity()) return;
    e.preventDefault();
    const res = await fetch(`/api/current?q=${searchLat.value},${searchLong.value}`);
    if(!res.ok){
        addAlert('Unable to look for the given values');
        return;
    }
    const body = await res.json();
    updateWeatherCard(body);
})

function updateWeatherCard(body){
    const div = document.createElement('div');
    const oldDiv = document.querySelector('#weather-card');
    if(oldDiv) oldDiv.remove();
    div.classList.add('col-12','col-sm-6','offset-sm-3','col-xl-4','offset-xl-4');
    div.id = 'weather-card';
    div.innerHTML = `
        <div class="card border-0" style="box-shadow: 0px 0px 7px 0px #0000005e;">
            <div class="card-body">
                <div class="d-flex justify-content-between mb-2">
                    <div>
                        <div class="h2">${body.location.name}</div>
                        <div>${body.location.region}</div>
                        <div>${body.location.country}</div>
                        <div class="h4 d-flex justify-content-between">
                            <div class="me-2"><sup>Lat</sup>${body.location.lat}</div>
                            <div><sup>Long</sup>${body.location.lon}</div>
                        </div>
                    </div>
                    <div class="d-flex align-items-center">
                        <img src="${body.current.condition.icon}">
                        <span class="h4 mb-0">${body.current.condition.text}</span>
                    </div>
                </div>
                    <div class="d-flex justify-content-between">
                        <div class="h2 me-2">${body.current.temp_c}&deg;C | ${body.current.temp_f}&deg;F</div>
                        <div class="h2"><sup>Wind</sup> ${body.current.wind_kph}km/h</div>
                    </div>
                </div>
        </div>`;
    weatherCardContainer.append(div);
}

function addAlert(message){
    const div = document.createElement('div');
    div.classList.add('col-12','col-sm-6','offset-sm-3','col-xl-4','offset-xl-4');
    div.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show">
            <div>${message}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>`;
    const closeBtn = div.querySelector('.btn-close');
    setTimeout(() => closeBtn.click(), 2000);
    weatherCardContainer.prepend(div);
}