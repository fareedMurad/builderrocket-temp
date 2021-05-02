const formatShortDateUS = (dateString) => {
    const date = new Date(dateString);
    const dateFormatted = new Intl.DateTimeFormat('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' }).format(date);

    return dateFormatted;
}

const formatDateDashes = (dateString) => {
    if (!dateString) return;

    const date = new Date(dateString);
    const formatted = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();

    return formatted;
}



const Utils = {
    formatShortDateUS,
    formatDateDashes
}

export default Utils;