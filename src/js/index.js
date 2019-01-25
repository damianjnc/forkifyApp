// Global app controller

import Search from './models/Search';
import Recipe from './models/Recipe';
import {elements, renderLoader, clearLoader} from './views/base';
import * as searchView from './views/SearchView';

/*Global state of the app
* Search object
* Current recipe object
* shopping list object
* Liked recipes*
* */

const state  = {};

/*
**Search Controller
 */

const controlSearch = async () => {
    // 1). Get query from view
    const query = searchView.getInput();
    console.log(query);
    if(query){
        //2. New search object and add to state
        state.search = new Search(query);
        //3). Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        //4). Search for recipes
        await state.search.getResults();
        //5). Render results on UI
        searchView.renderResults(state.search.result);
        clearLoader();
    }

};

elements.searchForm.addEventListener('submit', e =>{
      e.preventDefault();
      controlSearch();
});


elements.searchResPages.addEventListener('click', e=> {
    const btn = e.target.closest('.btn-inline');
    console.log(btn);
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        console.log(goToPage);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);

    }

});

/*
** Recipe Controller
 */

const r = new Recipe(46956);
r.getRecipe();
console.log(r);