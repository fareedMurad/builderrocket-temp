const formatShortDateUS = (dateString) => {
    if (!dateString) return;

    const date = new Date(dateString);
    const dateFormatted = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);

    return dateFormatted;
}

const formatDateDashes = (dateString) => {
    if (!dateString) return;

    const date = new Date(dateString);
    const formatted = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();

    return formatted;
}

const formatDate = (dateString) => {
    if (!dateString) return;

    const date = new Date(dateString);
    const formatted = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();

    return formatted;
}

const textEllipsis = (str, maxLength, { side = "end", ellipsis = "..." } = {}) => {
    if(!str) return '';
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
  }

const Utils = {
    formatShortDateUS,
    formatDateDashes,
    textEllipsis,
    formatDate
}

export default Utils;
