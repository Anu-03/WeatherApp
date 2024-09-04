// const cityInput=document.querySelector('.city-input');
// const searchBtn=document.querySelector('.search-btn');

// const apiKey='4e172039b640099a9d245162fba6ba4a'
// searchBtn.addEventListener('click',() => {
//     if(cityInput.value.trim()!=''){
//         updateWeatherInfo();
//         cityInput.value=''
//         cityInput.getBoundingClientRect()

//     }
// })

// cityInput.addEventListener('keydown',(event)=>{
//     if(event.key=='Enter' && cityInput.value.trim()!='' ){
//         updateWeatherInfo();
//         cityInput.value='';
//         cityInput.blur();
        
//     }
// })

// async function getFetchData(endPoint,city){
//       const apiUrl=`https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}`
//       const response=await fetch(apiUrl)
//       return response.json();
//     }

// async function updateWeatherInfo(city){
//     const weatherData=await getFetchData('weather',city);
//     console.log(weatherData);
    
// }

const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');
const weatherInfoSection=document.querySelector('.weather-info')
const notFoundSection=document.querySelector('.not-found');
const searchCitySection=document.querySelector('.search-city');
const countryTxt=document.querySelector('.country-txt');
const tempTxt=document.querySelector('.temp-txt');
const conditionTxt=document.querySelector('.condition-txt');
const humidityValueTxt=document.querySelector('.humidity-value-txt');
const windValueTxt=document.querySelector('.wind-value-txt');
const weatherSummaryImg=document.querySelector('.weather-summary-img');
const currentDateTxt=document.querySelector('.current-date-txt');
const forecastItemsContainer=document.querySelector('.forecast-items-container');



const apiKey = '4e172039b640099a9d245162fba6ba4a';
searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value); // Pass the city value here
        cityInput.value = '';
        cityInput.blur();
    }
});

cityInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' && cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value); // Pass the city value here
        cityInput.value = '';
        cityInput.blur();
    }
});

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    return response.json();
}

function getWeatherIcon(id){
    if(id<=232) return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUZ2UvOu-8QpdyFHaxjQGeRJe8JchM2M0EUA&s'
    if(id<=321) return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx1zbT4KSc65cSN391tQdr-k17_POPZ4muKg&s'
    if(id<=531) return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnPypKqutg45QnvOfZSjxeQccJ6rvVz0zy-g&s'
    if(id<=632) return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKLxZnER0RpmiXWF6ueFUc5vsrbXazDaCShg&s'
    if(id<=781) return 'https://img.icons8.com/external-flat-icons-pack-pongsakorn-tan/600w/000000/external-atmosphere-weather-flat-icons-pack-pongsakorn-tan.png'
    if(id<=800) return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ_lsqYOa3c6lSgdOmtDSx9Jr6jwpgbIuQUw&s'
    
    else return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBW4o9WwlXEB14wC4UL2egVndmHO15cocM3w&s'    
}

function getCurrentDate(){
    const currentDate=new Date();
    const options={
        weekday:'short',
        day:'2-digit',
        month:'short',
    }
    return currentDate.toLocaleDateString('en-GB',options)
    // console.log(currentDate);
    
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city);
    if(weatherData.cod!=200){
        showDisplaySection(notFoundSection)
        return 
    }
    console.log(weatherData);

    const{
        name:country,
        main:{temp,humidity},
        weather:[{id,main}],
        wind:{speed}
    }=weatherData
    countryTxt.textContent=country;
    tempTxt.textContent=Math.floor(temp )+ '°C';
    conditionTxt.textContent=main;
    humidityValueTxt.textContent=humidity+'%';
    windValueTxt.textContent=speed+' M/s';
    currentDateTxt.textContent=getCurrentDate()
    weatherSummaryImg.src=`${getWeatherIcon(id)}`
    
    await updateForecastsInfo(city)
    showDisplaySection(weatherInfoSection)
}

async function updateForecastsInfo(city){
        const forecastsData= await getFetchData('forecast',city);
        const timeTaken='12:00:00'
        const todayDate=new Date().toISOString().split('T')[0]
        
        forecastItemsContainer.innerHTML=''
        forecastsData.list.forEach(forecastWeather=>{
            if(forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)){
                updateForecastsItems(forecastWeather);
            }  
        })
    }

    function updateForecastsItems(weatherData){
console.log(weatherData);
    const{
        dt_txt:date,
        weather:[{id}],
        main:{temp}
    }=weatherData
    const dateTaken=new Date(date)
    const dateOption={
        day:'2-digit',
        month:'short'
    }
    const dateResult=dateTaken.toLocaleDateString('en-US',dateOption)
    const forecastItem=`
    <div class="forecast-item">
                <h5 class="forecast-item-data regular-txt">${dateResult}</h5>
            <img src="${getWeatherIcon(id)}" alt="" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)}°C</h5>    
        </div>
    `
    forecastItemsContainer.insertAdjacentHTML('beforeend',forecastItem)
    }



function showDisplaySection(section){
          [weatherInfoSection,searchCitySection,notFoundSection]
          .forEach(section => section.style.display='none')
            
               section.style.display='flex'
};
