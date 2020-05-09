console.log('Client-side code running');

const button = document.getElementById('uri');
button.addEventListener('click', function(e) {
    console.log('button was clicked');

    fetch('/url', {method: 'POST'})
        .then(function(response) {
            console.log(response.body)
            if(response.ok) {
                console.log('Click was recorded');
                return;
            }
            throw new Error('Request failed.');
        })
        .catch(function(error) {
            console.log(error);
        });
});