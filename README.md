# Personal webiste

This is the repo for http://joeandre.ws. It is a simple ES6 site, using webpack and babel. The main feature of the site is a Canvas ant colony simulation.

---

#### Local Dev

1. `npm install`
2. `npm start`


---


The ants in the simulation, move in a psuedo random fashion influenced by pheromone trails. The anys leave pheromone trails everywhere they go. If they encouter food, they will turn red and change direction 180 degrees, following the trails back to the ant hill.
