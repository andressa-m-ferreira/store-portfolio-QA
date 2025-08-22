import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
    vus: 10,
    duration: '30s',
};

export default function () {
    let loginRes = http.post('http://localhost:3000/api/auth/login', JSON.stringify({
        email: 'test@test.com',
        password: 'test123',
    }),
        {
            headers: { 'Content-Type': 'application/json' },
        });

    check(loginRes, { 'login status is 200': (r) => r.status === 200 });

    const sessionToken = loginRes.json().sessionToken;

    let addCartRes = http.post('http://localhost:3000/api/cart/add', JSON.stringify({
        productId: 2
    }),
        {
            headers: {
                'Content-Type': 'application/json'
            },
        });

    check(addCartRes, { 'add to cart status is 200': (r) => r.status === 200 });


    let cartRes = http.get('http://localhost:3000/api/cart');
    check(cartRes, { 'get cart status is 200': (r) => r.status === 200 });

    sleep(1);
}