const api = axios.create({
    baseURL: 'https://api.thedogapi.com/v1'
});
api.defaults.headers.common['X-API-KEY'] = '1bc9b11d-a528-4dcb-86c6-7da04ff102ee';


// const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=3&api_key=efdac3d8-2a34-44e9-9eab-b65f6d1e3f27';
// const API_URL_FAVORITES = 'https://api.thecatapi.com/v1/favourites';
// const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';
// const API_URL_FAVORITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;

// thedogapi.com
const API_URL_RANDOM = 'https://api.thedogapi.com/v1/images/search?limit=3';
const API_URL_FAVORITES = 'https://api.thedogapi.com/v1/favourites';
const API_URL_UPLOAD = 'https://api.thedogapi.com/v1/images/upload';
const API_URL_FAVORITES_DELETE = (id) => `https://api.thedogapi.com/v1/favourites/${id}`;

const spanError =  document.getElementById('error');

/** Esta funcion fetch() nos devuelve una promesa
 * Cuando cargamos una API lo primero que debemos hacer es convertir esa respuesta a algo que JS pueda comprender por ejemplo un .json
 */
/*fetch(URL)
    .then(res => res.json())
    .then(data => {
        const img = document.querySelector('img'); // agarro la etiqueta o nodo de este elemento
        img.src = data[0].url;
    });*/

const loadRandomCat = async () => {
    const response = await fetch(API_URL_RANDOM); // GET
    const data = await response.json();
    console.log("Random");
    console.log(data);
    if (response.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + response.status;
    } else {
        const img1 = document.getElementById('img1');
        const img2 = document.getElementById('img2');
        const img3 = document.getElementById('img3');
        const btn1 = document.getElementById('btn1');
        const btn2 = document.getElementById('btn2');
        const btn3 = document.getElementById('btn3');

        img1.src = data[0].url;
        img2.src = data[1].url;
        img3.src = data[2].url;

        btn1.onclick = () => saveFavCat(data[0].id);
        btn2.onclick = () => saveFavCat(data[1].id);
        btn3.onclick = () => saveFavCat(data[2].id);
    }
}

const loadFavCat = async () => {
    const response = await fetch(API_URL_FAVORITES, {
        method: 'GET',
        headers: {
            // 'X-API-KEY': 'efdac3d8-2a34-44e9-9eab-b65f6d1e3f27',
            'X-API-KEY': '1bc9b11d-a528-4dcb-86c6-7da04ff102ee', // thedogapi.com
        }
    }); // GET
    const data = await response.json();
    console.log("Favourites");
    console.log(data);
    if (response.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + response.status + " " + data.message; // mejorar este error
    } else {
        const section = document.getElementById('favCat');
        section.innerHTML = "";
        data.forEach(kitty => {
            const div = document.createElement('div');
            const h2 = document.createElement('h2');
            const h2Text = document.createTextNode('Favorito');
            const img = document.createElement('img');
            const btn = document.createElement('button');
            const btnText = document.createTextNode('Sacar de favoritos');

            img.src = kitty.image.url;
            img.width = 170;
            btn.appendChild(btnText);
            btn.onclick = () => deleteFavCat(kitty.id);
            h2.appendChild(h2Text);
            div.appendChild(h2);
            div.appendChild(img);
            div.appendChild(btn);
            section.appendChild(div);

        });
    }
}

const saveFavCat = async (id) => {
    const { data, status } = await api.post('/favourites', {
        image_id: id,
    });
    /*const response = await fetch(API_URL_FAVORITES, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'X-API-KEY': 'efdac3d8-2a34-44e9-9eab-b65f6d1e3f27',
            'X-API-KEY': '1bc9b11d-a528-4dcb-86c6-7da04ff102ee', // thedogapi.com
        },
        body: JSON.stringify({
            image_id: id
        }),
    });
    const data = await response.json();*/

    console.log('save');
    console.log(data);
    if (status !== 200) {
        spanError.innerHTML = "Hubo un error: " + status + " " + data.message; // mejorar este error
    } else {
        console.log('Gato guardado en favoritos');
        loadFavCat();
    }
}

const deleteFavCat = async (id) => {
    const response = await fetch(API_URL_FAVORITES_DELETE(id), {
        method: 'DELETE',
        headers: {
            // 'X-API-KEY': 'efdac3d8-2a34-44e9-9eab-b65f6d1e3f27',
            'X-API-KEY': '1bc9b11d-a528-4dcb-86c6-7da04ff102ee', // thedogapi.com
        }
    });
    const data = await response.json();
    if (response.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + response.status + " " + data.message; // mejorar este error
    } else {
        console.log('Gato eliminado de favoritos');
        loadFavCat();
    }
}

const uploadCatPhoto = async () => {
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form);

    console.log(formData.get('file'));

    const response = await fetch(API_URL_UPLOAD, {
        method: 'POST',
        headers: {
            // 'Content-Tyle': 'multipart/form-data',
            // 'X-API-KEY': 'efdac3d8-2a34-44e9-9eab-b65f6d1e3f27',
            'X-API-KEY': '1bc9b11d-a528-4dcb-86c6-7da04ff102ee', // thedogapi.com
        },
        body: formData,
    });
    const data = await response.json();
    if (response.status !== 201) {
        spanError.innerHTML = "Hubo un error: " + response.status + " " + data.message; // mejorar este error
        console.log({data});
    } else {
        console.log("Foto cargada correctamente");
        console.log({data});
        console.log(data.url);
        saveFavCat(data.id);
        // loadFavCat();
    }
}

loadRandomCat();
loadFavCat();
// saveFavCat();
