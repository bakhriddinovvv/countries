import { useEffect, useRef, useState } from "react";
import MainPage from "./components/MainPage";
import Form from "./components/Form";
import { nanoid } from "nanoid";
import { format } from "date-fns";

function App() {
  const [time, setTime] = useState();
  const [countryName, setCountryName] = useState("");
  const [countryDetails, setCountryDetails] = useState({});
  const [neighbourCountries, setNeighbourCountries] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const enteredValue = useRef();
  // const [enteredValue, setEnteredValue] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      // const latitude = position.coords.latitude;
      // const longitude = position.coords.longitude;
      const { latitude, longitude } = position.coords;

      const currentCountryName = async function (lat, lon) {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=aa47bc4dd6faa742921b4d33fa26596d&lang=en`
          );

          if (!response.ok) {
            throw new Error(
              "Something went wrong. Status " +
                response.status +
                ". Please try again!"
            );
          }
          const data = await response.json();
          setCountryName(data.sys.country);
        } catch (err) {
          setIsLoading(false);
          setErrMsg(err.message);
        }
      };

      currentCountryName(latitude, longitude);
    });
  }, []);

  useEffect(() => {
    const getCountryData = async function (name) {
      try {
        const response = await fetch(
          `https://countries-api-836d.onrender.com/countries/name/${name}`
        );
        const data = await response.json();
        const obj = {
          country: data[0].name,
          region: data[0].region,
          flag: data[0].flag,
          population: (data[0].population / 1000000).toFixed(1),
          language: data[0].languages[0].name,
          currency: data[0].currencies[0].name,
          symbol: data[0].currencies[0].symbol,
          borders: data[0].borders,
          timezone: data[0].timezones,
        };
        setCountryDetails(obj);
        calcTime(obj.timezone);
        fetchBorders(obj.borders);
      } catch (err) {
        setErrMsg(
          "Couldn't get the country. " + err.message + ". Please try again."
        );
      }
      setIsLoading(false);
    };

    countryName && getCountryData(countryName);

    function fetchBorders(data) {
      data.forEach(async function (border) {
        const response = await fetch(
          `https://countries-api-836d.onrender.com/countries/alpha/${border}`
        );
        const data = await response.json();
        const obj = {
          country: data.name,
          region: data.region,
          flag: data.flag,
          population: (data.population / 1000000).toFixed(1),
          language: data.languages[0].name,
          currency: data.currencies[0].name,
          symbol: data.currencies[0].symbol,
          id: nanoid(),
        };

        setNeighbourCountries((prevState) => [...prevState, obj]);
      });
    }
  }, [countryName]);

  // function getEnteredValue(e) {
  //   setEnteredValue(e.target.value);
  //   console.log(e.target.value);
  // }

  const submitHandler = function (e) {
    e.preventDefault();
    setIsLoading(true);
    const enteredCountry = enteredValue.current.value.trim();

    if (enteredCountry.length) {
      setCountryName(enteredCountry);
      setNeighbourCountries([]);
      setErrMsg("");
    } else {
      setErrMsg("Country not found. Please enter a valid name!");
      setIsLoading(false);
    }

    enteredValue.current.value = "";
  };

  const selectCountry = function (id) {
    const newCountry = neighbourCountries.find((country) => country.id === id);
    setCountryName(newCountry.country);
    setNeighbourCountries([]);
    setErrMsg("");
  };

  function calcTime(timezone) {
    const now = new Date();
    const time = timezone[0].length > 3 ? timezone[0] : timezone[1];

    const str = time.replace(":", ".");
    const arr = [...str].slice(4).join("");

    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const curDate = new Date(utc + 3600000 * arr);

    const formattedDate = format(curDate, "HH:mm - EE MMM d");
    setTime(formattedDate);
  }

  if (isLoading) {
    return (
      <div className="loader-box">
        <p className="loader"></p>
      </div>
    );
  }

  return (
    <main className="container">
      {errMsg && <p className="errText">{errMsg}</p>}
      <Form onSubmit={submitHandler} onRef={enteredValue} />

      <div className="countries">
        <MainPage data={countryDetails} time={time} />
        <ul className="neighbour-container">
          {neighbourCountries.map((neighbour, i) => (
            <MainPage
              data={neighbour}
              nth={i + 1}
              key={neighbour.id}
              neighbourClass="neighbour"
              onSelectCountry={selectCountry}
            />
          ))}
        </ul>
      </div>
    </main>
  );
}

export default App;
