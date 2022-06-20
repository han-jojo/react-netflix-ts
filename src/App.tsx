import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path={`${process.env.PUBLIC_URL}/search`}>
          <Search />
        </Route>
        <Route
          path={[
            `${process.env.PUBLIC_URL}/tv`,
            `${process.env.PUBLIC_URL}/tv/:tvSeriesId`,
          ]}
        >
          <Tv />
        </Route>
        <Route
          path={[
            `${process.env.PUBLIC_URL}`,
            `${process.env.PUBLIC_URL}/movies/:movieId`,
          ]}
        >
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
