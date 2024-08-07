import React, { useState, useEffect, useLayoutEffect } from 'react';
import './App.css';
import HelloUser from './components/HelloUser'

const App = () => {

  const [loaded, setLoaded] = useState(false);
  const [child, setChild] = useState(<h3>App is loading</h3>)

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '{{{appclient}}}';
    script.addEventListener('load', () => setLoaded(true));
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  useEffect(() => { console.log("testing for template data")},[])  

  useEffect(() => {
    if (!loaded) return
    app.initialized().then((client) => {
      console.log("inside intialized")
      client.events.on("app.activated", appActiveHandler);
      // client.events.on("app.deactivated", appDeactiveHandler);
      //Define handler
      function appActiveHandler() {
        console.info("App is activated");
      }
      // // function appDeactiveHandler() {
      // //   console.info("App is deactivated");
      // // }
      client.instance.resize({ height: "610px" });
      setChild((<HelloUser client={client} />))
    })
  }, [loaded])

  return (
    <div>
      {child}
    </div>
  )
}

export default App;
