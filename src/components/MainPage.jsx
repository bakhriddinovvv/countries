import React from "react";

function MainPage({ data, neighbourClass, nth, onSelectCountry, time }) {
  console.log(data);
  return (
    <article
      data-content={nth}
      onClick={() => onSelectCountry && onSelectCountry(data.id)}
      className={`country ${neighbourClass}`}
    >
      <img className="country_img" src={data.flag} alt="flag" />
      <div className="country_data">
        <h3 className="country_name">{data.country}</h3>
        <h4 className="country_region">{data.region}</h4>
        <p className="country_row">
          <span>👫</span>
          {data.population} mln
        </p>
        <p className="country_row">
          <span>🗣</span>
          {data.language}
        </p>
        <p className="country_row">
          <span>🕰</span>
          {time}
        </p>
        <p className="country_row">
          <span>💰</span>
          {data.currency} {data.symbol}
        </p>
      </div>
    </article>
  );
}

export default MainPage;
