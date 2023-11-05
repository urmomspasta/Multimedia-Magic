// Wait for the DOM to be fully loaded before executing JavaScript
document.addEventListener("DOMContentLoaded", function () {
    console.log("Document is ready.");

    // Function to toggle the search bar
    document.getElementById("search-icon").addEventListener("click", function () {
        const nav = document.querySelector(".nav");
        nav.classList.toggle("search");
        nav.classList.toggle("no-search");
        document.querySelector(".search-input").classList.toggle("search-active");
    });

    // Function to handle clicking the cart icon
    document.getElementById("cart-icon").addEventListener("click", function () {
        window.location.href = "cart.html"; // Redirect to the cart.html page
    });

    // Function to toggle the mobile menu
    document.querySelectorAll('.menu-toggle').forEach(function (button) {
        button.addEventListener("click", function () {
            const nav = document.querySelector(".nav");
            nav.classList.toggle("mobile-nav");
            this.classList.toggle("is-active");
        });

    });

    // Initialize an empty shopping cart
    let cart = [];

    // Function to add items to the cart
    function addToCart(productID) {
        // Check if the product is already in the cart
        const isProductInCart = cart.some((item) => item.productID === productID);
        if (isProductInCart) {
            // If the product is in the cart, remove it
            removeFromCart(productID);
        } else {
            // If the product is not in the cart, add it
            const productInfo = getProductInfo(productID);
            if (productInfo) {
                const product = {
                    productID,
                    name: productInfo.name,
                    price: productInfo.price,
                    imageUrl: productInfo.imageUrl
                };
                cart.push(product);
            }
        }

        updateCartDisplay(); // Update the cart display
        saveCartToLocalStorage();
        updateAddToCartIconsColor(); // Update the icons' color
    }

    // Function to remove an item from the cart
    function removeFromCart(productID) {
        cart = cart.filter((item) => item.productID !== productID);
        updateCartDisplay();
        saveCartToLocalStorage();
        updateAddToCartIconsColor(); // Update the icons' color
    }

    function updateCartDisplay() {
        const cartDisplay = document.getElementById("cart-display");

        cartDisplay.innerHTML = ""; // Clear the previous content

        // Loop through the cart and display each item
        cart.forEach((product) => {
            const item = document.createElement("div");
            item.classList.add("cart-item"); // Add the cart-item class
            item.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${product.name}</div>
                    <div class="cart-item-price">$${product.price}</div>
                    <div class="cart-item-remove" data-product="${product.productID}">Remove</div>
                </div>
            `;
            cartDisplay.appendChild(item);

            // Add a click event listener to the "Remove" button
            const removeButton = item.querySelector(".cart-item-remove");
            removeButton.addEventListener("click", () => {
                removeFromCart(product.productID);
            });
        });
    }

    // Function to toggle between check mark and "Add to Cart" icon
    function toggleAddToCartIcon(icon, productID) {
        const isProductInCart = cart.some((item) => item.productID === productID);

        if (isProductInCart) {
            removeFromCart(productID);
            icon.classList.remove("added-to-cart-icon");
            icon.classList.remove("fa-check");
            icon.classList.add("fa-cart-plus");
            icon.style.color = "#000000";
        } else {
            addToCart(getProductInfo(productID));
            icon.classList.remove("add-to-cart-icon");
            icon.classList.remove("fa-check");
            icon.classList.add("fa-cart-plus");
            icon.style.color = "#000000"; // Change color to black on toggle
        }
    }

    // Event listener for the "Add to Cart" icons on the explore page
    const addToCartIcons = document.querySelectorAll(".fa-cart-plus");
    const addedToCartIcons = document.querySelectorAll(".fa-check");

    addToCartIcons.forEach((icon) => {
        icon.addEventListener("click", (event) => {
            const productID = event.target.getAttribute("data-product");
            toggleAddToCartIcon(icon, productID);
        });

        // Add hover effect for the updated icon
        icon.addEventListener("mouseover", function () {
            if (icon.classList.contains("fa-cart-plus")) {
                icon.style.color = "#808080"; // Change color to gray (#808080) on hover
            }
        });

        // Restore the original color when not hovering
        icon.addEventListener("mouseout", function () {
            if (icon.classList.contains("fa-cart-plus")) {
                icon.style.color = "#000000"; // Change color back to #000000
            }
        });
    });

    addedToCartIcons.forEach((icon) => {
        icon.addEventListener("click", (event) => {
            const productID = event.target.getAttribute("data-product");
            toggleAddToCartIcon(icon, productID);
        });

        // Add hover effect for the updated icon
        icon.addEventListener("mouseover", function () {
            if (icon.classList.contains("fa-check")) {
                icon.style.color = "#808080"; // Change color to gray (#808080) on hover
            }
        });

        // Restore the original color when not hovering
        icon.addEventListener("mouseout", function () {
            if (icon.classList.contains("fa-check")) {
                icon.style.color = "#BB84E8"; // Change color back to #BB84E8
            }
        });
    });


    // Function to toggle "Add to Cart" and "Remove from Cart" icons
    function toggleAddToCartIcon(icon, productID) {
        if (icon.classList.contains("added-to-cart-icon")) {
            // Remove from Cart
            icon.classList.remove("added-to-cart-icon");
            icon.classList.add("add-to-cart-icon");
            icon.classList.remove("fa-check");
            icon.classList.add("fa-cart-plus");
            icon.style.color = "#000000"; // Change color back to black
            removeFromCart(productID);
        } else if (icon.classList.contains("add-to-cart-icon")) {
            // Add to Cart
            icon.classList.remove("add-to-cart-icon");
            icon.classList.add("added-to-cart-icon");
            icon.classList.remove("fa-cart-plus");
            icon.classList.add("fa-check");
            icon.style.color = "#BB84E8"; // Change color to #BB84E8
            addToCart(productID);
        }
        updateAddToCartIconsColor(); // Update the icons' color
    }


    // Function to update the "Add to Cart" icons' color
    function updateAddToCartIconsColor() {
        addToCartIcons.forEach((icon) => {
            const productID = icon.getAttribute("data-product");
            const isProductInCart = cart.some((item) => item.productID === productID);

            if (isProductInCart) {
                icon.classList.remove("fa-cart-plus");
                icon.classList.add("fa-check");
                icon.style.color = "#BB84E8";
            } else {
                icon.classList.remove("fa-check");
                icon.classList.add("fa-cart-plus");
                icon.style.color = "#000000";
            }
        });
    }


    // Load the cart from local storage when the page loads
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCartDisplay();
        updateAddToCartIconsColor();
    }

    // Function to save the cart to local storage
    function saveCartToLocalStorage() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    function getProductInfo(productID) {
        // Implement your logic to retrieve product information here
        // For now, we'll return some placeholder data
        switch (productID) {
            case "1":
                return {
                    name: "Rose Resin Earrings",
                    price: 15,
                    imageUrl: "https://i.postimg.cc/nL2DwNRV/image.png"

                };
            case "2":
                return {
                    name: "Elegant Rose Earrings",
                    price: 20,
                    imageUrl: "https://i.postimg.cc/T2FkTHGY/image.png"
                };
            case "3":
                return {
                    name: "Tear Drop Earrings",
                    price: 35,
                    imageUrl: "https://i.postimg.cc/7YzTy5sW/image.png"
                };
            // Add more cases for other products
            default:
                return { name: "Unknown Product", price: 0, imageUrl: "" };
        }

        console.log("Image URL for product " + productID + ": " + imageUrl);
        return { name, price, imageUrl };
    }

});