const $search = document.querySelector("#search")
const $searchBtn = document.querySelector(".loupe")
const $temperature = document.querySelector(".temperature-now")
const $city = document.querySelector(".city")
const $toDay = document.querySelector(".today")
const $date = document.querySelector(".date")
const $humidity = document.querySelector(".humidity p")
const $pressure = document.querySelector(".pressure p")
const $visibility = document.querySelector(".visibility p")
const $windSpeed = document.querySelector(".wind-speed p")
const $weeklyDay = document.querySelectorAll(".day")
const $weeklyImg = document.querySelectorAll(".weather-img")
const $weeklyTemperature = document.querySelectorAll(".temperature")
const $title = document.querySelector("h1")
const $timeOfDay = document.querySelector("body")
const $currentDate = new Date()

const API_LINK_LOCALIZATION = "https://api.openweathermap.org/geo/1.0/direct?q="
const API_REVERSE = "https://api.openweathermap.org/geo/1.0/reverse?lat="
const API_LINK = "https://api.openweathermap.org/data/2.5/forecast?lat="
const API_KEY = "&appid=2bd7d9d74c6cd1842cd9ae4e615a4169"
const API_UNITS = "&units=metric"
const API_CNT = "&cnt=8"

let $lat
let $lon
let $defaultCity
function geoLocalizationUser() {
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				const crd = pos.coords
				$lat = crd.latitude
				$lon = crd.longitude
				const reverse = () => {
					const URL = API_REVERSE + $lat + "&lon=" + $lon + API_KEY
					axios
						.get(URL)
						.then((res) => {
							$defaultCity = res.data[0].name
							resolve()
						})
						.catch((err) => reject(err))
				}
				reverse()
			},
			(err) => reject(err)
		)
	})
}

geoLocalizationUser()
	.then(() => {
		getCity()
	})
	.catch((err) => console.error(err))

const getCity = async () => {
	const city = $search.value || $defaultCity || "London"
	const URL = API_LINK_LOCALIZATION + city + API_KEY
	try {
		const res = await axios.get(URL)

		$lat = res.data[0].lat
		$lon = res.data[0].lon
		await getWeather()
	} catch (err) {
		console.error(err)
	}
}

const getWeather = () => {
	const URL = API_LINK + $lat + "&lon=" + $lon + API_CNT + API_KEY + API_UNITS
	axios
		.get(URL)
		.then((res) => {
			$city.textContent = res.data.city.name
			$temperature.textContent = Math.floor(res.data.list[0].main.temp) + "°C"
			$humidity.textContent = Math.floor(res.data.list[0].main.humidity) + "%"
			$pressure.textContent = res.data.list[0].main.pressure
			$visibility.textContent =
				Math.floor(res.data.list[0].visibility / 100) + "%"
			$windSpeed.textContent = res.data.list[0].wind.speed + " m/s"

			$weeklyTemperature.forEach((el, i) => {
				el.textContent = Math.floor(res.data.list[i].main.temp) + "°C"
			})
			$weeklyImg.forEach((el, i) => {
				let status = res.data.list[i].weather[0]
				if (status.id >= 200 && status.id <= 232) {
					el.setAttribute("src", "./src/img/thunderstorm.png")
				} else if (status.id >= 300 && status.id <= 321) {
					el.setAttribute("src", "./src/img/drizzle.png")
				} else if (status.id >= 500 && status.id <= 531) {
					el.setAttribute("src", "./src/img/rain.png")
				} else if (status.id >= 600 && status.id <= 622) {
					el.setAttribute("src", "./src/img/ice.png")
				} else if (status.id >= 700 && status.id <= 781) {
					el.setAttribute("src", "./src/img/fog.png")
				} else if (status.id == 800) {
					el.setAttribute("src", "./src/img/sun.png")
				} else if (status.id >= 801 && status.id <= 804) {
					el.setAttribute("src", "./src/img/cloud.png")
				} else {
					el.setAttribute("src", "./src/img/unknown.png")
				}
			})
		})
		.catch((err) => {
			console.error(err)
		})
}

const dateGenerate = () => {
	const month = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	]
	const day = $currentDate.getUTCDate()
	let monthId = month[$currentDate.getUTCMonth()]
	const year = $currentDate.getUTCFullYear()

	$date.textContent = day + " " + monthId + " " + year

	const daysOfWeek = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	]

	const currentDayIndex = $currentDate.getDay()

	const weeklyDays = []
	for (let i = 0; i < 8; i++) {
		const dayIndex = (currentDayIndex + i) % 7
		weeklyDays.push(daysOfWeek[dayIndex])
	}

	$weeklyDay.forEach((el, i) => {
		el.textContent = weeklyDays[i]
	})
}

const dayTime = () => {
	const hour = $currentDate.getHours()
	if (hour >= 9 && hour < 16) {
		$timeOfDay.classList.remove
		$timeOfDay.classList.add("day-bgc")
	} else if (hour >= 16 && hour < 21) {
		$timeOfDay.classList.remove
		$timeOfDay.classList.add("sunset-bgc")
	} else if (hour >= 21 && hour < 6) {
		$timeOfDay.classList.remove
		$timeOfDay.classList.add("night-bgc")
	} else {
		$timeOfDay.classList.remove
		$timeOfDay.classList.add("sunrise-bgc")
	}
}
const enterCheck = (e) => {
	if (e.key === "Enter") {
		getCity()
	}
}

function clock() {
	let time = new Date(),
		hours = time.getHours(),
		minutes = time.getMinutes()

	document.querySelector(".clock").innerHTML =
		harold(hours) + ":" + harold(minutes)

	function harold(standIn) {
		if (standIn < 10) {
			standIn = "0" + standIn
		}
		return standIn
	}
}
setInterval(clock, 1000)

$search.addEventListener("keyup", enterCheck)
$searchBtn.addEventListener("click", getCity)

getCity()
dateGenerate()
dayTime()
