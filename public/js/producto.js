const mainImage = document.getElementById('main-image');
const thumbnailImages = document.querySelectorAll('.thumbnail');
const colorCircles = document.querySelectorAll('.rojo, .verde, .gris, .azul, .marron, .rosa, .negro, .blanco');
const quantityElement = document.getElementById('quantity');
const decrementButton = document.getElementById('decrement');
const incrementButton = document.getElementById('increment');

function changeMainImage(newImageSrc, target) {
    mainImage.src = newImageSrc;

    // Elimina la clase "active" de todas las miniaturas
    thumbnailImages.forEach(thumb => {
        thumb.classList.remove('active');
    });

    // Elimina la clase "active" de todos los círculos de color
    colorCircles.forEach(circle => {
        circle.classList.remove('active');
    });

    // Agrega la clase "active" al elemento seleccionado
    target.classList.add('active');
}

thumbnailImages.forEach(thumbnail => {
    thumbnail.addEventListener('click', function() {
        const newImageSrc = thumbnail.getAttribute('data-image');
        changeMainImage(newImageSrc, thumbnail);
    });
});

colorCircles.forEach(circle => {
    circle.addEventListener('click', function() {
        const newImageSrc = circle.getAttribute('data-image');
        changeMainImage(newImageSrc, circle);
    });
});

decrementButton.addEventListener('click', function() {
    let quantity = parseInt(quantityElement.value);
    if (quantity > 1) {
        quantity--;
        quantityElement.value = quantity;
    }
});

incrementButton.addEventListener('click', function() {
    let quantity = parseInt(quantityElement.value);
    // Puedes definir el stock máximo permitido aquí (por ejemplo, 10)
    const stockMaximo = 10;
    if (quantity < stockMaximo) {
        quantity++;
        quantityElement.value = quantity;
    }
});