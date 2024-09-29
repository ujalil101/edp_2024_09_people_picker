import { useEffect, useState, } from "react"
import { Person } from "./Person"
import './PeoplePicker.css'

export function PeoplePicker() {
  const [chosenPerson, setChosenPerson] = useState();
  const [unchosenPeople, setUnchosenPeople] = useState([])
  const [chosenPeople, setChosenPeople] = useState([])
  useEffect(() => {
    fetchPeople();
  }, []);

  function fetchPeople() {
    fetch('http://localhost:3001/api/people')
      .then(res => res.json())
      .then(ppl => {
        setUnchosenPeople(ppl);
        setChosenPeople([]);
        setChosenPerson(null);
      });
  }
  return (
    <div className="PeoplePicker">
      <div id="people-picker-title">
        <h1>People Picker</h1>
      </div>


      <h2>Chosen Person</h2>
      {chosenPerson ? <></> : <p className="alert info">Hit the choose button to select a random person</p>}
      <div className="buttonRow">
        <button onClick={() => chooseRandomPerson()}>Choose</button>
        <button className="link" onClick={() => resetPeople()}>Reset</button>
      </div>
      <section className="chosenPerson">
        {chosenPerson ? <Person person={chosenPerson} /> : <></>}
      </section>
      <h2>Unchosen People</h2>
      <section className="unchosenPeople">
        {unchosenPeople
          .map((p, index) => <Person person={p} key={index} />)}
      </section>
      <hr />
      <h2>Already chosen People</h2>
      <section className="chosenPeople">
        {chosenPeople.map(p => <Person person={p} key={p.id} />)}
      </section>
    </div>
  )

  function chooseRandomPerson() {
    if (unchosenPeople.length === 0) {
      resetPeople();
      return;
    }
    let person = unchosenPeople[Math.floor(Math.random() * unchosenPeople.length)];
    setChosenPerson(person);
    setUnchosenPeople(unchosenPeople.filter(p => p !== person));
    setChosenPeople([...chosenPeople, person])
    console.log("chosen person is", person)
  }
  function resetPeople() {
    fetchPeople();
  }
}
