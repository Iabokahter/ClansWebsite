import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import ClanBrowserPage from "./components/ClanBrowserPage";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/ClanBrowserPage',
    element: <ClanBrowserPage/>
  }
];

export default AppRoutes;
