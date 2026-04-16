function ProductCard({ product }) {
  return (
    <div className="card">
      <div className="badge">{product.discount}%</div>
      <img src={product.image} alt={product.name} />
      <h4>{product.name}</h4>
      <div className="rating">⭐⭐⭐⭐☆</div>
    </div>
  );
}

export default ProductCard;