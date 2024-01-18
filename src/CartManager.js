const fs = require('fs').promises;

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
        this.nextCartId = 1;
        this.loadCarts();
    }

    async loadCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            this.carts = JSON.parse(data);
            this.nextCartId = this.carts.reduce((max, cart) => Math.max(max, cart.id), 0) + 1;
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.log("El archivo de carritos no existe. Se iniciará un nuevo arreglo de carritos.");
                this.carts = [];
            } else {
                throw err;
            }
        }
    }

    async saveCarts() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2), 'utf8');
    }

    async createCart() {
        const cart = { id: this.nextCartId++, products: [] };
        this.carts.push(cart);
        await this.saveCarts();
        return cart;
    }

    async getCartById(cartId) {
        const cart = this.carts.find(cart => cart.id === cartId);
        return cart || { error: 'Carrito no encontrado' };
    }

    async addToCart(cartId, productId, quantity = 1) {
        const cart = await this.getCartById(cartId);
        if (cart.error) return cart;

        const productIndex = cart.products.findIndex(p => p.id === productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ id: productId, quantity });
        }

        await this.saveCarts();
        return cart;
    }
}

module.exports = CartManager;
