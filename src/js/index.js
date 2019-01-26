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
        try{
            //4). Search for recipes
            await state.search.getResults();
            //5). Render results on UI
            searchView.renderResults(state.search.result);
            clearLoader();

        }catch (e) {
            alert('Something went wrong with the search');
            clearLoader();
        }

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
const controlRecipe = async () => {
  //Get ID from url
  const id = window.location.hash.replace('#', '');
  console.log(id);
  if(id){
      //Prepare UI for changes

      //Create a new recipe object

      state.recipe = new Recipe(id);
      //TESTING
      window.r = state.recipe;

      try{
          //Get recipe data
          await state.recipe.getRecipe();
          //Calculate serving and time
          state.recipe.calcTime();
          state.recipe.calcSevings();
          //Render recipe
          console.log(state.recipe);
      }catch (error) {
          alert('error processing the recipe:(');

      }
  }
};

window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));