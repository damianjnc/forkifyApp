import axios from 'axios';

export default class Search {
    constructor(query){
        this.query = query;
    }
    async getResults(query) {
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const key = '4bb5753f7b44297963bd2babd190b826';
        try{
            const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
           // console.log(recipes);
        }catch(error) {
            alert(error);
        }

    }
}




