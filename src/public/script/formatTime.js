const formatDate = () => {
    const getE = document.querySelector('.formatTime');
    const getTime = getE.textContent;
    const date = new Date(getTime);

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    getE.textContent = `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
};

formatDate();
