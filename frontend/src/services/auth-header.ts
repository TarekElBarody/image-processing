export default function authHeader() {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    let user = null;
    if (userStr) user = JSON.parse(userStr);

    if (user && token) {
        // return { Authorization: 'Bearer ' + user.accessToken }; // for Spring Boot back-end
        return { auth: { Authorization: 'Bearer ' + token }, user: user }; // for Node.js Express back-end
    } else {
        return { auth: { Authorization: '' }, user: user };
    }
}
