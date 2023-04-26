class ProductoDTO {
    constructor(producto, cotizaciones) {
        this.nombre = producto.nombre;
        this.descripcion = producto.description;
        this.codigo = producto.codigo;
        this.precio = producto.precio;
        this.thumbnail = producto.thumbnail;
        this.stock = producto.stock;

        for (const [denominacion, valor] of Object.entries(cotizaciones)) {
            this[denominacion] = valor
        }
    }
}

export default ProductoDTO;