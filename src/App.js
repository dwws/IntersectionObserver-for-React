import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [listPart, setListPrt] = useState();
  const [itemList, setItemList] = useState([]);

  const observerRef = useRef(null);
  const rootRef = useRef(null);
  const lastElementRef = useRef(null);

  let page = 1;

  const onFetch = () => {
    fetch(`https://jsonplaceholder.typicode.com/todos?_limit=5&_page=${page++}`)
      .then((response) => response.json())
      .then((json) => setListPrt(json));
  };

  const cb = ([entry], observer) => {
    if (entry.isIntersecting) {
      observer.unobserve(lastElementRef.current);
      onFetch();
    }
  };

  useEffect(() => {
    onFetch();
    observerRef.current = new IntersectionObserver(cb);
    return () => {
      observerRef.current.unobserve(lastElementRef.current);
    };
  }, []);

  useEffect(() => {
    listPart && setItemList([...itemList, ...listPart]);
  }, [listPart]);

  useEffect(() => {
    if (lastElementRef.current !== rootRef.current.lastChild) {
      lastElementRef.current = rootRef.current.lastChild;
      observerRef.current.observe(lastElementRef.current);
    }
  }, [itemList]);

  return (
    <div className="App">
      <header className="App-header">
        <ul ref={rootRef}>
          {itemList.map((item) => (
            <li key={item.id}>
              <p>{`${item.id} ${item.title}`}</p>
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
