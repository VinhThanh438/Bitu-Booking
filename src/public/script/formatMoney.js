const formatMoney = () => {
    const vndElements = document.getElementsByClassName('price');
    for (let i = 0; i < vndElements.length; i++) {
        const number = parseInt(vndElements[i].innerText);
        const formattedNumber = number.toLocaleString('vi-VN') + 'đ';
        vndElements[i].innerText = formattedNumber;
    }
};

formatMoney();
