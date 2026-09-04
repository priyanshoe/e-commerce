
import axios from "axios";
const url = import.meta.env.VITE_API_URL;

async function getOrderByUser(id) {
    try {
        const result = await axios.get(`${url}/orders?customerId=${id}`);
        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}

async function getOrderBySeller(businessId) {
    try {
        const result = await axios.get(`${url}/orders`);
        const sellerOrders = result.data.filter(order =>
            order.products.some(
                product => String(product.businessId) === String(businessId)
            ));
        return { success: true, status: 200, data: sellerOrders };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}

async function getOrders() {
    try {
        const result = await axios.get(url + "/orders");
        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}

async function getOrder(id) {
    try {
        const result = await axios.get(url + "/orders/" + id);
        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}

async function save(data) {
    try {
        const result = await axios.post(url + "/orders", data);
        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}

async function update(id, status) {
    try {
        const orderResult = await axios.get(url + "/orders/" + id);
        const order = orderResult.data;
        const shouldAdjustStock =
            (status === "SHIPPED" || status === "DELIVERED") &&
            !order.inventoryAdjusted;

        if (shouldAdjustStock) {
            // Fetch each product's current stock so a status change never overwrites
            // a stock edit made after the order was placed.
            const quantitiesByProduct = (order.products || []).reduce((quantities, item) => {
                const productId = String(item.productId);
                quantities.set(productId, (quantities.get(productId) || 0) + (Number(item.quantity) || 0));
                return quantities;
            }, new Map());

            await Promise.all(
                Array.from(quantitiesByProduct).map(async ([productId, orderedQuantity]) => {
                    const productResult = await axios.get(url + "/products/" + productId);
                    const currentStock = Number(productResult.data.stock) || 0;

                    await axios.patch(url + "/products/" + productId, {
                        stock: Math.max(0, currentStock - orderedQuantity),
                    });
                })
            );
        }

        // Persist the flag with the status. It prevents a later SHIPPED -> DELIVERED
        // update from subtracting the same order quantities a second time.
        const result = await axios.patch(url + "/orders/" + id, {
            status,
            ...(shouldAdjustStock ? { inventoryAdjusted: true } : {}),
        });

        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}

async function deleteItem(id) {
    try {
        const result = await axios.delete(url + "/orders/" + id);
        return { success: true, status: 200, data: result.data };
    } catch (error) {
        throw { success: false, status: error.status || 500, error: error.message };
    }
}



export default { getOrderByUser, getOrderBySeller, getOrders, getOrder, save, update, deleteItem }
