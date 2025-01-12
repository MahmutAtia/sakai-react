import './s.css';
const InteractiveResumeTemplate = ({ data }) => {
    return (
      <div className="interactive-template">
        <header>
          <h1>{data.personal_information.name}</h1>
          <p>{data.personal_information.email}</p>
        </header>
        <section className="languages">
          <h2>Languages</h2>
          <ul>
            {data.languages.map((lang) => (
              <li key={lang.id}>{lang.language} - {lang.proficiency}</li>
            ))}
          </ul>
        </section>
        <section className="awards">
          <h2>Awards & Recognition</h2>
          <ul>
            {data.awards_and_recognition.map((award, index) => (
              <li key={index}>{award}</li>
            ))}
          </ul>
        </section>
      </div>
    );
  };


export default InteractiveResumeTemplate;
