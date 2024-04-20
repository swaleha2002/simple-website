document.addEventListener("DOMContentLoaded", function() {
    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.dataset.category;
            fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json')
                .then(response => response.json())
                .then(data => {
                    displayProducts(data.categories, category);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        });
    });
});

function displayProducts(categories, category) {
    const filteredProducts = categories.reduce((acc, curr) => {
        if (category === 'all' || curr.category_name.toLowerCase() === category.toLowerCase()) {
            acc.push(...curr.category_products);
        }
        return acc;
    }, []);

    const html = filteredProducts.map((product, index) => {
        const truncatedTitle = truncateTitle(product.title); // Truncate title if needed

        return `
            <div class="card" data-category="${product.category}">
                <div class="badge">${product.badge_text || ''}</div>
                <img class="product-image" src="${product.image}" alt="${product.title}">
                <div class="product-details">
                    <div class="title-vendor">
                        <h3 class="product-title">${truncatedTitle}</h3>
                        <p class="vendor">${product.vendor}</p>
                    </div>
                    <div class="price-details">
                        <p class="price">$${product.price}</p>
                        <p class="compare-price">$${product.compare_at_price}</p>
                        <p class="discount">${calculateDiscount(product.price, product.compare_at_price)}</p>
                    </div>
                    <button class="add-to-cart">Add to Cart</button>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('data-container').innerHTML = html;
}

function calculateDiscount(price, comparePrice) {
    const discount = ((comparePrice - price) / comparePrice) * 100;
    return Math.round(discount) + '% off';
}

function truncateTitle(title) {
    const maxLength = 10; // Maximum length for the title
    if (title.length > maxLength) {
        return title.substring(0, maxLength) + '...'; // Truncate and add ellipsis
    }
    return title;
}
