import * as Home from '../viewpage/home_page.js'

export const routePathnames = {
    HOME: '/',
}

export const routes = [
    {pathname: routePathnames.HOME, page: Home.home_page},
];

export function routing(pathname, hash) {
    const route = routes.find(r => r.pathname == pathname);
    if (route) route.page();
    else routes[0].page();
}