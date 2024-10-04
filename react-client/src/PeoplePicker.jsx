import { useCallback, useEffect, useState, } from "react"
import { Person } from "./Person"
import './PeoplePicker.css'

export function PeoplePicker() {
  const [chosenPerson, setChosenPerson] = useState(null);
  const [unchosenPeople, setUnchosenPeople] = useState([]);
  const [chosenPeople, setChosenPeople] = useState([]);
  const [deferredPeople, setDeferredPeople] = useState([]);

  useEffect(() => {
    fetchPeople();
  }, []);

  // useCallback allows the component to remember fetchPeople between renders
  // thereby obviating the need to re-create fetchPeople on every rerender.
  const fetchPeople = useCallback(() => {
    fetch('/api/people')
      .then(res => res.json())
      .then(ppl => {
        setUnchosenPeople(ppl);
        setChosenPeople([]);
        setDeferredPeople([]);
        setChosenPerson(null);
      });
  }, []);

  return (
    <div className="PeoplePicker">
      <div id="people-picker-title">
        <h1>People Picker</h1>
      </div>

      <div className="buttonRow">
        <button onClick={() => chooseRandomPerson()}>Choose</button>
        <button onClick={() => fetchPeople()}>Reset</button>
        {chosenPeople && <button onClick={deferPerson}>Defer</button>}
      </div>

      <section className="chosenPerson">
        {chosenPerson ? <><h2>Chosen Person</h2><Person person={chosenPerson} /></> : <p className="alert info">Hit the choose button to select a random person</p>}
      </section>

      <hr />

      <h2>Unchosen People</h2>
      <section className="unchosenPeople">
        {unchosenPeople
          .map((p, index) => <Person person={p} key={index} />)}
      </section>

      <hr />

      <h2>Already chosen People</h2>
      <section className="chosenPeople">
        {chosenPeople.map(p => p && p.id ? <Person person={p} key={p.id} /> : null)}
      </section>

      <hr />

      <h2>Deferred People</h2>
      <section className="deferredPeople">
        {deferredPeople.map(p => p && p.id ? <Person person={p} key={p.id} /> : null)}
      </section>
    </div>
  );

  function chooseRandomPerson() {
    if (unchosenPeople.length === 0 && deferredPeople.length === 0) {
      fetchPeople();
      return;
    }
    let person;
    if (unchosenPeople.length > 0) {
      person = unchosenPeople[Math.floor(Math.random() * unchosenPeople.length)];
      setUnchosenPeople(unchosenPeople.filter(p => p !== person));
    } else {
      person = deferredPeople[Math.floor(Math.random() * deferredPeople.length)];
      setDeferredPeople(deferredPeople.filter(p => p !== person));
    }
    setChosenPerson(person);
    setChosenPeople([...chosenPeople, person])
  }

  function deferPerson() {
    if (chosenPerson) {
      setDeferredPeople([...deferredPeople, chosenPerson]);
      setChosenPeople(chosenPeople.filter(p => p !== chosenPerson));
      setChosenPerson(null);
    }
  }
}


