function getCookie(cookieName) {
    let name = cookieName + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function getRecentViews(cookieName) {
    let cookieValue = getCookie(cookieName);
    if (cookieValue) {
        let recentViews = cookieValue.split('|');
        return recentViews.map(view => {
            let [thumb, name, price, link] = view.split('@');
            return { thumb: decodeURIComponent(thumb), name: decodeURIComponent(name), price: decodeURIComponent(price), link: decodeURIComponent(link) };
        });
    }
    return [];
}
let recentProducts = getRecentViews("recentView");
let recentViewContainer = document.getElementById('recentViewContainer');
recentProducts.forEach(product => {
    let productDiv = document.createElement('div');
    productDiv.classList.add('product-item');
    let productLink = document.createElement('a');
    productLink.href = product.link;
    productLink.classList.add('product-link');
    let productImage = document.createElement('img');
    productImage.src = product.thumb;
    productImage.alt = product.name;
    productLink.appendChild(productImage);
    productDiv.appendChild(productLink);
    recentViewContainer.appendChild(productDiv);
    productImage.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = product.link;
    });
});
