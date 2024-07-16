document.addEventListener('DOMContentLoaded', () => {
    const urlPath = window.location.pathname;
    const parts = urlPath.split('/');
    const bookingId = parts[parts.length - 1];

    // redirect to another page and delete booking detail
    const redirectToHomePage = () => {
        // redirect notice
        window.alert(
            'Bạn đã hết thời gian thực hiện thanh toán, hệ thống sẽ tự động hủy vé!'
        );

        // delete booking detail
        fetch('/api/v1/booking/canceled', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ticketDetailId: bookingId }),
        })
            .then((data) => {
                console.log('Success:', data);
                window.location.href = '/'; // Replace with your desired URL
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    // Set a timeout to trigger after 5 minutes (300000 milliseconds)
    setTimeout(() => {
        redirectToHomePage();
    }, 60000); // 60 second
});
