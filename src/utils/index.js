const formatShortDateUS = (dateString) => {
  if (!dateString) return;

  const date = new Date(dateString);
  const dateFormatted = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

  return dateFormatted;
};

const formatDateDashes = (dateString) => {
  if (!dateString) return;

  const date = new Date(dateString);
  const formatted =
    date.getMonth() + 1 + "-" + date.getDate() + "-" + date.getFullYear();

  return formatted;
};

const formatDate = (dateString) => {
  if (!dateString) return;

  const date = new Date(dateString);
  const formatted =
    date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();

  return formatted;
};

const textEllipsis = (
  str,
  maxLength,
  { side = "end", ellipsis = "..." } = {}
) => {
  if (!str) return "";
  if (str.length > maxLength) {
    switch (side) {
      case "start":
        return ellipsis + str.slice(-(maxLength - ellipsis.length));
      case "end":
      default:
        return str.slice(0, maxLength - ellipsis.length) + ellipsis;
    }
  }
  return str;
};

const getProductImages = (product) => {
  const images = [];
  if (product?.ProductThumbnailURl) images.push(product?.ProductThumbnailURl);

  if (product?.ThumbnailURL) images.push(product?.ThumbnailURL);

  if (product?.ImageURL) images.push(product?.ImageURL);

  return images;
};

const itemLoading = (templateItem, loadingObj) => {
  return loadingObj?.loading && loadingObj?.ID === templateItem?.ID;
};

// to return the matching categories in chlilds array and most top-level their parent categories in the parents array
export function searchNestedCategoriesArray(array, searchTerm) {
  const parents = [];
  const allBelongings = [];

  function searchHelper(arr, parent, ancestors = []) {
    for (const item of arr) {
      const currentParents = [...ancestors, item]; // Store current item and its ancestors
      if (item.Name?.toLowerCase()?.includes(searchTerm.toLowerCase())) {
        if (!parents?.some((s) => s.ID === parent?.ID || s.ID === item?.ID))
          parents.push(parent || item); // If parent exists, push it to the result, otherwise push the item itself

        if (!allBelongings.some((s) => s.ID === item?.ID))
          allBelongings.push(...currentParents);
      }
      if (item.SubCategories && item.SubCategories.length > 0) {
        searchHelper(item.SubCategories, parent || item, currentParents); // Keep track of the root parent
      }
    }
  }

  searchHelper(array);

  return { parents, allBelongings };
}

const Utils = {
  formatShortDateUS,
  formatDateDashes,
  textEllipsis,
  formatDate,
  getProductImages,
  itemLoading,
  searchNestedCategoriesArray,
};

export default Utils;
