// Global app controller

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import {elements, renderLoader, clearLoader} from './views/base';
import * as searchView from './views/SearchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';

/*Global state of the app
* Search object
* Current recipe object
* shopping list object
* Liked recipes*
* */

const state  = {};
window.state = state; 

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
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

    //Highlight selected search item
    if(state.search) searchView.highlightSelected(id);

    //Create a new recipe object

      state.recipe = new Recipe(id);


      try{
          //Get recipe data and parse ingredients
          await state.recipe.getRecipe();
          state.recipe.parseIngredients();
          //Calculate serving and time
          state.recipe.calcTime();
          state.recipe.calcSevings();
          //Render recipe
          clearLoader();
          recipeView.renderRecipe(state.recipe);
      }catch (error) {
          alert('error processing the recipe:(');

      }
  }
};


['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * LIST CONTROLLER
 */

 const controlList = () => {
     //Create a new list if there is none yet
    if(!state.list) state.list = new List(); 

    //Add each element to the list and UI 
    state.recipe.ingredients( el => {
       const item = state.list.addItem(el.count, el.unit, el.ingredient);
       listView.renderItem(item);
    });

 }

 //Handling delete and update list item events 
 elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //Handle the delete item
    if(e.target.matches('.shopping__delete .shopping__delete *')){
        //Delete from state
        state.list.deleteItem(id);

        //Delete from UI
        listView.deleteItem(id);
    //Handle the count update
    }else if(e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
 });

//Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        //Decrease button is clicked
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        } 
    }else if(e.target.matches('.btn-increase, .btn-increase *')){
        //Increase button was clicked
        state.recipe.updateServings('inc'); 
        recipeView.updateServingsIngredients(state.recipe);
       
    }else if(e.target.matches('.recipe__btn--add, recipe__btn--add *')){
        controlList();
    }

});


window.l = new List();