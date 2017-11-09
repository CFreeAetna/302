(function() {
    document.querySelector('#chain').addEventListener('click', () => {
        console.log('chain clicked');

        axios.get('http://localhost:3040/first')
            .then((res) => {
                console.log('redirect data:', res);
            })
            .catch(err => err);
    });

    document.querySelector('#auth-retry').addEventListener('click', () => {
        console.log('auth retry clicked');

        axios.get('http://localhost:3040/api_request')
            .then((res) => {
                console.log('api request data:', res);
            })
            .catch(err => {
                console.log('failed api request');
                return Promise.reject(err);
            });
    });

    axios.interceptors.response.use(
        (res) => {
            console.log('interceptor: response success', res.config.url);
            return res;   
        },
        (error) => {
            const originalRequest = error.config;
            console.log('original request cached:', originalRequest);

            if (error.response.status && error.response.status == 401 && !originalRequest._retry) {
                console.log('Location:', error.response.headers.location);
                originalRequest._retry = true;

                return axios.get(error.response.headers.location)
                    // Retry original request
                    .then(() => {
                        console.log('trying original request');
                        return axios.get(originalRequest.url);
                    })
                    // Fail as per usual when request fails
                    .catch((redirectError) => {
                        console.log('failed to redirect');
                        return Promise.reject(redirectError)
                    });
            }

            // Fail as per usual when conditions not met
            return Promise.reject(error);
        }
    );
})();