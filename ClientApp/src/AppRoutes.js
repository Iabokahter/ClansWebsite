import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import ClanBrowserPage from "./components/ClanBrowserPage";
import ClanPage from "./components/ClanPage";
import ClanContribution from "./components/ClanContribution";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/ClanBrowserPage',
    element: <ClanBrowserPage/>
  },
  {
    path: '/ClanPage',
    element: <ClanPage/>
  },
  {
    path: '/ClanContribution',
    element: <ClanContribution/>
  }
];

export default AppRoutes;
