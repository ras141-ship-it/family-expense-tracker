function getMostBoughtProduct(products) {
  if (!products || products.length === 0) return null;

  const countMap = {};
  let maxCount = 0;
  let mostBought = null;

  for (const product of products) {
    countMap[product] = (countMap[product] || 0) + 1;

    if (countMap[product] > maxCount) {
      maxCount = countMap[product];
      mostBought = product;
    }
  }

  return mostBought;
}
