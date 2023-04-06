import React from 'react';
import { Route } from 'react-router';
import { zUserRoute, zManagerRoute } from './routes/route';
export default (
  <Route>
    {zUserRoute.map((route, idx) => (
      <Route path={route.link} />
    ))}
    {zManagerRoute.map((route, idx) => (
      <Route path={route.link} />
    ))}
  </Route>
);