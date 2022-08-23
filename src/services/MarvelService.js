// require('dotenv').config()
// import 'dotenv/config'

// console.log(process.env.REACT_APP_API_KEY)
// console.log(process.env.REACT_APP_MARVEL_API_KEY);

class MarvelService {
    
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = process.env.REACT_APP_MARVEL_API_KEY;
    

    getResource = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    getAllCaracters = () => {
        return this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
    }
    getCaracter = (id) => {
        return this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
    }

}

export default MarvelService;
