// Global app controller

import axios from 'axios';
async function getResults(query) {
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const key = '4bb5753f7b44297963bd2babd190b826';
    const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key} & q=${query}`);
    const  recipes = res.data.recipes;
    console.log(recipes);
}
getResults('pizza');


// 4bb5753f7b44297963bd2babd190b826
// https://www.food2fork.com/api/search
// https://cors-anywhere.herokuapp.com/
