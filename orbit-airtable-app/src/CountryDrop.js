import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
// import 'bootstrap/dist/css/bootstrap.min.css';

export default function CountryDrop(props) {
  const [id] = useState(props.id);
  const [name] = useState(props.name);
  const [service] = useState(props.service);
  const [googlecountries] = useState([
    { title: 'Afrikaans', code: 'af'},
    { title: 'Irish', code: 'ga'},
    { title: 'Albanian', code: 'sq'},
    { title: 'Italian', code: 'it'},
    { title: 'Arabic', code: 'ar'},
    { title: 'Japanese', code: 'ja'},
    { title: 'Azerbaijani', code: 'az'},
    { title: 'Kannada', code: 'kn'},
    { title: 'Basque', code: 'eu'},
    { title: 'Korean', code: 'ko'},
    { title: 'Bengali', code: 'bn'},
    { title: 'Latin', code: 'la'},
    { title: 'Belarusian', code: 'be'},
    { title: 'Latvian', code: 'lv'},
    { title: 'Bulgarian', code: 'bg'},
    { title: 'Lithuanian', code: 'lt'},
    { title: 'Catalan', code: 'ca'},
    { title: 'Macedonian', code: 'mk'},
    { title: 'Chinese Simplified', code: 'zh-CN'},
    { title: 'Malay', code: 'ms'},
    { title: 'Chinese Traditional', code: 'zh-TW'},
    { title: 'Maltese', code: 'mt'},
    { title: 'Croatian', code: 'hr'},
    { title: 'Norwegian', code: 'no'},
    { title: 'Czech', code: 'cs'},
    { title: 'Persian', code: 'fa'},
    { title: 'Danish', code: 'da'},
    { title: 'Polish', code: 'pl'},
    { title: 'Dutch', code: 'nl'},
    { title: 'Portuguese', code: 'pt'},
    { title: 'English', code: 'en'},
    { title: 'Romanian', code: 'ro'},
    { title: 'Esperanto', code: 'eo'},
    { title: 'Russian', code: 'ru'},
    { title: 'Estonian', code: 'et'},
    { title: 'Serbian', code: 'sr'},
    { title: 'Filipino', code: 'tl'},
    { title: 'Slovak', code: 'sk'},
    { title: 'Finnish', code: 'fi'},
    { title: 'Slovenian', code: 'sl'},
    { title: 'French', code: 'fr'},
    { title: 'Spanish', code: 'es'},
    { title: 'Galician', code: 'gl'},
    { title: 'Swahili', code: 'sw'},
    { title: 'Georgian', code: 'ka'},
    { title: 'Swedish', code: 'sv'},
    { title: 'German', code: 'de'},
    { title: 'Tamil', code: 'ta'},
    { title: 'Greek', code: 'el'},
    { title: 'Telugu', code: 'te'},
    { title: 'Gujarati', code: 'gu'},
    { title: 'Thai', code: 'th'},
    { title: 'Haitian Creole', code: 'ht'},
    { title: 'Turkish', code: 'tr'},
    { title: 'Hebrew', code: 'iw'},
    { title: 'Ukrainian', code: 'uk'},
    { title: 'Hindi', code: 'hi'},
    { title: 'Urdu', code: 'ur'},
    { title: 'Hungarian', code: 'hu'},
    { title: 'Vietnamese', code: 'vi'},
    { title: 'Icelandic', code: 'is'},
    { title: 'Welsh', code: 'cy'},
    { title: 'Indonesian', code: 'id'},
    { title: 'Yiddish', code: 'yi'},
  ]);

  const [deeplcountries] = useState([
    { title: 'Italian', code: 'it'},
    { title: 'Latvian', code: 'lv'},
    { title: 'Bulgarian', code: 'bg'},
    { title: 'Lithuanian', code: 'lt'},
    { title: 'Chinese Simplified', code: 'zh-CN'},
    { title: 'Czech', code: 'cs'},
    { title: 'Danish', code: 'da'},
    { title: 'Polish', code: 'pl'},
    { title: 'Dutch', code: 'nl'},
    { title: 'Portuguese', code: 'pt'},
    { title: 'English', code: 'en'},
    { title: 'Romanian', code: 'ro'},
    { title: 'Russian', code: 'ru'},
    { title: 'Estonian', code: 'et'},
    { title: 'Slovak', code: 'sk'},
    { title: 'Finnish', code: 'fi'},
    { title: 'Slovenian', code: 'sl'},
    { title: 'Spanish', code: 'es'},
    { title: 'Swedish', code: 'sv'},
    { title: 'German', code: 'de'},
    { title: 'Greek', code: 'el'},
    { title: 'Ukrainian', code: 'uk' },
    { title: 'Hungarian', code: 'hu' },
  ]);
  const [toggleContents, setToggleContents] = useState(props.name);
  const [selectedCountry, setSelectedCountry] = useState();
  const [countries, setCountries ] = useState([]);

  useEffect(() => {
    if (props.service === 'google') {
      setCountries(googlecountries);
    } else if (props.service === 'deepl') {
      setCountries(deeplcountries);
    }
    if (props.name === 'Source Language') {
      countries.push({ title: 'AutoDetect', code: 'auto'});
    }
  }, []);

  return (
    <div className="Toggle">
      <Dropdown id={id} name={name}
        onSelect={eventKey => {
            const { code, title } = countries.find(({ code }) => eventKey === code);
          console.log(code, title);
          console.log(eventKey);
            setSelectedCountry(eventKey);
            setToggleContents(<>{title}</>);
          }}
        >
          <Dropdown.Toggle variant="primary" id="dropdown-flags" className="text-left" >
            {toggleContents}
          </Dropdown.Toggle>
        <Dropdown.Menu>
          {countries.map(({ code, title }) => (
            <Dropdown.Item key={code} eventKey={code}>{title}</Dropdown.Item>
          ))}
          </Dropdown.Menu>
        </Dropdown>
    </div>
  );
}
