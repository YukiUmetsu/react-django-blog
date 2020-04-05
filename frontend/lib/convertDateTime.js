const convertDateTime = (dateTimeStr) => {
    let date = new Date(dateTimeStr);
    return `${date.getUTCFullYear()}/${date.getUTCMonth()+1}/${date.getUTCDate()}`;
};

export default convertDateTime